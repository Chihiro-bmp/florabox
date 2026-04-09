# Florabox — Claude Code Project Brief
*Paste this entire document as your first message to Claude Code*

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
| Fonts | Cormorant Garamond (headings) + Jost (body) |
| Animation | GSAP + ScrollTrigger (card gallery) + Framer Motion (UI) |

---

## Design System

### Colours
```
--ink-brown:      #1e1008   (primary text, borders, gallery background)
--ink-brown-deep: #2a1410   (gallery gradient end)
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
- ✅ Home page — fully designed, mobile responsive. Parchment + ink blossom SVG background, Ghost of Tsushima petal canvas animation, Cormorant Garamond title, three action cards with SVG icons

---

## Card Gallery — Horizontal Scroll Track

### Visual Design
- **Background:** Deep ink gradient — `#1e1008` → `#2a1410`
- This creates a deliberate contrast moment: user scrolls from parchment home page into this dark archive room. The parchment cards glow against the dark background.
- **No occasion tabs** — the cards speak for themselves, presented as a pure gallery

### Desktop Behaviour (≥768px) — GSAP ScrollTrigger
```
- Section is PINNED while user scrolls vertically
- Horizontal track of cards TRANSLATES leftward, scrubbed 1:1 with scroll
- Cards slide past like a cinematic art gallery
- Reference aesthetic: camillemormal.com sliding image track
```

Implementation approach:
```js
gsap.to('.cards-track', {
  x: () => -(trackWidth - viewportWidth),
  ease: 'none',
  scrollTrigger: {
    trigger: '.gallery-section',
    pin: true,
    scrub: 1,
    start: 'top top',
    end: () => `+=${trackWidth - viewportWidth}`,
  }
});
```

### Card Name Reveal
- Each card has a distinct name (see card list below)
- As a card centres in the viewport, its name fades and slides in — Cormorant Garamond italic, large, cream coloured
- Name fades out as card leaves centre
- Name sits below the card with generous spacing
- Exactly like the name reveals on camillemormal.com

### Navigation
- Two `+` icon buttons (SVG fine linework — not emoji) at vertical centre, left and right edges of screen
- Left `+` → snaps to previous card
- Right `+` → snaps to next card
- Smooth GSAP snap animation between cards
- On hover: subtle opacity increase only

### Card Click → Preview Mode
When user clicks a card:
1. Selected card comes into focused view (subtle scale or border highlight)
2. **Bottom preview strip** slides up — small thumbnails of all other cards in a horizontal row
3. Clicking a thumbnail switches the main selection
4. A **"Use this card →"** CTA button appears above the preview strip
5. All animations driven by Framer Motion

### Mobile Behaviour (≤767px)
- Native horizontal touch scroll: `overflow-x: scroll`, `scroll-snap-type: x mandatory`
- Each card snaps to centre: `scroll-snap-align: center`
- Card name reveals on snap (IntersectionObserver)
- `+` buttons hidden — swipe gesture only
- Bottom preview strip works on tap
- CTA button visible after tap-to-select

---

## Preset Card List — Birthday (3 cards, HTML files ready)

HTML files located in `src/cards/birthday/`. Convert each to a React component.

### Birthday 1 — "Marbled Rose"
- **File:** `florabox_marbled_rose_v7.html`
- **Style:** Ebru marbled paper background + botanical rose illustration
- **Background:** Warm cream `#f2e4cc` with blush pink + crimson marbled pools, blue-grey veining, ink spatter dots
- **Illustration:** Ink line botanical rose rising bottom-right. Compound rose leaves (Rosa canina). Blush wash inside petals. Gradient green leaves with white midrib highlights and shadow ellipses. Gradient stems.
- **Details:** Rosa canina specimen label bottom-centre. To/From dashed lines top-left.
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

## Remaining Occasions (Architecture Only — Not Yet Designed)

Build the component architecture to support these now so they slot in cleanly later. Each gets 2 cards.

