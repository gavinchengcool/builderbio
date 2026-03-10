# BuilderBio Dimensions

This document defines how to analyze a user's complete Coding Agent history into a shareable BuilderBio. The profile is about the PERSON, not any single session.

## Contents

- Dimension 1: Builder Identity
- Dimension 2: What I Built
- Dimension 3: Tech Stack Fingerprint
- Dimension 4: How I Build
- Dimension 5: Collaboration Evolution
- Dimension 6: Time-of-Day Distribution
- Dimension 7: Prompt Keywords
- Dimension 8: Agent Comparison
- Dimension 9: Activity Heatmap
- Dimension 10: Highlight Moments
- Dimension 11: CTA (Call-to-Action)

---

## Dimension 1: Builder Identity

**Social currency:** "Look how much this person builds with AI"

The hero section. Big numbers that immediately convey scale.

### What to compute

- **Display name**: from user input or `whoami` as fallback. Page title becomes `{name}'s BuilderBio`
- **Tagline** (optional): short subtitle like "@handle" or a one-liner
- **Avatar** (optional): profile image URL or local file path. Rendered as a circular 88px image above the title
- **Total sessions** across all agents
- **Active days** (days with at least one session)
- **Total turns** (sum of all user + assistant exchanges)
- **Total tool calls** (sum of all tool invocations)
- **Total tokens** (if available)
- **Agents used**: which agents, how many sessions each, relative proportion
- **Models used**: which models, how often
- **Date range**: first session date to last session date
- **Social links**: user-provided social media profile URLs (LinkedIn, X/Twitter, GitHub, etc.)

### How to present

- Circular avatar (88px) above title if provided — with subtle border and glow shadow
- Page title: `{display_name}'s BuilderBio` — large h1, gradient text
- Tagline below title if provided (smaller, muted color)
- 3-4 large stat numbers in the hero area (sessions, turns, tool calls, active days)
- Agent badges showing which tools the person uses
- Social media icon row below agent badges — each platform rendered as a clickable icon (inline SVG) linking to the user's profile URL. Supported platforms and their SVG icons:
  - **LinkedIn**: LinkedIn logo SVG, links to `linkedin.com/in/...`
  - **X / Twitter**: X logo SVG, links to `x.com/...`
  - **GitHub**: GitHub logo SVG, links to `github.com/...`
  - **YouTube**: YouTube logo SVG
  - **Website**: Globe icon SVG for personal sites
  - Display only the platforms the user provides — skip any without a URL
- Date range as subtitle

---

## Dimension 2: What I Built

**Social currency:** "Look what this person shipped with AI"

This is the most important section. It answers: what did you actually make?

### How to cluster sessions into projects

Sessions need to be grouped into logical "projects." Use these heuristics:

1. **Same working directory (cwd)**: sessions in the same project folder are likely the same project
2. **Temporal proximity**: sessions on the same day or consecutive days about similar topics
3. **Keyword overlap**: sessions whose first user messages share key terms (file names, tech stack, feature names)
4. **Display text similarity**: the `display` field from history.jsonl often captures the essence

For each project, extract:
- **Name**: infer from the cwd directory name, or from the dominant topic
- **Description**: one sentence summarizing what was built, derived from the user's first prompts
- **Tech stack tags**: inferred from tool calls (e.g., if Write targets .tsx files → React; if Bash runs `npm` → Node.js)
- **Session count**: how many sessions contributed
- **Scale**: total turns + tool calls across all sessions in this project
- **Date range**: first to last session date
- **Status**: infer from context — "shipped" if deployment commands ran, "in progress" if recent, "explored" if short

### How to present

- Card grid, each card = one project
- Sort by recency (most recent first)
- Each card shows: name, description, tags, date range, scale indicator
- Highlight the largest project visually

---

## Dimension 3: Tech Stack Fingerprint

**Social currency:** "One glance at what technologies this person works with"

### What to compute

Infer the user's technology footprint from two sources:

1. **Tool calls & file types**: analyze Write/Edit targets for file extensions (.tsx → React, .py → Python, .html → Web)
2. **Display text keywords**: scan first prompts for technology mentions (npm, python, MCP, supabase, etc.)

Score each tech area on a 0-100 scale (relative to the most-used one). Recommended categories:
- Shell / CLI
- HTML / CSS
- Python
- Claude Code Skills
- MCP Integrations
- Product Strategy (if non-code discussions are significant)
- Content Processing (if reading/translating articles is significant)
- AI Agent Ecosystem (if researching/discussing agents is significant)
- Media Automation (if downloading/processing media)
- Code Reading vs Code Generation

### How to present

