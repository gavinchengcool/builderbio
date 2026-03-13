# BuilderBio Profile Dimensions

BuilderBio should feel closer to a great annual recap than a traditional dashboard.

This rubric defines the information architecture for the next-generation BuilderBio page.

## Core Outcome

The finished profile should create:

1. **Aha**: "I didn’t realize this is what my AI-building arc looks like."
2. **Identity**: "This actually sounds like me."
3. **Share impulse**: "This is interesting enough to post."

## Mode Architecture

BuilderBio should not assume every user is primarily building software.

Infer one of these first:

- `builder`
- `hybrid`
- `conversation-first`

Presentation metadata should preserve both the inferred and final chosen mode/theme so the system can explain why a page looks the way it does.

This decision changes not just the theme, but the middle of the page.

### `builder`

Use the standard builder-oriented structure:

- `Signature Build`
- `What Actually Got Built`
- `Agent Roles`
- `Tech Fingerprint`

### `conversation-first`

Replace build-centric middle modules with:

- `Signature Thread`
- `What Kept Coming Up`
- `AI Roles`
- `When We Talk`
- `Conversation Activity`

### `hybrid`

Mix both:

- one representative build
- one representative thread
- AI roles that cover both execution and reflection

## Section Priority

Not every section has equal importance.

### Layer 1: Identity & Taste

This is the "who is this builder?" layer.

1. Avatar, display name, and social links
2. Trust badges such as `Unfiltered`
3. Builder Thesis
4. Taste Signals
5. Agent lineup
6. AI Management Style

### Layer 2: What Makes Them Interesting

This is the shareable middle of the page.

6. Signature Build
7. Signature Moves
8. High Moments
9. What Actually Got Built
10. Agent Roles

### Layer 3: Evidence & Trust

These back up the recap and make it feel trustworthy.

11. Builder Eras
12. Evidence & Coverage
13. Tech Fingerprint
14. Time Rhythm
15. Activity / Heat / Volume

This order matters:

- top: identity and taste
- middle: what people would retell or learn from
- bottom: proof

The page should read like a person first, a story second, and analytics last.

## 0. Avatar and Social Identity

**Question answered:** Who is this, and where can I learn more?

BuilderBio should support user-supplied identity fields that are not inferred from logs:

- avatar
- display name
- X
- GitHub
- personal site

These do not replace scan-derived facts. They complete the personhood of the page.

They should appear near the top, not buried below the fold.

## 0.5 Trust Badges

**Question answered:** Why should people trust this page enough to care?

Badges such as `Unfiltered` are not decoration. They are social currency plus trust currency.

`Unfiltered` should only appear when the page can honestly claim:

- the core BuilderBio payload came directly from raw logs
- the published payload still matches the verification hash expected by the server
- no silent editing or schema drift has broken integrity

This badge belongs near the top because:

- it is screenshot-friendly
- it signals legitimacy instantly
- it makes the page feel more like a receipt than a vibe board

Do not overproduce badges. One strong integrity badge is better than five weak ones.

## 1. Builder Thesis

**Question answered:** Who is this builder?

This is the most important line on the page.

It should sound like identity, not like analytics. Examples:

- "The builder who ships the product before writing the pitch."
- "A CLI-first tinkerer who uses AI to compress weeks of iteration into a night."
- "A multi-agent operator who treats different models like different instruments."

Good thesis lines:

- are specific
- feel human
- are evidence-backed
- avoid stat dumping
- talk about the builder, not about the page or product

Bad thesis lines:

- "Used 230 sessions and 12.7K turns"
- "Full-stack AI developer"
- generic motivational fluff
- "This page should feel like..."
- "These are the moments people will remember"

## 2. Signature Build

**Question answered:** What best represents this builder?

Do not simply choose the biggest project by count.

The signature build should be the project or arc that best captures:

- recurrence
- depth
- distinct taste
- actual output

Use a combination of:

- total turns
- total sessions
- recency
- uniqueness of topic
- narrative centrality

If the page is `conversation-first`, swap this module for `Signature Thread`:

- the recurring dialogue arc or question thread that best represents the user
- why they keep coming back to it
- proof points such as sessions, turns, span, and recurring topics

What to show:

- project name
- short description
- why it matters
- proof points (sessions, turns, timespan, pivotal moments)

## 3. Taste Signals

**Question answered:** What makes this builder recognizable?

These are compact cues, almost like personality tells.

Examples:

