# Florabox — Claude Code Project Brief

---

## Project Overview

**Florabox** is a free virtual wish card & flower bouquet gifting website. Anyone can create and share cards or bouquets without an account. The feeling should be warm, cosy, joyful, and premium — like a warm hug.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + Tailwind CSS + Framer Motion |
| Backend | Express.js + PostgreSQL on Neon |
| Deployment | Vercel |
| Fonts | Cormorant Garamond (headings) + Jost (body) + Share Tech Mono (mono) |
| Animation | Framer Motion (UI), Web Animations API (gallery track), canvas RAF loops (petals, Mineral Moon, reveal) |

---

## Design System

### Colours
```
--ink-brown:      #1e1008   (primary text, borders)
--ink-brown-deep: #2a1410   (deep accents)
--gallery-dark:   #080709   (gallery / compose room background)
--gold:           rgba(201,168,76,.88)  (gallery accents, selection ring)
--warm-brown:     #3d2510   (buttons, accents)
--blush:          #c97888   (highlights, Love cards)
--parchment:      #f5ede0   (background base)
--parchment-2:    #ede0cc   (home page background)
```

### Typography
- **Headings:** Cormorant Garamond — italic, weights 300/400
- **Body:** Jost — weights 300/400/500
- **ASCII/Mono elements:** Share Tech Mono

### Aesthetic
- East Asian ink blossom painting on parchment — sparse, elegant, breathing room
- No emojis anywhere — custom SVG icons only, fine linework style
- Cards/buttons: squared corners (`borderRadius: 4px`), botanical hairline details
- Petal animation on home page: canvas RAF loop, Ghost of Tsushima style
- **Mascot / logo:** an original black cat (not Jiji — keep it our own) with pale jade eyes (`#b9d3a8`) and a blush five-petal blossom collar. Seated pose = logo mark; side pose for walking/leaping. Shapes live in `components/mascot/catShapes.js` — change them there so the logo, favicon and animated cat stay in sync.

---

## Mobile Rules (Apply Everywhere)

- Mobile-first — works on 375px, 430px, 768px, 1280px, 1440px
- Use `100dvh` not `100vh`
- Parallax and hover effects disabled on touch devices via `window.matchMedia('(hover: none)')`
- All spacing and font sizes use `clamp()`
- Touch targets minimum 44px height

---

## What's Already Built

- ✅ Project scaffolded — React + Vite + Tailwind + Express + Neon schema
- ✅ Home page (`/`) — parchment + ink blossom SVG background, Ghost of Tsushima petal canvas animation, three action cards with SVG icons, and the mascot cat (see below)
- ✅ Card gallery (`/gallery`) — hero + dark gallery room (see below)
- ✅ Preset cards — Birthday: Marbled Rose, Golden Hour, Mineral Moon; Love: Wisteria
- ✅ Preset compose page (`/card/new?preset=<id>`) — Path A: live preview, To/From/message, music picker, Send → shareable link
- ✅ Recipient view (`/view/:id`) — envelope reveal, themed reveal animation (botanical + cosmic), card, "Send your own Florabox"
- ✅ Card save/retrieve API (`POST /api/cards`, `GET /api/cards/:id`) + schema in `server/schema.sql`
- Placeholder only: craftsman builder (`/card/new` without a preset), bouquet builder (`/bouquet/new`), My Creations (`/u/:username`, layout built on dummy data)

---

## Mascot cat — as built (`components/mascot/`)

- `BranchCat.jsx` — lives on the home page's right-hand tree (inside its sway group, so it moves with the branch). RAF state machine: sits (blinks, tail sway + flicks, pupils follow the pointer) → strolls along `BRANCH_PATHS[12]` → or leaps to a perch on `BRANCH_PATHS[13]`. Click → little hop. Perches are `CAT_PERCHES` in `Home.jsx`. `prefers-reduced-motion`: stays seated.
- `PerchedCat.jsx` — used instead when the right tree is off-screen (width < 768px or aspect < 1.2): sits on top of the action cards, CSS blink/tail, tap → hop.
- `CatMark.jsx` — static logo (used beside "Send your own Florabox"); `public/favicon.svg` is generated from the same shapes.
- `CatParts.jsx` — `SeatedCat` / `SideCat` SVG parts with refs for animation.

