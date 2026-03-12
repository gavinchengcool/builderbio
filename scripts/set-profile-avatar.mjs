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
const positional = args.filter((arg) => arg !== "--apply");
const [username, avatarUrl] = positional;

if (!username || !avatarUrl) {
  console.error(
    "Usage: node scripts/set-profile-avatar.mjs [--apply] <username> <avatar-url>"
  );
  process.exit(1);
}

const sql = neon(databaseUrl);
const rows = await sql`
  SELECT
    p.id,
    u.username,
    p.portrait,
    p.builder_bio_data AS "builderBioData"
  FROM profiles p
  INNER JOIN users u ON u.id = p.user_id
  WHERE u.username = ${username}
  LIMIT 1
`;

if (!rows[0]) {
  console.error(`Profile "${username}" not found.`);
  process.exit(1);
}

const profile = rows[0];
const nextPortrait =
  profile.portrait && typeof profile.portrait === "object"
    ? { ...profile.portrait }
    : {};
nextPortrait.avatar_url = avatarUrl;
nextPortrait.avatar = avatarUrl;

let nextBuilderBio = profile.builderBioData;
if (
  nextBuilderBio &&
  typeof nextBuilderBio === "object" &&
  nextBuilderBio.D &&
  typeof nextBuilderBio.D === "object"
) {
  const nextProfile =
    nextBuilderBio.D.profile && typeof nextBuilderBio.D.profile === "object"
      ? { ...nextBuilderBio.D.profile }
      : {};
  nextProfile.avatar_url = avatarUrl;
  nextProfile.avatar = avatarUrl;

  nextBuilderBio = {
    ...nextBuilderBio,
    D: {
      ...nextBuilderBio.D,
      profile: nextProfile,
    },
  };
}

if (!apply) {
  console.log(
    JSON.stringify(
      {
        mode: "dry-run",
        username: profile.username,
        portrait: nextPortrait,
        hasBuilderBio: Boolean(nextBuilderBio),
      },
      null,
      2
    )
  );
  process.exit(0);
}

await sql`
  UPDATE profiles
  SET
    portrait = ${nextPortrait},
    builder_bio_data = ${nextBuilderBio},
    updated_at = NOW()
  WHERE id = ${profile.id}
`;

console.log(
  JSON.stringify(
    {
      mode: "apply",
      username: profile.username,
      avatarUrl,
    },
    null,
    2
  )
);
