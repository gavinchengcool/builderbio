# BuilderBio Workflow Details

This file defines the exact workflow for the BuilderBio skill.

BuilderBio should behave like a **local annual-recap director with receipts**, not like a one-shot dashboard exporter.

## Workflow Contents

- Phase 1: Discover
- Phase 2: Parse
- Phase 3: Verify
- Phase 4: Recover
- Phase 5: Derive Facts
- Phase 6: Narrate
- Phase 7: Infer Mode and Visual Archetype
- Phase 8: Publish
- Phase 9: Report Back

## Phase 1: Discover

Goal: maximize recall before attempting analysis.

### Strong-path discovery

Probe all known supported agent roots.

```bash
# Claude Code
find ~/.claude/projects -name '*.jsonl' 2>/dev/null | head -200

# Codex
ls -lt ~/.codex/sessions/*/*/*/*.jsonl 2>/dev/null | head -100

# Trae / Trae CN
find ~/Library/Application\ Support/Trae/User -name state.vscdb 2>/dev/null | head -50
find ~/Library/Application\ Support/Trae\ CN/User -name state.vscdb 2>/dev/null | head -50

# Cursor
find ~/Library/Application\ Support/Cursor/User/workspaceStorage -name state.vscdb 2>/dev/null | head -50

# Antigravity
ls -la ~/.antigravity_tools/proxy_logs.db 2>/dev/null

# Gemini-hosted Antigravity fallback
find ~/.gemini/antigravity/conversations -name '*.pb' 2>/dev/null | head -50

# Kiro
ls -la ~/.kiro/*.db 2>/dev/null

# Windsurf
ls -lt ~/.windsurf/transcripts/*.jsonl 2>/dev/null | head -100

# OpenClaw
ls -lt ~/.openclaw/agents/*/sessions/*.jsonl 2>/dev/null | head -100
```

### Weak discovery

Also probe common app-support/config roots for likely chat logs:

- `~/.config`
- `~/Library/Application Support`
- editor/vendor folders such as `~/.cursor`

Look for:

- recent `.json`, `.jsonl`, `.db`, `.sqlite`, `.vscdb`
- filenames or content containing `sessionId`, `messages`, `tool_calls`, `token_usage`, `workspaceStorage`, `rollout`

If a source looks relevant but unsupported, record it as a candidate. Do not silently skip it.

### Identity defaults

Do not prompt for basic identity fields during discovery.

- Display name: default to `whoami`
- Language: infer the dominant language from session text and store it in `D.profile.lang`
- Time range: default to full history unless the user explicitly asks otherwise

## Phase 2: Parse

Goal: build canonical session summaries and emit a scan audit.

Primary path:

```bash
python <skill-path>/scripts/parse_sessions.py \
  --claude-dir ~/.claude \
  --codex-dir ~/.codex \
  --trae-dir "~/Library/Application Support/Trae" \
  --cursor-dir "~/Library/Application Support/Cursor" \
  --antigravity-dir ~/.antigravity_tools \
  --kiro-dir ~/.kiro \
  --windsurf-dir ~/.windsurf \
  --openclaw-dir ~/.openclaw \
  --days 0 \
  --output /tmp/builder_profile_data.json
```

Rules:

- Use `--days 0` for full-history scan
- Include only flags for roots that actually exist
- If `~/.antigravity_tools/proxy_logs.db` is missing, still inspect `~/.gemini/antigravity`
- The parser should emit:
  - `scanner_version`
  - `scan_audit.summary`
  - `scan_audit.agent_sources_found`
  - per-session provenance

The parser result is not the final product. It is the evidence substrate for later phases.

## Phase 3: Verify

Goal: detect obvious mismatches before narrative generation.

Run a verification pass after parsing:

- Compare detected agents with what strong/weak discovery found
- Compare agent coverage with user claims if any exist in the request
- Check for suspiciously empty outputs:
  - zero projects despite many sessions
  - one agent despite multiple vendor roots discovered
  - turns present but projects/time/comparison missing

If reality and output do not line up, do not continue straight to publish.

## Phase 4: Recover

Goal: salvage useful data from partial or unknown sources.

Recovery rules:

- If a dedicated parser fails, use a generic fallback when the source is chat-like
- Partial recovery is acceptable if it preserves:
  - timestamps
  - roles
  - text
  - cwd/workspace hint
  - tool names
  - token snapshots where recoverable

If recovery still fails:

