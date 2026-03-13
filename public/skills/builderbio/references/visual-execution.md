# BuilderBio Visual Execution Layer

This file defines how BuilderBio should translate mode and archetype choices into page design.

Use it when:

- refining BuilderBio detail-page design
- generating a new visual variant
- deciding whether to borrow ideas from a general frontend-design skill

Do not use it to replace the product logic in [visual-archetypes.md](visual-archetypes.md).

BuilderBio still decides presentation in this order:

1. infer `interaction_mode`
2. infer `style_theme`
3. choose the correct page skeleton
4. execute the visual language

`visual-execution` is step 4.

## What BuilderBio Can Learn From A General Frontend-Design Skill

BuilderBio can borrow these principles:

- start from a strong visual direction instead of a safe average
- make typography, density, background, cards, and charts serve the same mood
- avoid "same layout, different accent" theme systems
- make mobile feel intentional instead of compressed desktop
- let a few modules feel screenshotable, not equally weighted

These lessons are useful because BuilderBio detail pages should not collapse into generic dashboard UI.

## What BuilderBio Must Not Borrow Blindly

Do not let a general frontend-design reference override BuilderBio's own product contract.

Do not:

- pick a visual style before inferring mode and archetype
- treat every user like a blank design canvas
- let "interesting visuals" erase evidence, truth, or user-fit
- force `conversation-first` users into portfolio-like layouts
- optimize for novelty while making the page less readable

BuilderBio is not a random landing-page generator.

It is a mode-driven recap system with visual execution layered on top.

## Execution Rules

### 1. Mode changes the page skeleton

`builder`, `hybrid`, and `conversation-first` must not share the same middle of the page.

At minimum:

- `builder` centers shipped work, agent roles, and build evidence
- `hybrid` shows both build-line and thread-line modules
- `conversation-first` centers threads, AI roles, and conversation activity

If all three modes render the same module order with different color tokens, the design has failed.

### 2. Archetype changes more than color

Archetypes must visibly change:

- hero composition
- information density
- typography
- card grammar
- chart styling
- background atmosphere
- chip / badge language

If the only change is accent color, the archetype system has failed.

### 3. Social-currency modules get special treatment

These modules should feel like screenshot-worthy surfaces, not just regular cards:

- `Unfiltered`
- `tokens`
- `Activity`
- `When I Build` / `When We Talk`
- `High Moments`
- `Builder Thesis` / `Interaction Thesis`

They should have stronger visual hierarchy than ordinary evidence sections.

### 4. Mobile is the primary reading environment

Assume many first-time visitors will open a BuilderBio on mobile.

The first mobile screen should establish:

- who this person is
- what mode they are in
- which agents matter
- how intense the history is
- one high-signal hook worth scrolling for

Long explanations should come later.

### 5. Visual decisions must still be evidence-backed

The page is allowed to feel expressive, but the expression must still fit the underlying evidence.

Examples:

- a shell-heavy, tool-dense profile can justify a more terminal-native treatment
- a reflective, thread-heavy profile can justify a journal or salon treatment
- a research-heavy profile can justify dossier-like hierarchy

Do not assign aesthetics at random.

## BuilderBio-Specific Translation Of The Frontend-Design Lessons

Use the stronger visual-execution ideas, but translate them into BuilderBio terms:

- "clear visual direction" -> a fitted `interaction_mode + style_theme`
- "avoid AI slop" -> avoid generic dashboard sameness
- "intentional typography" -> type should reinforce the archetype
- "bold layout" -> change composition, not just colors
- "meaningful motion" -> motion should reinforce hierarchy, not add noise
- "background atmosphere" -> support the archetype without reducing readability

## Minimum Visual Quality Bar

The page should make these feel obvious:

- why this mode was chosen
- why this archetype was chosen
- which modules are the main act
- which modules are receipts
- that this page belongs to this user, not to a generic template family

If the page could be reused for another user by swapping name, avatar, and accent, it is still too generic.
