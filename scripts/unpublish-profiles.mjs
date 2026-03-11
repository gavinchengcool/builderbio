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

const args = process.argv.slice(2);
const apply = args.includes("--apply");
const usernames = args
  .filter((arg) => arg !== "--apply")
  .map((arg) => arg.trim())
  .filter(Boolean);

if (usernames.length === 0) {
  console.error("Usage: node scripts/unpublish-profiles.mjs [--apply] <username>...");
  process.exit(1);
}

const uniqueUsernames = [...new Set(usernames)];
const sql = neon(databaseUrl);
const profiles = [];

for (const username of uniqueUsernames) {
  const rows = await sql`
    SELECT
      p.id,
      u.username,
      u.display_name AS "displayName",
      p.is_public AS "isPublic",
      p.status,
      p.sessions_analyzed AS "sessionsAnalyzed",
      p.total_tokens AS "totalTokens"
    FROM profiles p
    INNER JOIN users u ON u.id = p.user_id
    WHERE u.username = ${username}
    LIMIT 1
  `;

  if (rows[0]) {
    profiles.push(rows[0]);
  }
}

const matchedUsernames = new Set(profiles.map((profile) => profile.username));
const missingUsernames = uniqueUsernames.filter(
  (username) => !matchedUsernames.has(username)
);

if (!apply) {
  console.log(
    JSON.stringify(
      {
        mode: "dry-run",
        requested: uniqueUsernames,
        matched: profiles.map((profile) => ({
          username: profile.username,
          displayName: profile.displayName,
          isPublic: profile.isPublic,
          status: profile.status,
          sessionsAnalyzed: profile.sessionsAnalyzed,
          totalTokens: profile.totalTokens,
        })),
        missing: missingUsernames,
      },
      null,
      2
    )
  );
  process.exit(0);
}

const updated = [];
for (const profile of profiles) {
  await sql`
    UPDATE profiles
    SET
      is_public = 0,
      status = 'draft',
      updated_at = NOW()
    WHERE id = ${profile.id}
  `;
  updated.push(profile.username);
}

console.log(
  JSON.stringify(
    {
      mode: "apply",
      requested: uniqueUsernames,
      updated,
      missing: missingUsernames,
    },
    null,
    2
  )
);
