---
name: builderbio
description: |
  This skill should be used when the user wants to generate a shareable "BuilderBio" — a single HTML page showcasing everything they built with AI coding agents (Claude Code, Codex, Cursor, etc.) over a time period. It scans all local agent sessions, aggregates stats, clusters projects, and produces a personal portfolio covering: what was built, building style, tech stack, activity heatmap, agent usage, and highlight moments. This skill should be used when the user mentions "BuilderBio", "builder bio", "builder profile", "share my builds", "coding history", "AI portfolio", "showcase", "分享", "画像", "展示", "导出", or "profile".
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - AskUserQuestion
---

# BuilderBio

Generate a shareable **BuilderBio** — a single HTML page that shows everything a person built with AI coding agents over a time period.

This is not a single-session report. It aggregates ALL sessions into a personal BuilderBio that answers: "What has this person been building with AI, and how?"

## Quick Start

1. Scan all local agent sessions within the user's chosen time range
2. Parse each session into lightweight summary data
3. Aggregate into a BuilderBio data model
4. Ask user about privacy preferences
5. Generate a self-contained HTML page
6. Open for review

## Supported Agents & Log Locations

| Agent | Log Location | Format |
|-------|-------------|--------|
| Claude Code | `~/.claude/projects/<project>/<session>.jsonl` | JSONL |
| Claude Code history | `~/.claude/history.jsonl` | JSONL (summaries) |
| Codex (OpenAI) | `~/.codex/sessions/YYYY/MM/DD/rollout-*.jsonl` | JSONL |

For parsing details, see [references/claude-code-format.md](references/claude-code-format.md) and [references/codex-format.md](references/codex-format.md).

## Workflow

### Phase 1: Discover & Scope

Determine scope from user input or infer from context:
- **Time range**: Last 7 days? 30 days? All time? Default to 30 days.
- **Which agents**: All available, or specific ones?
- **Display name**: Run `whoami` to get the system username as default. Prompt user: "BuilderBio 上显示什么名字？" The page title becomes `{name}'s BuilderBio`.
- **Tagline** (optional): A short subtitle like "@handle" or "AI-Native Builder".
- **Avatar** (optional): A profile image URL or local file path. If a URL is provided, use it directly as `<img src>`. If a local file, convert to base64 data URI for self-contained HTML.
- **Social media links**: Prompt for any social profiles to display (LinkedIn, X/Twitter, GitHub, etc.). Each link needs a platform name and URL. Display as icon buttons in the hero section.
- **Language**: Detect the user's primary language from their Coding Agent session history. Scan the `display` text of all sessions — compute the ratio of Chinese characters (`[\u4e00-\u9fff]`) to total characters. If the ratio exceeds 0.3, set `lang` to `"zh"`; otherwise set to `"en"`. **Important**: All UI chrome (section headers, stat labels, status badges, tooltips, CTA, footer) is always rendered in English regardless of `lang`. The `lang` setting only affects user-generated content — summaries, framework sentences, evolution insights, comparison insights, style descriptions, and time-of-day peak text should be written in the detected language.

Scan for sessions:

```bash
# Claude Code — list all session files, sorted by date
ls -lt ~/.claude/projects/*/*.jsonl | head -50

# Codex — list all session files
ls -lt ~/.codex/sessions/*/*/*/*.jsonl | head -50
```

Read `~/.claude/history.jsonl` to get human-readable display text per session.

### Phase 2: Parse All Sessions

Run the parser on all session files to extract **session summaries** (not full turns — keep it lightweight):

```bash
python <skill-path>/scripts/parse_sessions.py \
  --claude-dir ~/.claude \
  --codex-dir ~/.codex \
  --days 30 \
  --output /tmp/builder_profile_data.json
```

If the script fails, fall back to manual parsing: read each JSONL file and extract the fields documented in the format references. The goal is to produce a **session summary** per session, not full turn-by-turn data.

### Phase 3: Analyze & Build Profile

This is the core intellectual work. Read the parsed data and produce the BuilderBio analysis. Refer to [references/profile-dimensions.md](references/profile-dimensions.md) for the full rubric. The eleven sections:

