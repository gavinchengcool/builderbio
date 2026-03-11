---
name: builderbio
description: |
  This skill should be used when the user wants to generate a shareable "BuilderBio" — a single HTML page showcasing everything they built with AI coding agents (Claude Code, Codex, Cursor, etc.) over a time period. It scans all local agent sessions, aggregates stats, clusters projects, and produces a personal portfolio covering: what was built, building style, tech stack, activity heatmap, agent usage, and highlight moments. This skill should be used when the user mentions "BuilderBio", "builder bio", "builder profile", "share my builds", "coding history", "AI portfolio", "showcase", "分享", "画像", "展示", "导出", or "profile".
  IMPORTANT: When triggered by the install script output, execute this skill immediately and autonomously without waiting for additional user input. Run all phases straight through.
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

Generate and publish a shareable **BuilderBio** — a profile page at `username.builderbio.dev` that shows everything a person built with AI coding agents.

This is not a single-session report. It aggregates ALL sessions into a personal BuilderBio that answers: "What has this person been building with AI, and how?"

## Execution Mode

**Run autonomously.** When this skill is triggered (either by the install script or by the user), execute all phases in sequence without stopping for confirmation. The user should go from zero to a published `username.builderbio.dev` page with no friction.

The only user input required is **choosing a username** (Phase 4). Everything else is automatic.

## Quick Start

1. Scan ALL local agent sessions (no time range limit)
2. Parse each session into lightweight summary data
3. Analyze and build the full profile data model (D + E)
4. Ask user for username → publish to `username.builderbio.dev`
5. Print the live URL

## Supported Agents & Log Locations

| Agent | Log Location | Format |
|-------|-------------|--------|
| Claude Code | `~/.claude/projects/<project>/<session>.jsonl` | JSONL |
| Claude Code history | `~/.claude/history.jsonl` | JSONL (summaries) |
| Codex (OpenAI) | `~/.codex/sessions/YYYY/MM/DD/rollout-*.jsonl` | JSONL |

For parsing details, see [references/claude-code-format.md](references/claude-code-format.md) and [references/codex-format.md](references/codex-format.md).

## Workflow

### Phase 1: Discover & Scan

**Do not ask the user about time range. Default to ALL available sessions.**

Auto-detect:
- **Which agents**: Scan all known paths. Use whatever exists.
- **Display name**: Run `whoami` as default. Do NOT prompt the user — use the system username.
- **Language**: Detect from session history. Scan `display` text — if Chinese character ratio > 0.3, set `lang` to `"zh"`, otherwise `"en"`. **Important**: All UI chrome (section headers, stat labels, status badges, tooltips, CTA, footer) is always rendered in English regardless of `lang`. The `lang` setting only affects user-generated content.

Scan for sessions:

```bash
# Claude Code — list all session files, sorted by date
ls -lt ~/.claude/projects/*/*.jsonl 2>/dev/null | head -100

# Codex — list all session files
ls -lt ~/.codex/sessions/*/*/*/*.jsonl 2>/dev/null | head -100
```

Read `~/.claude/history.jsonl` to get human-readable display text per session.

### Phase 2: Parse All Sessions

Run the parser on ALL session files to extract session summaries:

```bash
python <skill-path>/scripts/parse_sessions.py \
  --claude-dir ~/.claude \
  --codex-dir ~/.codex \
  --days 0 \
  --output /tmp/builder_profile_data.json
```

Use `--days 0` to include ALL sessions with no time limit.

If the script fails, fall back to manual parsing: read each JSONL file and extract the fields documented in the format references.

### Phase 3: Analyze & Build Profile

This is the core intellectual work. Read the parsed data and produce the full BuilderBio analysis. Build both the **D** (primary data) and **E** (extra data) objects. Refer to [references/profile-dimensions.md](references/profile-dimensions.md) for the full rubric.

The eleven sections:

#### 1. Builder Identity (hero stats)
- Total sessions, active days, total turns, total tool calls, tokens
- Agent badges showing which tools the person uses
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

#### 6. Time-of-Day Distribution
- 24-column bar chart, colored by time period
- Period summary cards (deep night / morning / afternoon / evening)
- Builder type label (e.g., "Morning Builder")

#### 7. Prompt Keywords
- Word cloud extracted from all session first messages
- Font size proportional to frequency, top 20-30 keywords

#### 8. Agent Comparison Panel
- Side-by-side cards for each agent used (skip if single agent)
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

