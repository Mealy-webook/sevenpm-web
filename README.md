# SEVENPM — Web

Next.js 16 (App Router) + React 19 + Tailwind v4 + TypeScript + GSAP.

Implemented from Figma file **SevenPM — Web** (`QoFwc4yLlCGUhMVma1ABhb`).

## Run

```bash
npm install
npm run dev
```

## What's here

| Route | Figma node | Status |
| --- | --- | --- |
| `/events/[slug]` | `2091:56421` — Event details page (1512 × 7337) | Built |
| `/` | — | Placeholder list of events, waiting on the homepage design |

## Structure

```
src/
  app/
    layout.tsx              fonts (Roboto / Figtree / Inter) + metadata
    globals.css             design tokens, shell, fixed-geometry stages, motion
    page.tsx                placeholder home
    events/[slug]/page.tsx  the event details page — composes the sections
  components/
    layout/                 SiteHeader, SiteFooter (site-wide, reuse these)
    event/                  one file per section of the event page
    motion/MotionProvider   page-wide scroll motion, driven by data attributes
    ui/                     DisplayHeading, StickerPeel
  data/
    events.ts               all copy + imagery for the page, typed
public/assets/              exported Figma artwork
```

**Adding an event:** append an `EventDetails` object to `events` in
`src/data/events.ts`. No component changes needed. When the CMS lands, replace
`getEvent()` with a fetch — the components only depend on the exported types.

**Adding a page:** create the route under `src/app/`, wrap it in `SiteHeader` /
`SiteFooter`, mount `<MotionProvider />`, and use `.shell` for the 1512/120px
gutter grid.

## Conventions

- **Layout shell.** `.shell` reproduces the Figma frame: max 1512px wide with
  gutters from `--shell-gutter` (120px at `xl`, 48px, 20px). That leaves the
  1272px content column the designs are drawn against. `.shell-pad` is the
  padding half, for full-bleed sections that still need a gutter on their text.
- **Tokens.** Colours and type live in the `@theme` block at the top of
  `globals.css`, named after the Figma variables (`bg-primary`, `ink-600`,
  `text-secondary`, `brand`, …). Use those, not raw hex.
- **Display type.** Every oversized heading is set in **Daltown**, a licensed
  face, so it ships as artwork through `<DisplayHeading>` with the real text as
  the accessible name. License Daltown for web and each one becomes live text
  in a single edit.
- **Fixed-geometry stages.** The hero deck, the artist circle row and the
  gallery polaroid fan are positioned at exact Figma pixel coordinates and
  scaled as a unit (`--hero-stage-scale`, `--artists-scale`, `--gallery-scale`)
  rather than reflowed. The deck stage is 1512 wide at every breakpoint and
  clips at the viewport edges on the way down, so the centre record stays
  centred and the neighbours peek in from the sides. The gallery fan is fitted
  to the content column and centred — its scale is
  `tan(atan2(<column width>, 1294.42px))`, the one way CSS will divide two
  lengths into a unitless number. Scale factors are plain numbers
  stepped through media queries — a viewport ratio such as `calc(100vw / 900)`
  resolves to a *length*, which silently invalidates both `scale()` and any
  `calc(<px> * var(…))` height that uses it.
- **Horizontal bleed.** Several blocks (the ticket ribbons, the artist row)
  extend past the 1512 frame on purpose. `html, body { overflow-x: clip }`
  keeps that from creating a horizontal scrollbar.

## Motion

`<MotionProvider />` wires GSAP + ScrollTrigger to data attributes, so sections
stay declarative:

| Attribute | Effect |
| --- | --- |
| `data-reveal="up" \| "clip" \| "scale"` | fade + rise / mask wipe / settle in on scroll |
| `data-reveal-stagger` | stagger the element's children instead of the element |
| `data-reveal-delay="0.2"` | extra delay in seconds |
| `data-parallax="-0.12"` | drift on scroll; negative moves against it |
| `data-magnetic="0.25"` | nudge toward the cursor on hover |

