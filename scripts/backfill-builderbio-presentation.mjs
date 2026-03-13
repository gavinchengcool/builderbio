#!/usr/bin/env node

import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { spawnSync } from "child_process";
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

function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function asString(value, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

const VALID_THEMES = [
  "product-operator",
  "terminal-native",
  "editorial-maker",
  "night-shift",
  "research-forge",
  "calm-craft",
  "companion-journal",
  "idea-salon",
  "yc-orange",
  "terminal-green",
  "minimal-light",
  "cyberpunk",
  "default",
];

function parseModeFromTitle(html) {
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  const title = titleMatch?.[1] ?? "";
  if (title.includes("How They Think With AI")) return "conversation-first";
  if (title.includes("Build and Think With AI")) return "hybrid";
  return "builder";
}

function parseThemeFromHtml(html, storedTheme) {
  const explicit = html.match(/theme · ([a-z-]+)/i)?.[1];
  if (explicit && VALID_THEMES.includes(explicit)) return explicit;

  for (const theme of VALID_THEMES) {
    if (theme === "default") continue;
    if (html.includes(theme)) return theme;
  }

  return storedTheme && storedTheme !== "default" ? storedTheme : "product-operator";
}

function fetchLivePresentation(username, storedTheme) {
  const url = `https://${username}.builderbio.dev/`;
  const result = spawnSync("curl", ["-s", url], {
    encoding: "utf8",
    maxBuffer: 8 * 1024 * 1024,
  });

  if (result.status !== 0 || !result.stdout) {
    throw new Error(`Failed to fetch ${url}: ${result.stderr || `exit ${result.status}`}`);
  }

  const html = result.stdout;
  return {
    mode: parseModeFromTitle(html),
    theme: parseThemeFromHtml(html, storedTheme),
    title: html.match(/<title>([^<]+)<\/title>/i)?.[1] ?? "",
  };
}

function backfillProfile(builderBioData, presentation) {
  const bio = structuredClone(builderBioData);
  const D = asObject(bio.D);
  const profile = asObject(D.profile);
  D.profile = profile;
  bio.D = D;

  if (!asString(profile.inferred_interaction_mode)) {
    profile.inferred_interaction_mode = presentation.mode;
  }
  if (!asString(profile.chosen_interaction_mode)) {
    profile.chosen_interaction_mode = presentation.mode;
  }
  profile.interaction_mode = asString(profile.chosen_interaction_mode, presentation.mode);

  if (!asString(profile.inferred_style_theme)) {
    profile.inferred_style_theme = presentation.theme;
  }
  if (!asString(profile.chosen_style_theme)) {
    profile.chosen_style_theme = presentation.theme;
  }
  profile.style_theme = asString(profile.chosen_style_theme, presentation.theme);

  if (!Array.isArray(profile.theme_candidates) || profile.theme_candidates.length === 0) {
    profile.theme_candidates = [
      {
        theme: presentation.theme,
        score: 1,
        reason: "Backfilled from the live BuilderBio recap rendering output.",
      },
    ];
  }

  return bio;
}

loadEnvFromFile(resolve(process.cwd(), ".env.local"));

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const args = process.argv.slice(2);
const apply = args.includes("--apply");
const targetPublic = args.includes("--public");
const usernames = args
  .filter((arg) => arg !== "--apply" && arg !== "--public")
  .map((arg) => arg.trim())
  .filter(Boolean);

if (!targetPublic && usernames.length === 0) {
  console.error(
    "Usage: node scripts/backfill-builderbio-presentation.mjs [--apply] --public | <username>..."
  );
  process.exit(1);
}

const sql = neon(databaseUrl);
const rows = targetPublic
  ? await sql`
      SELECT
        p.id,
        u.username,
        p.style_theme AS "styleTheme",
        p.builder_bio_data AS "builderBioData"
      FROM profiles p
      INNER JOIN users u ON u.id = p.user_id
      WHERE p.builder_bio_data IS NOT NULL
        AND p.is_public = 1
      ORDER BY u.username ASC
    `
  : await sql`
      SELECT
        p.id,
        u.username,
        p.style_theme AS "styleTheme",
        p.builder_bio_data AS "builderBioData"
      FROM profiles p
      INNER JOIN users u ON u.id = p.user_id
      WHERE p.builder_bio_data IS NOT NULL
        AND u.username = ANY(${usernames})
      ORDER BY u.username ASC
    `;

const planned = [];

for (const row of rows) {
  const bio = row.builderBioData ?? null;
  if (!bio?.D || !bio?.E) continue;

  const live = fetchLivePresentation(row.username, row.styleTheme);
  planned.push({
    id: row.id,
    username: row.username,
    currentStyleTheme: row.styleTheme,
    nextStyleTheme:
      row.styleTheme && row.styleTheme !== "default" ? row.styleTheme : live.theme,
    mode: live.mode,
    theme: live.theme,
    title: live.title,
    builderBioData: backfillProfile(bio, live),
  });
}

if (!apply) {
  console.log(
    JSON.stringify(
      {
        mode: "dry-run",
        count: planned.length,
        results: planned.map((row) => ({
          username: row.username,
          mode: row.mode,
          theme: row.theme,
          currentStyleTheme: row.currentStyleTheme,
          nextStyleTheme: row.nextStyleTheme,
          title: row.title,
        })),
      },
      null,
      2
    )
  );
  process.exit(0);
}

for (const row of planned) {
  await sql`
    UPDATE profiles
    SET
      builder_bio_data = ${row.builderBioData},
      style_theme = ${row.nextStyleTheme},
      updated_at = NOW()
    WHERE id = ${row.id}
  `;
}

console.log(
  JSON.stringify(
    {
      mode: "apply",
      count: planned.length,
      updated: planned.map((row) => ({
        username: row.username,
        mode: row.mode,
        theme: row.theme,
        styleTheme: row.nextStyleTheme,
      })),
    },
    null,
    2
  )
);