- Horizontal bar chart, sorted by score descending
- Each bar uses a distinct color
- Maximum 10 items to keep it clean
- Show percentage value at the right of each bar

---

## Dimension 4: How I Build

**Social currency:** "This is my AI working style"

Think of this as a personality profile for how someone uses AI. It should feel like a fun assessment, not a metrics dashboard.

### Traits to analyze

#### Prompt Style
Classify based on the user's first message patterns across sessions:
- **Architect**: provides detailed plans, structured requirements, specs upfront
- **Conversationalist**: iterates through dialogue, refines through back-and-forth
- **Delegator**: short one-line instructions, trusts the agent to figure it out
- **Explorer**: asks questions first, reads code, then decides what to do

Look at the average length of the user's first message per session and the ratio of user messages to total messages.

#### Session Rhythm
- **Sprinter**: short intense sessions (< 20 turns), many per day
- **Marathoner**: long deep sessions (100+ turns), few per day
- **Balanced**: mix of both

Compute from session turn counts and sessions-per-day distribution.

#### Tool Preference
- **Explorer**: high Read/Search/Glob ratio (> 40% of tool calls)
- **Builder**: high Write/Edit ratio (> 40% of tool calls)
- **Commander**: high Bash ratio (> 30% of tool calls)
- **Balanced**: no single category dominates

Aggregate tool call distribution across all sessions.

#### Agent Loyalty
- **Monogamous**: uses one agent exclusively (> 90% of sessions)
- **Polygamous**: uses multiple agents regularly
- **Experimenter**: tried many but settled on one

### How to present

- A primary style label (e.g., "Architect × Marathoner")
- 3-4 trait cards showing each dimension with a short description
- Keep it light and shareable — this is the part people screenshot

---

## Dimension 5: Collaboration Evolution

**Social currency:** "My AI collaboration is evolving"

### What to compute

Group sessions by **week** (Monday-aligned) and compute per week:
- **Session count**: how many sessions that week
- **Total turns**: volume of conversation
- **Average turns per session**: depth indicator
- **Total tool calls**: execution volume

The evolution curve reveals whether the user is:
- Getting more efficient (same output, fewer turns)
- Going deeper (longer sessions over time)
- Ramping up (more sessions per week)
- Transitioning from exploration to deep building

### How to present

- Vertical bar chart, one bar per week, height = total turns
- Display turn count above each bar
- Week label (MM-DD format) below
- Include a **trend insight** text block below the chart summarizing the pattern in natural language (e.g., "前 4 周以高频短对话为主，第 5 周开始转向深度长对话 —— 从探索期进入了深度构建期")

---

## Dimension 6: Time-of-Day Distribution

**Social currency:** "I'm a 2am builder" — immediate personality signal

### What to compute

From session file timestamps (first entry in each JSONL file, or file mtime as fallback):
- **Hour distribution**: count sessions starting in each hour (0-23)
- **Period aggregation**: group into 4 periods:
  - Deep night: 0:00-5:59
  - Morning: 6:00-11:59
  - Afternoon: 12:00-17:59
  - Evening: 18:00-23:59
- **Peak hour**: the single hour with the most sessions
- **Builder type label**: based on the period with most sessions
  - zh: "深夜型 Builder" / "早起型 Builder" / "下午型 Builder" / "夜猫子型 Builder"
  - en: "Late Night Builder" / "Early Bird Builder" / "Afternoon Builder" / "Night Owl Builder"

### How to present

- 24-column bar chart, each column = one hour, colored by period
  - Deep night: purple, Morning: yellow, Afternoon: orange, Evening: indigo
- Hover/tooltip showing exact count
- Large text: peak text from data (zh: "上午 10 点是我的巅峰时刻", en: "10 AM is my peak hour")
- 4 period summary cards showing session count and turn count per period

---

## Dimension 7: Prompt Keywords

**Social currency:** "What's always on my mind"

### What to compute

Extract keywords from the `display` / `first_msg` field of all sessions:
- **Chinese phrases**: extract 2-6 character sequences using regex `[\u4e00-\u9fff]{2,6}`
- **English words**: extract 3+ character words using regex `[a-zA-Z]{3,}`
- Filter out stop words (common Chinese particles, English articles, generic verbs)
- Filter out noise words (filesystem terms, generic UI text)
- Count occurrences, keep words with count >= 3
- Take top 20-30 keywords

### How to present

- Word cloud / tag cloud layout
- Font size proportional to frequency (6 size levels)
- Color intensity proportional to frequency
- Centered, wrapped layout with rounded pill-shaped tags
- Should feel like a personality snapshot

---

## Dimension 8: Agent Comparison