- CLI first
- Night-owl finisher
- Research before build
- UI polish obsessive
- Single-project deep diver
- Multi-agent orchestrator

A good taste signal combines:

- behavior pattern
- stylistic implication
- short memorable label

Each signal should be supportable from facts such as:

- command ratio
- time-of-day concentration
- tool preference
- project revisitation
- agent mix

## 4. Builder Eras

**Question answered:** How did this builder evolve?

The evolution section should not be a raw weekly histogram only.

It should identify 2-4 eras such as:

- Exploration
- Compounding
- Shipping
- Refinement
- Expansion

For each era:

- title
- date range
- what changed
- supporting stats

This should feel like a mini story of the builder’s relationship with AI.

## 5. AI Management Style

**Question answered:** How does this builder run AI?

This deserves explicit treatment near the top of the page.

Examples:

- Director
- Editor
- Foreman
- Explorer
- Closer
- Multi-agent operator

This is not a personality test. It should come from facts such as:

- agent-role split
- session depth
- task handoff patterns
- editing vs execution balance
- project concentration

The page should be able to say something like:

- "Uses Codex to cut fast, Claude Code to stay with ambiguity, and Trae to stay in flow."

For `conversation-first` users, this module should become more like relationship style than project orchestration. Examples:

- "Uses AI as a sounding board before making decisions."
- "Returns to AI for perspective, reframing, and emotional clarity."
- "Treats different agents as different kinds of conversational partners."

## 6. Signature Moves

**Question answered:** What does this builder do that feels characteristic?

These are the "stealable" behaviors.

Examples:

- Ship before polish
- Use the product on itself
- Explore wide, then close hard
- Split agents by intent
- Keep one flagship project compounding in the background

Each move should be:

- short
- memorable
- evidence-backed
- useful to a reader

## 7. High Moments

**Question answered:** What parts of the story would people retell?

Examples:

- Craziest session
- Biggest shipping day
- Longest streak
- Turning point
- Most unexpected build

For `conversation-first` users, high moments may instead be:

- deepest thread
- longest return arc
- breakthrough conversation
- most revisited question

These should feel like recap moments, not just superlatives.

## 8. What Actually Got Built

**Question answered:** What shipped, or almost shipped?

This remains critical, but it should come after identity and signature build.

Project cards should emphasize:

- what the project is
- why it mattered
- where it sits in the builder’s arc

Project clustering should not stop at cwd alone. Use:

- cwd/workspace
- temporal proximity
- topic overlap
- repeated nouns/entities
- deployment/shipping hints

## 9. Agent Roles

**Question answered:** What is each agent for?

This is better than showing raw side-by-side usage metrics first.

For each agent, derive a role such as:

- deep workbench
- fast scalpel
- research copilot
- IDE cockpit
- execution engine

Agent-role statements should come from:

- average session depth
- top tools
- project distribution
- time distribution
- prompt style differences

Metrics still matter, but they should support the role statement.

## 10. Evidence & Coverage

**Question answered:** Why should I trust this page?

Do not hide scan completeness. Do not lead with scanner internals either.

This section should present evidence gently:

- coverage status
- sources found
- unknown/partial count
- confidence
- rescan recommendation if needed

The tone should be:

- transparent
- calm
- non-alarming

This is the receipt layer, not the headline layer.

## 11. Tech Fingerprint

Show the top technologies and domains, but keep it concise.

This is useful proof, not the emotional hook.

Preferred framing:

- "What this builder keeps coming back to"
- "Where their energy goes"

## 12. Time Rhythm

Time-of-day remains useful because it quickly adds personality.

But frame it as rhythm, not just charting:

- peak hour
- dominant window
- builder type
- supporting evidence bars/cards

Examples:

- Morning Builder
- Late-night closer
- Weekend marathoner

## 13. Activity / Volume

Heatmaps and totals are supporting evidence.

They help the user feel scale and consistency, but should not overshadow the thesis or signature build.

## Listing Card System

Taste-board cards should prioritize:

1. summary / thesis
2. subtitle (agent mix or strongest identity cue)
3. tags that mix domain + taste
4. real or branded fallback avatar

Avoid internal scanner jargon on public cards.

## CTA

The CTA should invite imitation:

- "Like what you see?"
- "Paste into your coding agent"

It should feel like an invitation into the same recap ritual.

## Quality Checks

Before publishing, ask:

- If I remove the charts, does the builder still feel distinct?
- Does the page say what they built, not only how much they used AI?
- Would the user screenshot at least one section?
- Would a stranger understand why this builder is interesting?