#### 1. Builder Identity (hero stats)
- Total sessions, active days, total turns, total tool calls, tokens
- Agent badges showing which tools the person uses
- Social media icon row (LinkedIn, X, GitHub, etc.) — each icon links to user's profile URL
- Date range covered

#### 2. What I Built (project gallery)
- Cluster sessions into **projects** by cwd, keyword overlap, temporal proximity
- Each project card: name, one-line description, tech stack tags, session count, total turns, status
- This is the most important section — it answers "what did you ship?"

#### 3. Tech Stack Fingerprint
- Infer technologies from tool calls (file types) and prompt keywords
- Horizontal bar chart, 0-100 scale, top 10 tech areas

#### 4. How I Build (working style)
- **Prompt style**: Architect / Conversationalist / Delegator / Explorer
- **Session rhythm**: Sprinter / Marathoner / Balanced
- **Tool preference**: Explorer / Builder / Commander / Balanced
- **Agent loyalty**: Monogamous / Polygamous / Experimenter
- Tool distribution bar with legend

#### 5. Collaboration Evolution Curve
- Weekly bar chart showing turns volume over time
- Trend insight text describing the pattern (exploration → deep building)

#### 6. Time-of-Day Distribution ("几点钟的 Builder")
- 24-column bar chart, colored by time period
- Period summary cards (deep night / morning / afternoon / evening)
- Builder type label (e.g., "上午型 Builder")

#### 7. Prompt Keywords
- Word cloud extracted from all session first messages
- Font size proportional to frequency, top 20-30 keywords

#### 8. Agent Comparison Panel
- Side-by-side cards for each agent used
- Stats: sessions, turns, avg turns, tool calls, top tools, session length distribution
- Usage insight text summarizing differences

#### 9. Activity Heatmap
- GitHub-style contribution grid
- Streak data: longest streak, current streak, active days ratio

#### 10. Highlight Moments
- Biggest session, busiest day, longest streak, fun fact comparison
- Featured prompt in a styled quote block

#### 11. CTA (Call-to-Action)
- "Show the world my taste" with install command
- "Send this to my coding agent - get my bio link"
- Enables viral sharing — viewers can generate their own BuilderBio

### Phase 4: Privacy Review

Before generating the page, flag sensitive content:
- File paths with usernames, project names, company names
- API keys or credentials in session content
- Repository URLs

Default: redact all file paths to generic placeholders, strip credentials. Prompt user to confirm redaction level.

### Phase 5: Generate HTML

Construct a single self-contained `.html` file. Start from the template at [assets/template.html](assets/template.html), adapting and enhancing as needed for the specific user's data.

The page must:
- Be a single file, no external dependencies (all CSS/JS inlined)
- Look good on desktop and mobile
- Use dark theme by default
- Render all UI strings in the detected language (`D.profile.lang`). The template has a built-in i18n dictionary (zh/en) — set `lang` in the profile data to control it. CTA section is always in English.

Save to user's Desktop or a location they specify, then `open` it.

### Phase 6: Publish to builderbio.dev

After generating the local HTML, ask the user if they want to publish their BuilderBio to `username.builderbio.dev`. If yes:

1. **Choose username**: Ask the user for a username (3-30 chars, lowercase alphanumeric + hyphens, starts with a letter).

2. **Publish via API**: Send the full D and E data to the publish endpoint:

```bash
curl -X POST https://builderbio.dev/api/profile/publish \
  -H "Content-Type: application/json" \
  -d '{
    "username": "chosen-username",
    "publish_token": "...",
    "profile": {
      "summary": "One-line summary",
      "sessions_analyzed": 25,
      "total_tokens": 850000
    },
    "builderbio": {
      "D": { ... full D data object ... },
      "E": { ... full E data object ... }
    }
  }'
```

3. **Handle response**:
   - **Success (new user)**: Response includes `publish_token`. Save it to `~/.builderbio/config.json` for future updates:
     ```json
     { "username": "chosen-username", "publish_token": "..." }
     ```
   - **Success (update)**: Read `publish_token` from `~/.builderbio/config.json` and include it in the request.
   - **409 (username taken)**: Suggest alternative usernames or ask the user to choose another.

4. **Confirm**: Print the published URL: `https://username.builderbio.dev`

### Phase 7: Review & Iterate

