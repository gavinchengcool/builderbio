# BuilderBio Visual Archetypes

BuilderBio should not choose page style the way a blog chooses a color scheme.

The system should first decide **what kind of AI relationship this person has**, then choose a visual archetype that fits that reality.

## Presentation Order

Always decide presentation in this order:

1. infer `interaction_mode`
2. infer a default `style_theme`
3. explain the default briefly
4. let the user override if they want

Persist both the system pick and the final choice:

- `inferred_interaction_mode`
- `chosen_interaction_mode`
- `inferred_style_theme`
- `chosen_style_theme`

Do not start with "which theme do you want?"

The system should make a strong default choice first.

## 1. Interaction Modes

BuilderBio is no longer builder-only.

It should support three top-level modes:

### `builder`

Primary pattern:

- coding
- shipping
- editing files
- running tools
- pushing projects toward visible output

Signals:

- meaningful tool-call volume
- stable project clustering
- repo / cwd / file-edit evidence
- code, product, or delivery-heavy conversations

### `hybrid`

Primary pattern:

- some real building
- some non-coding conversations, exploration, learning, or journaling

Signals:

- projects exist but are not the whole story
- mixed session types across building and open-ended conversation
- tool usage exists but does not dominate

### `conversation-first`

Primary pattern:

- chatting
- thinking
- learning
- brainstorming
- emotional processing
- companionship

Signals:

- little or no meaningful project clustering
- low tool density relative to turns
- sessions are dominated by questions, reflection, or dialogue
- outputs are threads of thought, not software artifacts

Do not force `conversation-first` users into builder modules such as `Signature Build` or `Tech Fingerprint`.

## 2. Theme Selection Principles

Themes must differ in more than accent color.

Each theme should meaningfully vary:

- page density
- typography
- background atmosphere
- card shape and borders
- chart styling
- hero composition
- badge language

If the only difference is `--accent`, the theme system has failed.

For visual-execution details after mode/theme have been chosen, see [visual-execution.md](visual-execution.md).

General frontend-design references can help with execution quality, but they are downstream of BuilderBio's own presentation logic.

## 3. Builder-Mode Themes

These themes are for users whose dominant mode is building and shipping.

### `product-operator`

Use for:

- product-heavy work
- clear shipping momentum
- multiple project arcs
- operator energy

Direction:

- crisp YC-adjacent warmth
- high clarity
- medium density
- confident cards and progress bars

### `terminal-native`

Use for:

- CLI-heavy behavior
- shell-dominant tool usage
- terminal-centered working style

Direction:

- strong contrast
- denser layout
- utilitarian feel
- workbench energy

### `editorial-maker`

Use for:

- presentation-minded builders
- strong design / storytelling / portfolio feel
- high expressiveness

Direction:

- lighter editorial rhythm
- more whitespace
- stronger typography
- portfolio feature energy

### `night-shift`

Use for:

- late-night concentration
- high-intensity bursts
- multiple agents in relay mode

Direction:

- dramatic dark atmosphere
- vivid contrast
- momentum and tension
- never cheesy neon

### `research-forge`

Use for:

- research, analysis, translation, documentation
- long reasoning chains
- evidence-heavy work

Direction:

- lab notebook / dossier feel
- structured hierarchy
- evidence-forward modules
- disciplined charts

### `calm-craft`

Use for:

- steady compounding
- fewer projects, deeper focus
- slower but higher-finish output

Direction:

- restrained, warm, tactile
- lower contrast
- softer cards
- craftsmanship energy

## 4. Conversation-First Themes

These themes are for users whose AI history is primarily conversational.

### `companion-journal`

Use for:

- emotional support
- reflective dialogue
- recurring personal threads
- life journaling with AI

Direction:

- warm, intimate, low-pressure
- journal or yearbook energy
- relationship-forward, not productivity-forward

### `idea-salon`

Use for:

- brainstorming
- learning
- questions and perspective shifts
- recurring intellectual threads

Direction:

- thinking notebook / salon dossier
- more editorial than technical
- theme clusters and thread arcs over project cards

## 5. Hybrid Handling

`hybrid` users should still receive one visual archetype, but their page structure must mix:

- one or two build-centered modules
- one or two conversation-centered modules
- evidence modules shared by both

Do not flatten hybrid users into either pure building or pure conversation.

## 6. Mode-Specific Section Swaps

### Builder mode

Keep modules such as:

- `Signature Build`
- `What Actually Got Built`
- `Agent Roles`
- `Tech Fingerprint`

### Conversation-first mode

Prefer:

- `Signature Thread`
- `What Kept Coming Up`
- `AI Roles`
- `Conversation Activity`
- `When We Talk`
- `Recurring Threads`

### Hybrid mode

Mix:

- one representative build
- one representative thread
- AI roles that cover both execution and reflection

## 7. Default Selection Heuristics

The default should be deterministic and evidence-backed.

Useful signals:

- tool-call density
- shell ratio
- project count and cluster stability
- agent mix
- prompt length patterns
- session-length distribution
- peak-hour behavior
- recurring topic labels
- whether outputs look like code artifacts or idea threads

Example mappings:

- high shell ratio + stable projects -> `builder` + `terminal-native`
- shipping/product arcs + broad project surface -> `builder` + `product-operator`
- deep reading / research / translation -> `builder` + `research-forge`
- low tool usage + recurring reflective threads -> `conversation-first` + `companion-journal`
- low tool usage + question / learning / ideation threads -> `conversation-first` + `idea-salon`

## 8. User Override Rules

The system should always propose a default first.

Then it may say:

- what mode it inferred
- what theme it picked
- why
- what 2 nearby alternatives also fit

The user can override:

- mode
- theme

But the product should not depend on the user making design decisions from a blank slate.

## 9. Product Standard

The page should feel like it fits the user before they touch anything.

That is the benchmark:

- the content sounds like them
- the mode fits their actual AI relationship
- the theme looks like it belongs to that mode
