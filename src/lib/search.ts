import { db } from "./db";
import { profiles, users } from "./db/schema";
import {
  extractBuilderBioAgentLabels,
  extractBuilderBioAvatarUrl,
  extractBuilderBioScanInfo,
  extractBuilderBioTags,
  extractPortraitAvatarUrl,
} from "./builderbio";
import { eq, and, sql, ilike, or, isNotNull, gt } from "drizzle-orm";

export interface SearchResult {
  username: string;
  displayName: string | null;
  avatarColor: string | null;
  avatarUrl: string | null;
  summary: string | null;
  portrait: unknown;
  frameworkSentences: unknown;
  searchProfile: unknown;
  sessionsAnalyzed: number | null;
  totalTokens: number | null;
  tags: string[];
  subtitle: string | null;
  scanStatus: string | null;
  scannerVersion: string | null;
  scanNeedsRescan: boolean;
  rank?: number;
}

type SearchRow = Omit<
  SearchResult,
  | "avatarUrl"
  | "tags"
  | "subtitle"
  | "scanStatus"
  | "scannerVersion"
  | "scanNeedsRescan"
> & {
  builderBioData: unknown;
};

function asObject(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value
        .map((item) => (typeof item === "string" ? item.trim() : ""))
        .filter((item) => item.length > 0)
    : [];
}

function humanizeSearchTag(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/[A-Z]/.test(trimmed) || trimmed.includes(" ")) return trimmed;

  const specialTokens: Record<string, string> = {
    ai: "AI",
    api: "API",
    cli: "CLI",
    ui: "UI",
    ux: "UX",
    saas: "SaaS",
    devops: "DevOps",
    rbac: "RBAC",
    sql: "SQL",
    css: "CSS",
    html: "HTML",
    nodejs: "Node.js",
    postgresql: "PostgreSQL",
    nextjs: "Next.js",
    tailwindcss: "Tailwind CSS",
    typescript: "TypeScript",
    javascript: "JavaScript",
    openclaw: "OpenClaw",
  };

  return trimmed
    .split(/[-_/]+/)
    .map((token) => {
      const normalized = token.toLowerCase();
      if (specialTokens[normalized]) return specialTokens[normalized];
      return normalized.charAt(0).toUpperCase() + normalized.slice(1);
    })
    .join(" ");
}

function dedupeTags(values: string[]): string[] {
  const seen = new Set<string>();
  const tags: string[] = [];

  for (const value of values) {
    const clean = humanizeSearchTag(value);
    if (!clean) continue;
    const key = clean.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    tags.push(clean);
  }

  return tags;
}

function extractSearchProfileTags(searchProfile: unknown): string[] {
  const profile = asObject(searchProfile);
  if (!profile) return [];

  return dedupeTags([
    ...asStringArray(profile.skills),
    ...asStringArray(profile.frameworks),
    ...asStringArray(profile.languages),
    ...asStringArray(profile.domains),
  ]);
}

function extractSummaryTags(
  summary: string | null,
  frameworkSentences: unknown
): string[] {
  const sentences = asStringArray(frameworkSentences);
  const source = [summary ?? "", sentences[0] ?? ""].join(" ").toLowerCase();
  if (!source.trim()) return [];

  const tagMatchers: Array<[RegExp, string]> = [
    [/\bai\b|人工智能|智能体|agent/i, "AI"],
    [/\bfull[- ]stack\b|全栈/i, "Full Stack"],
    [/\bautomation\b|自动化/i, "Automation"],
    [/\bdeveloper tools?\b|开发者工具/i, "Developer Tools"],
    [/\be-?commerce\b|commerce|电商/i, "E-commerce"],
    [/\binfrastructure\b|基础设施/i, "Infrastructure"],
    [/\bsaas\b/i, "SaaS"],
    [/\brbac\b/i, "RBAC"],
    [/\bmicroservices?\b|微服务/i, "Microservices"],
    [/\bedtech\b/i, "EdTech"],
    [/\bhardware\b|硬件/i, "Hardware"],
    [/\bgame|gaming\b|游戏/i, "Gaming"],
    [/\bproduct strategy\b|产品策略/i, "Product Strategy"],
  ];

  return tagMatchers
    .filter(([pattern]) => pattern.test(source))
    .map(([, label]) => label)
    .slice(0, 4);
}

function buildSubtitle(agentLabels: string[], tags: string[]): string | null {
  if (agentLabels.length > 0) {
    return agentLabels.slice(0, 3).join(" · ");
  }

  if (tags.length > 0) {
    return tags.slice(0, 2).join(" · ");
  }

  return null;
}