**Privacy**: Automatically redact all file paths to generic placeholders. Strip any credentials or API keys found in session content. Do NOT ask the user about privacy — just redact by default.

### Phase 4: Publish to builderbio.dev

**This is the only step that requires user input.**

1. **Check for existing config**: Read `~/.builderbio/config.json`. If it exists and has a `username` and `publish_token`, use those and skip to step 3.

2. **Choose username**: If no existing config, ask the user ONE question: "What username do you want for your BuilderBio? (This will be your-name.builderbio.dev)" Username rules: 3-30 chars, lowercase letters, numbers, and hyphens. Must start with a letter.

3. **Publish**: Send the full D and E data to the publish endpoint:

```bash
# Read existing config if available
CONFIG_FILE=~/.builderbio/config.json
if [ -f "$CONFIG_FILE" ]; then
  PUBLISH_TOKEN=$(python3 -c "import json; print(json.load(open('$CONFIG_FILE')).get('publish_token',''))")
fi

# Publish via API
curl -s -X POST https://builderbio.dev/api/profile/publish \
  -H "Content-Type: application/json" \
  -d '{
    "username": "USERNAME",
    "publish_token": "TOKEN_OR_EMPTY",
    "profile": {
      "summary": "ONE_LINE_SUMMARY",
      "sessions_analyzed": N,
      "total_tokens": N
    },
    "builderbio": {
      "D": { ... full D data object ... },
      "E": { ... full E data object ... }
    }
  }'
```

4. **Save config**: On success, save the response's `publish_token` (if new) to `~/.builderbio/config.json`:
```bash
mkdir -p ~/.builderbio
echo '{"username":"chosen-name","publish_token":"TOKEN"}' > ~/.builderbio/config.json
```

5. **Handle errors**:
   - **409 (username taken)**: Ask the user to choose a different username. Suggest alternatives.
   - **Other errors**: Show error and retry.

6. **Done!** Print the live URL clearly:
```
✓ Your BuilderBio is live at: https://username.builderbio.dev
```

The user can re-run this skill anytime to update their profile. Changes are published to the same URL automatically (using the saved publish_token).

### Phase 5: Review (Optional)

After publishing, briefly mention:
- "Your BuilderBio is live. You can re-run this anytime to update it."
- "To change your profile, just say 'update my builderbio' and I'll re-scan and re-publish."

Do NOT prompt for feedback unprompted. Keep it clean — the aha moment is the published URL.

## BuilderBio Data Model

The parser script produces two data objects:

**D (primary data)** — the core profile:
```json
{
  "profile": { "display_name": "...", "lang": "en", "date_range": {...}, "active_days": 18, "total_sessions": 25, "total_turns": 4200, "total_tool_calls": 2100, "total_tokens": 850000, "agents_used": {...} },
  "projects": [ { "name": "...", "description": "...", "sessions": [...], "tags": [...], "total_turns": 1300, "total_tool_calls": 620, "date_range": {...}, "status": "shipped" } ],
  "heatmap": { "2026-03-01": 0, "2026-03-02": 45 },
  "style": { "avg_session_turns": 55, "session_length_distribution": {...}, "exploration_ratio": 0.07, "build_ratio": 0.07, "command_ratio": 0.31, "tool_totals": {...} },
  "highlights": { "biggest_session": {...}, "busiest_day": {...}, "longest_streak": 7, "current_streak": 2, "favorite_prompt": "..." }
}
```

**E (extra data)** — charts and analysis:
```json
{
  "time": { "hour_distribution": {...}, "period_data": {...}, "builder_type": "Morning Builder", "peak_hour": 10, "peak_text": "10 AM is my peak hour", "peak_detail": "Most active: 9-11 AM, 69 sessions" },
  "tech": { "Shell / CLI": 100, "HTML / CSS": 31, ... },
  "keywords": [ ["Agent", 30], ["Claude Code", 19], ... ],
  "evolution": [ { "week": "2026-01-19", "sessions": 50, "turns": 1584, "avg_turns": 32 }, ... ],
  "evolution_insight": "Started with frequent short sessions, shifted to deep building.",
  "comparison": { ... },
  "comparison_insight": "..."
}
```

Build both data objects and inject into the publish API call.

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
- The tone should be celebratory — this is something people share on social media
- **Run autonomously** — the only user interaction is choosing a username
- **Default to ALL data** — never ask about time ranges
- **Publish directly** — no local HTML file needed, go straight to username.builderbio.dev