Prompt the user for feedback:
- Does the profile feel accurate?
- Any projects mislabeled or missing?
- Any content to redact?
- Any section to emphasize or de-emphasize?

## BuilderBio Data Model

The parser script produces two data objects for the template:

**D (primary data)** — injected as `__PROFILE_DATA_PLACEHOLDER__`:
```json
{
  "profile": { "display_name": "Gavin", "tagline": "@gavin0922", "avatar_url": "https://...", "lang": "zh", "date_range": {...}, "active_days": 18, "total_sessions": 25, "total_turns": 4200, "total_tool_calls": 2100, "total_tokens": 850000, "agents_used": {...}, "social_links": [{"platform": "linkedin", "url": "..."}, {"platform": "x", "url": "..."}] },
  "projects": [ { "name": "...", "description": "...", "sessions": [...], "tags": [...], "total_turns": 1300, "total_tool_calls": 620, "date_range": {...}, "status": "shipped" } ],
  "sessions": [ { "id": "...", "agent": "claude-code", "date": "2026-03-10", "display": "...", "turns": 719, "user_turns": 64, "tool_calls": 424, "tools": {...} } ],
  "heatmap": { "2026-03-01": 0, "2026-03-02": 45 },
  "style": { "avg_session_turns": 55, "session_length_distribution": {...}, "exploration_ratio": 0.07, "build_ratio": 0.07, "command_ratio": 0.31, "tool_totals": {...} },
  "highlights": { "biggest_session": {...}, "busiest_day": {...}, "longest_streak": 7, "current_streak": 2, "favorite_prompt": "..." }
}
```

**E (extra data)** — injected as `__EXTRA_DATA_PLACEHOLDER__`:
```json
{
  "time": { "hour_distribution": {"0":10,...,"23":14}, "period_data": {...}, "builder_type": "上午型 Builder", "peak_hour": 10, "peak_text": "10 AM is my peak hour", "peak_detail": "Most active: 9-11 AM, 69 sessions" },
  "tech": { "Shell / CLI": 100, "HTML / CSS": 31, ... },
  "keywords": [ ["Agent", 30], ["Claude Code", 19], ... ],
  "evolution": [ { "week": "2026-01-19", "sessions": 50, "turns": 1584, "avg_turns": 32 }, ... ],
  "evolution_insight": "Started with frequent short sessions (avg 29 turns), shifted to deep building sessions (avg 150 turns) by week 5.",
  "comparison": { "claude-code": { "sessions": 51, "total_turns": 6413, "avg_turns": 126, "top_tools": [...], "distribution": {...} }, "codex": {...} },
  "comparison_insight": "Claude Code for deep building (avg 126 turns), Codex for quick queries (avg 35 turns)."
}
```

Build both data objects and inject into the template. The parser auto-generates all fields except `projects` (requires judgment for clustering) and the style labels (Delegator/Sprinter/etc, computed from raw ratios).

## Page Structure

| # | Section | Content | Key Visual |
|---|---------|---------|-----------|
| 1 | Hero | Builder Identity — total stats, agents, date range | Big numbers + agent badges |
| 2 | Projects | What I Built — project gallery | Cards with tags and stats |
| 3 | Tech Stack | Tech Stack Fingerprint | Horizontal bar chart |
| 4 | Style | How I Build — working style | Style label + trait cards + tool bar |
| 5 | Evolution | Collaboration Evolution Curve | Weekly bar chart + trend insight |
| 6 | Time | Time-of-Day Distribution | 24h bar chart + period cards |
| 7 | Keywords | Prompt Keywords | Word cloud / tag cloud |
| 8 | Agent Cmp | Agent Comparison Panel | Side-by-side stat cards |
| 9 | Heatmap | Activity Heatmap | GitHub-style green grid |
| 10 | Highlights | Highlight Moments | Superlative cards + quote |
| 11 | CTA | Call-to-Action | Install command + invitation |

## Important Notes

- The profile page is about the PERSON, not individual sessions
- Project clustering requires judgment — sessions about the same topic should be grouped
- The "How I Build" section should feel like a personality assessment, not a dry report
- Highlight moments should be written in a way that's fun to share ("You talked to AI more than most people talk to their coworkers")
- Keep the page under 200KB for easy sharing
- The tone should be celebratory — this is something people share on social media