---

## Card Gallery — as built

`pages/CardGalleryPage.jsx` stacks two layers in a `200dvh` wrapper: `GalleryHero` (absolute, on top) scrolls away like a curtain to uncover `CardGallery` (sticky, `100dvh`) underneath.

### GalleryHero
- Title and scattered quotes over an interactive gold `+` grid (`PatternCanvas.jsx` — canvas, cursor spotlight)
- Grain + washi texture overlays; delayed scroll cue; cursor effects off on touch (`(hover: none)`)

### CardGallery
- **Background:** near-black `#080709` with grain + washi overlays — the parchment cards glow against it. No occasion tabs.
- **Track:** horizontal row of live card components. Moved by mouse drag / touch drag (not scroll-scrubbed); position is a `translateX(%)` driven by the Web Animations API with dynamic clamp bounds that centre the first/last card. Card size is responsive and keeps the 3:4 ratio.
- **Select:** click / tap a card → track snaps it to centre, it gets a gold ring + glow, and an expanded overlay shows it large with its name in the card's own `nameColor` / `nameFont`. Scroll-wheel up over a card also expands; wheel down closes.
- **Chrome while a card is selected:** `+` prev/next buttons (fine-line SVG, rotate on click), `01 / 04` counter, "back" button, and the **"Use this card"** CTA → `/card/new?preset=<id>`. With nothing selected, a "home" button shows instead.
- Honours `prefers-reduced-motion`.
- Card metadata lives in `data/cards.js`: `id`, `name`, `occasion`, `theme` (drives the reveal animation), `Component`, `nameColor`, `nameFont`, `nameItalic`, and `messageLayout` (`{ chars, lines }` — must match the card's own word-wrap).

---

## Preset Card List — Birthday (3 cards, built)

Original HTML designs are in `client/src/cards/`; the React components are in `client/src/components/cards/birthday/`.

### Birthday 1 — "Marbled Rose"
- **File:** `florabox_marbled_rose_v7.html`
- **Style:** Ebru marbled paper background + botanical rose illustration
- **Background:** Warm cream `#f2e4cc` with blush pink + crimson marbled pools, blue-grey veining, ink spatter dots
- **Illustration:** Ink line botanical rose rising bottom-right. Compound rose leaves (Rosa canina). Blush wash inside petals. Gradient green leaves with white midrib highlights and shadow ellipses. Gradient stems.
- **Details:** Rosa canina specimen label bottom-centre. To/message lines top-left. From is signature-style: name on the dashed line, "From," beneath (intentional).
- **Feel:** Warm, classical, aged botanical print

### Birthday 2 — "Golden Hour"
- **File:** `florabox_golden_hour_v2.html`
- **Style:** Scattered ink petals + warm amber watercolour wash
- **Background:** Warm parchment `#f5e8d0` with amber/honey watercolour pools and a hint of rose blush
- **Illustration:** Ink petals scattered at varying angles across the whole card. Small 5-petal ink blossoms. Two integrated corner botanical branches that end in blossoms.
- **Details:** "happy birthday" italic Cormorant flanked by hairline rules. "for you, with joy" bottom. To/From dashed lines.
- **Feel:** Joyful, warm, celebratory

### Birthday 3 — "Mineral Moon"
- **File:** `florabox_mineral_moon_v6.html` (user's final tweaked version)
- **Style:** Cosmic animated canvas
- **Background:** Deep space `#030310` → `#090920` with blue-black nebula washes
- **Animation:** Continuous canvas RAF loop —
  - Mineral moon painted with geological colour zones: titanium blue, amber highland, orange-rust maria, teal, olive, purple mauve, bright highland whites, craters with ejecta rays
  - Pulsating halftone dot grid ripples outward from moon centre
  - Stars twinkle with individual pulse phase offsets
  - Brightest stars have animated cross glints
- **Details:** Monospace zone labels `[Ti] mare` `[Fe] terra` `[Mg] basin`. ASCII corner marks. "a wish sent to the stars" bottom. To/From in blue-tinted Cormorant.
- **Feel:** Cosmic, scientific, animated, unlike anything else

---

## Love — Wisteria (built)
- `components/cards/love/WisteriaCard.jsx` — full-bleed painted background (`public/cards/wisteria-bg.jpg`) with a tiled roof and hanging wisteria; To / message / From overlaid in Cormorant

## Remaining Occasions (Not Yet Designed)

Add each card to `components/cards/<occasion>/` and register it in `data/cards.js` — the gallery, compose page and recipient view pick it up automatically. Each gets 2 cards.

| Occasion | Cards |
|----------|-------|
| Love / Romance | 1 more (Wisteria done) |
| Friendship | 2 |
| Congratulations | 2 |
| Thank You | 2 |
| Sympathy | 2 |
| Just Because | 2 |

Total: 15 preset cards when complete.

---

## Two User Paths After Gallery

### Path A — Preset Card ✅ (`components/card-compose/`)
1. User selects preset from gallery
2. Card is **locked** — no design changes
3. User fills: optional To, optional From (≤40 chars), personal message (≤140 chars, and must fit the card's `messageLayout` — Send is disabled otherwise)
4. Selects music track (`data/music.js` — placeholder list; set each track's `src` once audio is in `public/music/`)
5. Hits Send → saved via API → "Your card is on its way" with the shareable link + copy (full-screen send animation not built yet)

### Path B — Custom "Craftsman" Builder (not built)
Entry: CTA button *"or become a craftsman and create your own"* in the gallery.

**Layout:**
- Floating bottom toolbar, live card preview above
- Desktop ≥768px: split-screen (preview left, tools right)
- Mobile: tool panels as bottom drawers

**Tools:**
- Card format switcher: Portrait (3:4) / Landscape (4:3) / Square (1:1)
- Background picker: 5–7 templates
- Sticker packs (drag & drop):
  - Animals
  - Flowers & botanicals
  - Extras (ribbons, envelopes, sparkles)
  - ASCII Creatures (their own tab)
- Message: text area + font picker (Cormorant Garamond, Jost, Share Tech Mono, + 1)
- Names: optional To / From
- Music: curated 5–10 track playlist

---

## Send Moment & Recipient Experience

### Send Animation (Full-Screen, Theme-Based) — planned
| Theme | Animation |
|-------|-----------|
| Nature / Botanical | Leaves swirl upward, card lifts into wind |
| Love / Romance | Rose petals spiral upward |
| Birthday | Confetti + illustrated stars burst |
| Friendship | Paper cranes unfold and flutter |
| Congratulations | Gold ribbons + streamers shoot up |
| Sympathy / Thank You | Gentle flower bloom, soft upward drift |
| Ink / East Asian | Ink disperses like a drop in water |
| Pixel / ASCII | Card pixelates, scatters to grid, dissolves |
| Cosmic / Moon | Stars streak outward from card centre |

After animation: card shown full-screen, unique link below, copy button.

### Recipient Flow ✅ (`pages/CardView.jsx`, `components/card-viewer/`)
1. Envelope opens (SVG animation) — parchment room, blush wax seal; tap → seal lifts, flap folds, letter slides out
2. Themed animation plays — `RevealAnimation.jsx` has a theme registry; built so far: `botanical` (petals/leaves drift up), `cosmic` (stars streak from centre). Add new themes there.
3. Card fades in, music plays (the opening tap is the user gesture), mute toggle
4. Subtle bottom CTA: *"Send your own Florabox"*

### Unique Link
- Format: `florabox.app/view/[uniqueId]` (route `/view/:id`)
- No account needed
- Data stored in Neon PostgreSQL

---

## Database Schema

Source of truth: `server/schema.sql` (idempotent — safe to re-run in the Neon SQL editor; also migrates the original cards table). Also has `users` and `bouquets` tables.

```sql
cards (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     INTEGER REFERENCES users(id),  -- optional, for My Creations
  type        TEXT NOT NULL DEFAULT 'preset', -- 'preset' | 'custom'
  preset_id   TEXT,        -- e.g. 'birthday-marbled-rose'
  to_name     TEXT,
  from_name   TEXT,
  message     TEXT,
  music_id    TEXT,
  card_data   JSONB,       -- custom card config
  theme       TEXT,        -- for send animation
  created_at  TIMESTAMPTZ DEFAULT now(),
  expires_at  TIMESTAMPTZ
)
```

---

## Component Architecture

```
client/src/
  components/
    TransitionCurtain.jsx     -- page transition overlay (with context/TransitionContext)
    card-gallery/
      CardGallery.jsx         -- drag track, selection, expanded card, nav, CTA
      GalleryHero.jsx         -- hero that scrolls away over the gallery
      PatternCanvas.jsx       -- interactive gold + grid behind the hero
    card-compose/             -- Path A
      PresetComposer.jsx      -- compose form + live preview + send
      ScaledCard.jsx          -- renders a 300x400 card scaled to fit its box
      MusicPicker.jsx         -- curated playlist
      SendSuccess.jsx         -- shareable link + copy
      tokens.js               -- dark-room colour tokens
    mascot/                   -- black cat: BranchCat, PerchedCat, CatMark, CatParts, catShapes
    card-viewer/              -- recipient
      EnvelopeReveal.jsx      -- envelope SVG animation
      RevealAnimation.jsx     -- themed canvas reveal (theme registry)
    card-builder/             -- Path B, to be added (toolbar, canvas, stickers, backgrounds...)
    cards/
      birthday/  MarbledRose.jsx  GoldenHour.jsx  MineralMoon.jsx
      love/      WisteriaCard.jsx
      friendship/ congratulations/ thank-you/ sympathy/ just-because/  -- to be added
  data/
    cards.js                  -- preset card registry
    music.js                  -- playlist
  lib/
    api.js                    -- createCard / getCard (VITE_API_URL base)
    wrapMessage.js            -- word-wrap + fit check shared with the cards
  pages/
    Home.jsx                  -- /
    CardGalleryPage.jsx       -- /gallery
    CardBuilder.jsx           -- /card/new (?preset= → PresetComposer; none → craftsman placeholder)
    CardView.jsx              -- /view/:id
    BouquetBuilder.jsx        -- /bouquet/new (placeholder)
    MyCreations.jsx           -- /u/:username (dummy data)
server/
  index.js  db.js  schema.sql
  routes/ cards.js  bouquets.js  users.js
```

---

## Next Build Tasks

1. **Craftsman builder** (Path B) at `/card/new` — plus the "or become a craftsman" CTA in the gallery
2. **Full-screen send animation** after Send, reusing the `RevealAnimation` theme registry
3. **More presets** — remaining occasions; add reveal themes as new card themes appear
4. **Music** — real audio files in `public/music/`, set `src` in `data/music.js`
5. **Bouquet builder** and **My Creations** on real data

---

## Important Technical Notes

- Always clean up `requestAnimationFrame`, listeners and running animations in `useEffect` cleanup
- Mineral Moon uses continuous RAF — must cancel on unmount: `return () => cancelAnimationFrame(raf)`
- Calculate gallery track bounds dynamically — never hardcode
- GSAP is installed but not used anywhere; don't assume it's wired up
- A card's `messageLayout` in `data/cards.js` must match the wrap width / line count inside the card component
- ESLint reports `'motion' is defined but never used` for Framer Motion's `<motion.x>` — a known false positive of the current config
- Server: `CLIENT_ORIGIN` sets the CORS origin; `DATABASE_URL` is the Neon connection string
- All card components self-contained — no global style leakage
- Cards render natively at 300×400px, scale via CSS `transform: scale()` for display
- Use `will-change: transform` on the card track for GPU compositing
- The `+` navigation icons must be custom SVG — absolutely no emoji