function mapSearchResult(row: SearchRow): SearchResult {
  const scanInfo = extractBuilderBioScanInfo(row.builderBioData);
  const agentLabels = extractBuilderBioAgentLabels(row.builderBioData);
  const mergedTags = dedupeTags([
    ...extractSearchProfileTags(row.searchProfile),
    ...extractBuilderBioTags(row.builderBioData),
    ...extractSummaryTags(
      typeof row.summary === "string" ? row.summary : null,
      row.frameworkSentences
    ),
  ]);
  const agentLabelSet = new Set(agentLabels.map((label) => label.toLowerCase()));
  const descriptiveTags = mergedTags.filter(
    (tag) => !agentLabelSet.has(tag.toLowerCase())
  );
  const tags = (descriptiveTags.length > 0 ? descriptiveTags : mergedTags).slice(0, 5);

  return {
    username: row.username,
    displayName: row.displayName,
    avatarColor: row.avatarColor,
    avatarUrl:
      extractBuilderBioAvatarUrl(row.builderBioData) ??
      extractPortraitAvatarUrl(row.portrait),
    summary: row.summary,
    portrait: row.portrait,
    frameworkSentences: row.frameworkSentences,
    searchProfile: row.searchProfile,
    sessionsAnalyzed: row.sessionsAnalyzed,
    totalTokens: row.totalTokens,
    tags,
    subtitle: buildSubtitle(agentLabels, tags),
    scanStatus: scanInfo?.status ?? null,
    scannerVersion: scanInfo?.scannerVersion ?? null,
    scanNeedsRescan: scanInfo?.needsRescan ?? false,
  };
}

export async function searchPeople(query: string): Promise<SearchResult[]> {
  if (!query.trim()) {
    // Return all public profiles when no query
    const results = await db
      .select({
        username: users.username,
        displayName: users.displayName,
        avatarColor: users.avatarColor,
        summary: profiles.summary,
        portrait: profiles.portrait,
        frameworkSentences: profiles.frameworkSentences,
        searchProfile: profiles.searchProfile,
        builderBioData: profiles.builderBioData,
        sessionsAnalyzed: profiles.sessionsAnalyzed,
        totalTokens: profiles.totalTokens,
      })
      .from(profiles)
      .innerJoin(users, eq(profiles.userId, users.id))
      .where(
        and(
          eq(profiles.isPublic, 1),
          isNotNull(profiles.builderBioData),
          gt(profiles.sessionsAnalyzed, 0)
        )
      )
      .limit(50);

    return results.map(mapSearchResult);
  }

  const searchTerm = `%${query}%`;

  const results = await db
    .select({
      username: users.username,
      displayName: users.displayName,
      avatarColor: users.avatarColor,
      summary: profiles.summary,
      portrait: profiles.portrait,
      frameworkSentences: profiles.frameworkSentences,
      searchProfile: profiles.searchProfile,
      builderBioData: profiles.builderBioData,
      sessionsAnalyzed: profiles.sessionsAnalyzed,
      totalTokens: profiles.totalTokens,
    })
    .from(profiles)
    .innerJoin(users, eq(profiles.userId, users.id))
    .where(
      and(
        eq(profiles.isPublic, 1),
        isNotNull(profiles.builderBioData),
        gt(profiles.sessionsAnalyzed, 0),
        or(
          ilike(users.username, searchTerm),
          ilike(users.displayName, searchTerm),
          ilike(profiles.summary, searchTerm),
          sql`${profiles.searchVector}::tsvector @@ plainto_tsquery('english', ${query})`
        )
      )
    )
    .limit(50);

  return results.map(mapSearchResult);
}

export async function searchSkills(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  const searchTerm = `%${query}%`;

  const results = await db
    .select({
      username: users.username,
      displayName: users.displayName,
      avatarColor: users.avatarColor,
      summary: profiles.summary,
      portrait: profiles.portrait,
      frameworkSentences: profiles.frameworkSentences,
      searchProfile: profiles.searchProfile,
      builderBioData: profiles.builderBioData,
      sessionsAnalyzed: profiles.sessionsAnalyzed,
      totalTokens: profiles.totalTokens,
    })
    .from(profiles)
    .innerJoin(users, eq(profiles.userId, users.id))
    .where(
      and(
        eq(profiles.isPublic, 1),
        isNotNull(profiles.builderBioData),
        gt(profiles.sessionsAnalyzed, 0),
        or(
          sql`${profiles.searchVector}::tsvector @@ plainto_tsquery('english', ${query})`,
          sql`${profiles.frameworkSentences}::text ILIKE ${searchTerm}`,
          sql`${profiles.portrait}::text ILIKE ${searchTerm}`
        )
      )
    )
    .limit(50);

  return results.map(mapSearchResult);
}