Two rules keep this safe: nothing is hidden in CSS (the "from" state is set in
JS before paint, so a script failure or `prefers-reduced-motion` just leaves the
page visible), and a rescue pass re-shows anything still hidden but on screen
after 2.5s. Everything respects `prefers-reduced-motion`.

Hover states live in CSS (`.lift`, `.sweep`, `.link-sweep`, `.artist-circle`,
`.gallery-card`) so they compose with, rather than fight, the GSAP-owned
transform one level up.

Other pieces:

- **Hero spectrum** (`HeroSpectrum`) is a canvas equaliser fed by a Web Audio
  analyser tapped off the hero's `<audio>` element. Note the v3 comp shows the
  old pulse-trace vectors behind the deck again; the bars were kept on Ahmed's
  later direction. Bars are mirrored about the
  record's axis, windowed so the row fades at both ends, and each one attacks
  instantly, releases slowly and carries a peak cap that falls behind it. With
  nothing playing it rests as a low drifting row at 16% white. Only paints while
  the hero is on screen.

- **Ticket ribbons** run on a GSAP loop whose `timeScale` is pushed by scroll
  velocity — flick the page and they speed up and reverse.
- **Stickers** use `StickerPeel` (ported from [React Bits](https://reactbits.dev)
  to TypeScript): hover peels the corner back, and they're draggable within
  their section. Two changes from the published source, both needed to run
  several on one page — per-instance SVG filter ids, and class names namespaced
  under `.sticker-peel`.

## The hero deck

The records *are* the playlist (`VinylCarousel`, from Figma node 2091:56611):
the active disc sits under the tonearm at 612px with its neighbours receding
either side at 245 and 191. Click a side disc to bring it in, click the centre
one to pause and resume; a finished track advances by itself.

Switching runs a physical sequence on a GSAP timeline:

1. the tonearm lifts (+3% scale, −14px) while the platter spins down;
2. every disc slides one slot over — the CSS transition on `.vinyl-slot`
   carries the travel, ~1.05s;
3. the arm drops onto the new record;
4. the platter spins up as the audio starts.

The discs live on a ring of eight (each of the four tracks twice) so there is
always a hidden position either side; a disc wrapping round the back skips the
transition rather than streaking across the view. Spin is a GSAP tween whose
`timeScale` is eased, so the record decelerates and accelerates instead of
snapping. Each disc's label is the track's cover art from Apple (600px), and a
blurred copy of the active cover sits behind the deck as a colour wash.

### Where the audio comes from

Each track's `audioSrc` is the free 30-second preview from **Apple's iTunes
Search API** (`https://itunes.apple.com/search?term=…&entity=song`). Nothing is
bundled — these are commercial recordings. The previews are served with
`access-control-allow-origin: *`, so `<audio crossOrigin="anonymous">` loads
them cleanly and the Web Audio analyser behind `HeroSpectrum` can read real
frequency data off them.

Two things to settle before this goes live:

- **Attribution.** Apple's terms for the Search API expect a link back to the
  store alongside previews and artwork. Each track carries a `storeUrl` and
  `artworkUrl` in `src/data/events.ts` ready for that; the current comp renders
  neither.
- **Longevity.** Preview URLs are stable in practice but not contractual — they
  can rotate when a release is re-ingested. For production, either re-resolve
  them at build time from the Search API, or replace `audioSrc` with licensed
  full tracks on your own CDN. Everything downstream already works either way.

### A correction worth passing to design

The comp's fourth track reads **"The Smile of Rotta — Parcels"**. No such track
exists. It is **"The Smile of Rita" by Ibrahim Maalouf**, the Lebanese-French
trumpeter who plays this circuit. The third is credited to "THE E.N.D", which is
the Black Eyed Peas *album*, not the act. Both are corrected in
`src/data/events.ts` with a comment — revert the two fields if design disagrees.

## Gallery

The polaroids are a pile you can play with (`GalleryStage`): hover brings one
forward for the duration of the hover; picking one up puts it on top of the
pile for good; drag it anywhere inside the stage with a little tilt while it
moves and a throw on release (GSAP Draggable + InertiaPlugin, like the
stickers). Two details worth knowing:

- Stacking is set in JS on the outer slot. Both the reveal and Draggable leave
  a transform on it, which makes it a stacking context, so a `z-index` on
  anything inside never escapes — a CSS `:hover { z-index }` on the card did
  nothing.
- Bounds are explicit numbers in the stage's own coordinates. Passing the stage
  element to Draggable uses its *layout* box, which is wider than what's on
  screen once `--gallery-scale` shrinks it; local numbers scale with the stage,
  so the clamp matches the visible edge at every width.

## Ticket stubs

The tier cards are landscape **ticket stubs** (`TicketStub`, from Figma
2179:33880): ticket paper with perforated ends and scooped corners, a white
inner body, and centred content — a "★ ★ GENERAL ADMISSION ★ ★" line, the tier
name as Daltown artwork, "From ⃀ price" and a yellow "Get your ticket" button.
Paper is grey (`#d4d4d8`); a tier with `featured: true` gets brand-yellow paper
(the weekend pass in the comp). The comp draws each stub as a portrait column
rotated 90°; the component lays the same exported vectors out directly in
screen orientation (393 × 250.46), so only the strip and body vectors rotate.

Neighbouring stubs overlap by 6px so the corner notches of two stubs merge into
one hole, as in the comp. Three fit edge to edge at 1512, wrap below the column
width, and scale down as a unit once the viewport is narrower than one stub
(`--stub-scale`, same `tan(atan2())` trick as the gallery). A draggable guitar
sticker (`StickerPeel`) sits over the heading at ≥ xl.

Tier data is `{ kicker, title, titleArt, priceFrom, cta, featured? }`. The comp
reads "From 50" on all three tiers; the earlier revision priced them 50 / 300 /
1,000, which is what ships until content confirms.

## Performance notes

Measured in-browser at the hero with a track playing: **23 fps → 120 fps**
after this pass. What mattered, in order:

- **One shadow pass, not 136.** `HeroSpectrum` used to fill each bar with its
  own `shadowBlur`; every bar now goes into a single path filled once. Idle it
  also paints every 4th frame (the drift is slow) and caps the canvas at 1.5×.
- **Blur over fewer pixels.** The cover-art glow is a box a third of the disc
  size with `blur(30px)`, scaled ×3 in CSS — the same look at a ninth of the
  cost — and only the current and outgoing covers are mounted (a blurred layer
  costs paint even at opacity 0).
- **No permanent `will-change`.** The disc slots and glow relied on the
  transition to promote layers instead of holding eight 612px layers forever.
- **`box-shadow`, not `filter: drop-shadow`, on the ribbons.** A filter over a
  3917px element whose child moves every frame re-rasterises the whole thing.
- **Assets 17 MB → 7 MB.** The gallery photos, map and avatar were multi-MB
  PNGs with no real transparency; they're JPEGs now. Anything with an alpha
  channel that matters (record, stickers, artist circles, Daltown headings)
  stayed PNG. Two unused font weights were dropped.

## Open items

- **Day two of the artist lineup** isn't in the Figma. The tab is wired and
  populated with a resequenced day one — replace `artistDays[1]`.
- **FAQ copy** is the placeholder text from the comp (the same headline five
  times, one answer). Replace in `data/events.ts`.
- **Audio licensing** — see "Where the audio comes from" above.
- **Smooth scroll** (Lenis or similar) is the one obvious motion piece not
  included — it interacts with ScrollTrigger and the scaled stages in ways worth
  testing deliberately rather than assuming.