| Occasion | Cards |
|----------|-------|
| Love / Romance | 2 |
| Friendship | 2 |
| Congratulations | 2 |
| Thank You | 2 |
| Sympathy | 2 |
| Just Because | 2 |

Total: 15 preset cards when complete.

---

## Two User Paths After Gallery

### Path A — Preset Card
1. User selects preset from gallery
2. Card is **locked** — no design changes
3. User fills: optional To, optional From, personal message
4. Selects music track
5. Hits Send → send animation → shareable link

### Path B — Custom "Craftsman" Builder
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

### Send Animation (Full-Screen, Theme-Based)
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

### Recipient Flow
1. Envelope opens (SVG animation)
2. Same themed animation plays
3. Card fades in, music plays (user gesture)
4. Subtle bottom CTA: *"Send your own Florabox"*

### Unique Link
- Format: `florabox.app/card/[uniqueId]`
- No account needed
- Data stored in Neon PostgreSQL

---

## Database Schema

```sql
cards (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type        TEXT,        -- 'preset' | 'custom'
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

## Suggested Component Architecture

```
src/
  components/
    card-gallery/
      CardGallery.jsx         -- GSAP horizontal scroll track
      CardTrack.jsx           -- pinned scrolling container
      CardItem.jsx            -- individual card in track
      CardNameReveal.jsx      -- Cormorant name fades in/out on centre
      CardPreviewStrip.jsx    -- bottom thumbnails on click
      NavigationButtons.jsx   -- + left / + right SVG icons
    card-builder/
      CardBuilder.jsx         -- builder shell
      BuilderToolbar.jsx      -- floating bottom toolbar
      CardCanvas.jsx          -- live preview
      StickerPicker.jsx       -- sticker packs + drag source
      BackgroundPicker.jsx    -- background templates
      MessageInput.jsx        -- text area + font picker
      MusicPicker.jsx         -- curated playlist
    card-viewer/
      CardViewer.jsx          -- recipient view
      EnvelopeReveal.jsx      -- envelope SVG animation
      SendAnimation.jsx       -- themed send/reveal animation
    cards/
      birthday/
        MarbledRose.jsx
        GoldenHour.jsx
        MineralMoon.jsx
      love/                   -- to be added
      friendship/             -- to be added
      congratulations/        -- to be added
      thank-you/              -- to be added
      sympathy/               -- to be added
      just-because/           -- to be added
  pages/
    Home.jsx                  -- ✅ built
    CardGalleryPage.jsx       -- card selection
    BuilderPage.jsx           -- custom builder
    ViewCardPage.jsx          -- recipient link view
```

---

## Immediate Build Tasks

1. **Convert** Birthday HTML files to React components
   - `MarbledRose.jsx` — pure SVG, accepts `toName` `fromName` `message` props
   - `GoldenHour.jsx` — pure SVG, same props
   - `MineralMoon.jsx` — canvas animated, same props + RAF cleanup on unmount

2. **Build** `CardGallery.jsx`
   - GSAP ScrollTrigger pin + scrub horizontal track
   - Card name reveal on centre
   - `+` navigation snap buttons
   - Click → bottom preview strip + CTA
   - Mobile: touch scroll + snap

3. **Wire routing** — Home → CardGallery → Builder / Viewer

4. **Set up** card save/retrieve API + Neon schema

---

## Important Technical Notes

- Always clean up `requestAnimationFrame` and GSAP instances in `useEffect` cleanup
- Mineral Moon uses continuous RAF — must cancel on unmount: `return () => cancelAnimationFrame(raf)`
- Register GSAP plugin: `gsap.registerPlugin(ScrollTrigger)`
- Call `ScrollTrigger.refresh()` after layout changes
- Calculate gallery track width dynamically — never hardcode
- All card components self-contained — no global style leakage
- Cards render natively at 300×400px, scale via CSS `transform: scale()` for display
- Use `will-change: transform` on the card track for GPU compositing
- The `+` navigation icons must be custom SVG — absolutely no emoji