- keep the source in `scan_audit`
- mark the profile `partial`
- include a specific `recommended_action`

## Phase 5: Derive Facts

Goal: move from session logs to defendable facts.

Derive facts in a deterministic order:

1. canonical session stats
2. project clustering
3. agent-role patterns
4. time rhythm
5. tool distribution
6. evolution stages
7. highlights
8. interaction mode
9. visual-archetype candidates

Every interesting claim must have one or more supporting facts underneath it.

See [profile-dimensions.md](profile-dimensions.md), [data-model.md](data-model.md), and [visual-archetypes.md](visual-archetypes.md).

## Phase 6: Narrate

Goal: turn facts into an annual-recap style BuilderBio with shareable identity.

Narrative priorities:

1. **Builder thesis**
2. **Signature build**
3. **Taste signals**
4. **Builder eras**
5. **Agent roles**
6. **Evidence layer**

Rules:

- Prefer memorable specificity over generic praise
- If evidence is thin, reduce confidence and say less
- Do not turn weak data into a fake personality test
- Good copy should feel like "that is exactly me"
- Narrative sentences must point at the builder, not at the page
- Never write meta-product copy such as "this page should..." or "people will remember..."
- If a sentence can replace the builder's name with any other name and still read the same, it is probably too generic
- Keep module titles and product UI chrome in English
- Keep the bottom `Make your own` CTA in English for every user
- Keep descriptive body copy in the builder's dominant session language from `D.profile.lang`

The page should create both:

- a private aha for the user
- a public reason to share

Mode rule:

- If the evidence says the user is primarily a builder, use the builder-oriented structure
- If the evidence says the user is `conversation-first`, switch to the conversation-first structure instead of forcing build-centric modules
- If the evidence is mixed, use the hybrid structure with both build and thread evidence

## Phase 7: Infer Mode and Visual Archetype

Do not start by asking the user to choose a theme.

Infer two things first:

1. `interaction_mode`
2. `style_theme`

Then, if the task includes detail-page design or visual refinement, apply [visual-execution.md](visual-execution.md).

Persist four values:

1. `inferred_interaction_mode`
2. `chosen_interaction_mode`
3. `inferred_style_theme`
4. `chosen_style_theme`

Rules:

- external frontend-design references can improve execution quality, but they must not replace BuilderBio's own mode/theme inference
- use them after the presentation decision is made, not before
- if they only change accent color and leave the layout untouched, the result is not good enough

### Interaction modes

- `builder`
- `hybrid`
- `conversation-first`

### Archetypes

Builder-oriented:

- `product-operator`
- `terminal-native`
- `editorial-maker`
- `night-shift`
- `research-forge`
- `calm-craft`

Conversation-oriented:

- `companion-journal`
- `idea-salon`

Compatibility themes that may still appear in legacy payloads:

- `default`
- `yc-orange`
- `terminal-green`
- `minimal-light`
- `cyberpunk`

Selection rules:

- use deterministic evidence, not random taste
- explain the default choice briefly
- only ask the user if they want to override the inferred default
- if the user is indifferent, keep the inferred default
- if the user overrides, keep both the inferred and chosen values in the payload

## Phase 8: Publish

Required payload keys:

- `inferred_interaction_mode`
- `chosen_interaction_mode`
- `interaction_mode`
- `inferred_style_theme`
- `chosen_style_theme`
- `style_theme`
- `style_theme_reason`
- `scanner_version`
- `scan_audit`
- `builderbio: { D, E }`

Integrity rules:

- preserve the stable top-line counts used for verification
- store a publish-time `data_hash`
- allow the server to compute whether the final page qualifies for `Unfiltered`

The local agent should not claim `Unfiltered` on its own unless it understands the server-side verification rule.

Use the stable device identity and publish token so updates land on the same BuilderBio URL.

If publish succeeds:

- print the live URL
- print the audit status
- say whether the result is complete or partial

## Phase 9: Report Back

Before the turn ends, summarize:

- agents discovered
- strong sources vs weak candidates
- sessions parsed
- unknown / partial sources
- recap headline
- publish URL

That summary is part of the product. It should not read like raw debug output.

## Failure Rules

If any of these happen, do not pretend success:

- no `builderbio D/E`
- no projects despite substantial sessions
- user explicitly says an agent is missing and audit confirms likely missing coverage
- publish succeeds but page data is obviously incomplete

In those cases, explain the gap and propose the next recovery step.
