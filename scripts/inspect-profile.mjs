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

const username = process.argv[2]?.trim();
if (!username) {
  console.error("Usage: node scripts/inspect-profile.mjs <username>");
  process.exit(1);
}

const sql = neon(databaseUrl);
const rows = await sql`
  SELECT
    u.username,
    u.display_name AS "displayName",
    p.is_public AS "isPublic",
    p.status,
    p.sessions_analyzed AS "sessionsAnalyzed",
    p.total_tokens AS "totalTokens",
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

console.log(JSON.stringify(rows[0], null, 2));
