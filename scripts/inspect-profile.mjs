#!/usr/bin/env node

import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { neon } from "@neondatabase/serverless";

function loadEnvFromFile(filePath) {
  if (!existsSync(filePath)) return;

  const contents = readFileSync(filePath, "utf8");
  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || !line.includes("=")) continue;

    const [key, ...rest] = line.split("=");
    if (!key || process.env[key] !== undefined) continue;

    let value = rest.join("=").trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

loadEnvFromFile(resolve(process.cwd(), ".env.local"));

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const sql = neon(databaseUrl);

function joinedProfileText(profile, D) {
  return [
    profile?.summary,
    profile?.builder_thesis,
    D?.summary,
    ...(Array.isArray(D?.projects)
      ? D.projects.flatMap((project) => [
          project?.name,
          project?.summary,
          project?.description,
        ])
      : []),
  ]
    .filter((value) => typeof value === "string" && value.trim())
    .join(" ")
    .toLowerCase();
}

function asNumber(value, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function inferConversationLikelihood(profile, D, E) {
  const projects = Array.isArray(D?.projects) ? D.projects : [];
  const hasProjects = projects.length > 0;
  const totalToolCalls = asNumber(profile?.total_tool_calls);
  const totalSessions = asNumber(profile?.total_sessions);
  const avgTools = totalSessions > 0 ? totalToolCalls / totalSessions : 0;
  const style = D?.style && typeof D.style === "object" ? D.style : {};
  const commandRatio = asNumber(style.command_ratio, 0);
  const comparison =
    E?.comparison && typeof E.comparison === "object" ? E.comparison : {};
  const hasAgentComparison = Object.keys(comparison).length > 1;
  const text = joinedProfileText(profile, D);
  const reflectiveSignals = [
    "journal",
    "emotion",
    "聊天",
    "陪伴",
    "情绪",
    "想法",
    "反思",
    "learn",
    "reflect",
    "thinking",
    "brainstorm",
    "question",
    "困惑",
    "解释",
  ].filter((term) => text.includes(term)).length;
  const builderSignals = [
    "api",
    "component",
    "deploy",
    "product",
    "saas",
    "frontend",
    "typescript",
    "python",
    "修复",
    "部署",
    "产品",
    "前端",
    "组件",
  ].filter((term) => text.includes(term)).length;

  let score = 0;
  if (!hasProjects) score += 2.5;
  if (avgTools <= 0.35) score += 2;
  if (commandRatio <= 0.08) score += 1.2;
  if (!hasAgentComparison) score += 0.5;
  score += reflectiveSignals * 0.5;
  score -= builderSignals * 0.45;
  if (totalToolCalls === 0) score += 1.8;

  return {
    score: Number(score.toFixed(2)),
    reflectiveSignals,
    builderSignals,
    hasProjects,
    avgTools: Number(avgTools.toFixed(2)),
    commandRatio: Number(commandRatio.toFixed(2)),
  };
}

async function listConversationCandidates() {
  const rows = await sql`
    SELECT
      u.username,
      u.display_name AS "displayName",
      p.is_public AS "isPublic",
      p.status,
      p.style_theme AS "styleTheme",
      p.sessions_analyzed AS "sessionsAnalyzed",
      p.total_tokens AS "totalTokens",
      p.builder_bio_data AS "builderBioData"
    FROM profiles p
    INNER JOIN users u ON u.id = p.user_id
    WHERE p.builder_bio_data IS NOT NULL
      AND p.sessions_analyzed > 0
    ORDER BY p.updated_at DESC
    LIMIT 1000
  `;

  const candidates = rows
    .map((row) => {
      const bio = row.builderBioData ?? null;
      const D = bio && typeof bio === "object" ? bio.D ?? null : null;
      const E = bio && typeof bio === "object" ? bio.E ?? null : null;
      const profile = D && typeof D === "object" ? D.profile ?? null : null;
      const likelihood = inferConversationLikelihood(profile, D, E);

      return {
        username: row.username,
        displayName: row.displayName,
        isPublic: row.isPublic,
        status: row.status,
        sessionsAnalyzed: row.sessionsAnalyzed,
        totalTokens: row.totalTokens,
        projectCount: Array.isArray(D?.projects) ? D.projects.length : 0,
        topProject:
          Array.isArray(D?.projects) && D.projects[0]?.name
            ? D.projects[0].name
            : null,
        currentMode:
          profile?.chosen_interaction_mode ??
          profile?.interaction_mode ??
          null,
        currentTheme:
          profile?.chosen_style_theme ?? profile?.style_theme ?? row.styleTheme,
        summary: profile?.summary ?? null,
        likelihood,
      };
    })
    .filter((row) => {
      const display = (row.displayName || "").toLowerCase();
      const username = (row.username || "").toLowerCase();
      const summary = (row.summary || "").toLowerCase();
      const looksLikeTest =
        display.includes("test") ||
        username.includes("test") ||
        summary.includes("test project");
      return row.likelihood.score >= 2.5 && !looksLikeTest;
    })
    .sort((a, b) => b.likelihood.score - a.likelihood.score)
    .slice(0, 20);

  console.log(JSON.stringify(candidates, null, 2));
}

async function searchProfiles(term) {
  const like = `%${term}%`;
  const rows = await sql`
    SELECT
      u.username,
      u.display_name AS "displayName",
      p.is_public AS "isPublic",
      p.status,
      p.sessions_analyzed AS "sessionsAnalyzed",
      p.total_tokens AS "totalTokens",
      p.summary,
      p.builder_bio_data AS "builderBioData"
    FROM profiles p
    INNER JOIN users u ON u.id = p.user_id
    WHERE p.builder_bio_data IS NOT NULL
      AND (
        p.summary ILIKE ${like}
        OR CAST(p.builder_bio_data AS text) ILIKE ${like}
      )
    ORDER BY p.updated_at DESC
    LIMIT 30
  `;

  console.log(
    JSON.stringify(
      rows.map((row) => {
        const bio = row.builderBioData ?? null;
        const D = bio && typeof bio === "object" ? bio.D ?? null : null;
        const profile = D && typeof D === "object" ? D.profile ?? null : null;
        return {
          username: row.username,
          displayName: row.displayName,
          isPublic: row.isPublic,
          status: row.status,
          sessionsAnalyzed: row.sessionsAnalyzed,
          totalTokens: row.totalTokens,
          summary: row.summary ?? profile?.summary ?? null,
        };
      }),
      null,
      2
    )
  );
}

async function listQuietConversationCandidates() {
  const rows = await sql`
    SELECT
      u.username,
      u.display_name AS "displayName",
      p.is_public AS "isPublic",
      p.status,
      p.sessions_analyzed AS "sessionsAnalyzed",
      p.total_tokens AS "totalTokens",
      p.builder_bio_data AS "builderBioData"
    FROM profiles p
    INNER JOIN users u ON u.id = p.user_id
    WHERE p.builder_bio_data IS NOT NULL
      AND p.sessions_analyzed >= 10
    ORDER BY p.updated_at DESC
    LIMIT 1500
  `;

  const candidates = rows
    .map((row) => {
      const bio = row.builderBioData ?? null;
      const D = bio && typeof bio === "object" ? bio.D ?? null : null;
      const E = bio && typeof bio === "object" ? bio.E ?? null : null;
      const profile = D && typeof D === "object" ? D.profile ?? null : null;
      const summary = profile?.summary ?? null;
      const likelihood = inferConversationLikelihood(profile, D, E);
      return {
        username: row.username,
        displayName: row.displayName,
        isPublic: row.isPublic,
        status: row.status,
        sessionsAnalyzed: row.sessionsAnalyzed,
        totalTokens: row.totalTokens,
        projectCount: Array.isArray(D?.projects) ? D.projects.length : 0,
        summary,
        likelihood,
      };
    })
    .filter((row) => {
      const display = (row.displayName || "").toLowerCase();
      const username = (row.username || "").toLowerCase();
      const looksLikeTest =
        display.includes("test") ||
        username.includes("test") ||
        username === "admin";
      return !looksLikeTest && row.projectCount === 0;
    })
    .sort((a, b) => b.likelihood.score - a.likelihood.score)
    .slice(0, 20);

  console.log(JSON.stringify(candidates, null, 2));
}

const target = process.argv[2]?.trim();
if (!target) {
  console.error(
    "Usage: node scripts/inspect-profile.mjs <username> | --conversation-candidates"
  );
  process.exit(1);
}

if (target === "--conversation-candidates") {
  await listConversationCandidates();
  process.exit(0);
}

if (target === "--search") {
  const term = process.argv.slice(3).join(" ").trim();
  if (!term) {
    console.error("Usage: node scripts/inspect-profile.mjs --search <term>");
    process.exit(1);
  }
  await searchProfiles(term);
  process.exit(0);
}

if (target === "--quiet-conversation-candidates") {
  await listQuietConversationCandidates();
  process.exit(0);
}

const username = target;

const rows = await sql`
  SELECT
    u.username,
    u.display_name AS "displayName",
    p.is_public AS "isPublic",
    p.status,
    p.style_theme AS "styleTheme",
    p.sessions_analyzed AS "sessionsAnalyzed",
    p.total_tokens AS "totalTokens",
    p.builder_bio_data AS "builderBioData",
    p.builder_bio_data IS NOT NULL AS "hasBuilderBio",
    jsonb_typeof(p.builder_bio_data) AS "builderBioType",
    CASE
      WHEN p.builder_bio_data IS NULL THEN false
      ELSE p.builder_bio_data ? 'D'
    END AS "hasD",
    CASE
      WHEN p.builder_bio_data IS NULL THEN false
      ELSE p.builder_bio_data ? 'E'
    END AS "hasE"
  FROM profiles p
  INNER JOIN users u ON u.id = p.user_id
  WHERE u.username = ${username}
  LIMIT 1
`;

if (!rows[0]) {
  console.error(`Profile "${username}" not found.`);
  process.exit(1);
}

const row = rows[0];
const bio = row.builderBioData ?? null;
const D = bio && typeof bio === "object" ? bio.D ?? null : null;
const E = bio && typeof bio === "object" ? bio.E ?? null : null;
const profile = D && typeof D === "object" ? D.profile ?? null : null;
const projects =
  D && typeof D === "object" && Array.isArray(D.projects) ? D.projects : [];

const presentation = {
  inferredMode: profile?.inferred_interaction_mode ?? null,
  chosenMode:
    profile?.chosen_interaction_mode ?? profile?.interaction_mode ?? null,
  modeReason: profile?.interaction_mode_reason ?? null,
  inferredTheme: profile?.inferred_style_theme ?? null,
  chosenTheme: profile?.chosen_style_theme ?? profile?.style_theme ?? null,
  themeReason: profile?.style_theme_reason ?? null,
  themeCandidates: Array.isArray(profile?.theme_candidates)
    ? profile.theme_candidates
    : [],
};

const summary = {
  totalSessions: profile?.total_sessions ?? null,
  totalTurns: profile?.total_turns ?? null,
  totalToolCalls: profile?.total_tool_calls ?? null,
  activeDays: profile?.active_days ?? null,
  totalTokens: profile?.total_tokens ?? row.totalTokens ?? null,
  projectCount: projects.length,
  topProject: projects[0]?.name ?? null,
  agentLabels:
    Array.isArray(profile?.agents_used) && profile.agents_used.length > 0
      ? profile.agents_used
      : E && typeof E === "object" && E.comparison && typeof E.comparison === "object"
        ? Object.keys(E.comparison)
        : [],
};

console.log(
  JSON.stringify(
    {
      username: row.username,
      displayName: row.displayName,
      isPublic: row.isPublic,
      status: row.status,
      styleTheme: row.styleTheme,
      sessionsAnalyzed: row.sessionsAnalyzed,
      totalTokens: row.totalTokens,
      hasBuilderBio: row.hasBuilderBio,
      builderBioType: row.builderBioType,
      hasD: row.hasD,
      hasE: row.hasE,
      presentation,
      summary,
    },
    null,
    2
  )
);