**Social currency:** "I use different agents for different things"

Only relevant if the user uses 2+ agents.

### What to compute

Per agent, compute:
- **Session count**
- **Total turns** and **average turns per session**
- **Total tool calls**
- **Top 4 tools** (with counts)
- **Session length distribution**: short / medium / long

Derive a **usage insight**: e.g., "Claude Code 用于深度构建（平均 126 轮/次），Codex 用于快速问答（平均 35 轮/次）"

### How to present

- Side-by-side card layout, one card per agent
- Each card shows: 4 stat boxes (sessions, turns, avg turns, tool calls)
- Tool usage mini-bar chart within each card
- Session length distribution text
- Summary insight text block below the cards

---

## Dimension 9: Activity Heatmap

**Social currency:** "I build every day" — the streak and consistency story

### What to compute

- **Daily activity**: for each day in the range, count total turns (or tool calls)
- **Intensity levels**: bucket into 0 (no activity), 1 (light: 1-20), 2 (medium: 21-100), 3 (heavy: 101-300), 4 (intense: 300+)
- **Streaks**: consecutive days with activity
  - Current streak
  - Longest streak
- **Day-of-week pattern**: which days are most active
- **Time-of-day pattern**: morning / afternoon / evening / night (from session timestamps)

### How to present

- GitHub-style contribution grid (7 rows × N weeks)
- Color intensity from transparent to bright
- Streak counter displayed prominently
- Small bar chart for day-of-week distribution

---

## Dimension 10: Highlight Moments

**Social currency:** "Here's my most impressive AI moment"

Superlatives and fun facts that are easy to share and talk about.

### What to extract

- **Biggest session**: the session with the most turns or tool calls — name the project and the scale
- **Most productive day**: the day with the most total activity
- **Longest streak**: consecutive days of building
- **Marathon session**: longest duration (wall clock time)
- **Favorite prompt**: select the most interesting or effective user prompt across all sessions — something that would make other builders say "I should try that"
- **Fun comparisons**: put numbers in human context
  - "N turns this month = a N-page book of conversation"
  - "N tool calls = you had your AI read/write N files"
  - "Active N out of 30 days = busier than most developers"

### How to present

- Highlight cards with large values and fun descriptions
- The favorite prompt in a styled quote block
- Tone: celebratory, shareable, slightly playful

---

## Dimension 11: CTA (Call-to-Action)

**Social currency:** Viral loop — make viewers want to generate their own profile

### What to include

- Headline: "Show the world my taste"
- Description: "Send this to my coding agent - get my bio link"
- Install command: `curl -sfL https://builderbio.dev/install.sh | bash`
- CTA text is always in English regardless of page language

### How to present

- Centered card with subtle gradient background
- Code block for the install command (user-selectable text)
- Clean, inviting, non-aggressive tone

---

## Language Detection

Detect the user's primary language from their session history:
1. Scan `display` text of all sessions
2. Compute ratio of Chinese characters (`[\u4e00-\u9fff]`) to total characters
3. If ratio > 0.3, set `D.profile.lang` to `"zh"`; otherwise `"en"`
4. Alternatively, match the language of the current conversation with the user

**Important**: All UI chrome — section headers, stat labels, status badges, period names, tooltips, highlights, heatmap labels, CTA, and footer — is always rendered in American English, regardless of the `lang` setting. The `lang` value only determines the language for user-generated content.

All text strings generated by the agent (style descriptions, evolution insights, comparison insights, time-of-day peak text) should be written in the detected language and injected into the data model fields (`E.evolution_insight`, `E.comparison_insight`, `E.time.peak_text`, `E.time.peak_detail`, `D.style.style_sub`, `D.style.prompt_type_desc`, `D.style.loyalty_desc`).

---

## Analysis Process

1. Run the batch parser to get all session summaries (including timestamps for time-of-day)
2. Compute Dimension 1 (Builder Identity) from raw aggregates
3. Cluster sessions into projects for Dimension 2 (What I Built)
4. Infer tech stack from tool calls and keywords for Dimension 3 (Tech Stack)
5. Analyze working patterns for Dimension 4 (How I Build)
6. Group sessions by week for Dimension 5 (Evolution Curve)
7. Extract hour-of-day from timestamps for Dimension 6 (Time Distribution)
8. Extract keywords from display text for Dimension 7 (Keywords)
9. Compute per-agent stats for Dimension 8 (Agent Comparison) — skip if single agent
10. Build the daily activity grid for Dimension 9 (Heatmap)
11. Extract superlatives for Dimension 10 (Highlights)
12. Append CTA section for Dimension 11
13. Package everything into the profile data model for the HTML generator
