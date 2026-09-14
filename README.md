# SEVENPM — Web

Next.js 16 (App Router) + React 19 + Tailwind v4 + TypeScript + GSAP.

Implemented from Figma file **SevenPM — Web** (`QoFwc4yLlCGUhMVma1ABhb`).

## Run

```bash
npm install
npm run dev
```

## What's here

| Route            | Figma node                                                                      | Status |
| ---------------- | ------------------------------------------------------------------------------- | ------ |
| `/`              | `15:202` — Homepage (1512 × 5838)                                               | Built  |
| `/events/[slug]` | `2091:56421` — Event details page (1512 × 7041)                                 | Built  |
| `/about`         | no comp — designed in the site's system, content from seven-pm.com              | Built  |
| Header menus     | `2091:45854` account, `2091:45844` language/currency, `15:790` full-screen menu | Built  |

## Structure

```
src/
  app/
    layout.tsx              fonts (Roboto / Figtree / Inter) + metadata
    globals.css             design tokens, shell, fixed-geometry stages, motion
    page.tsx                homepage — composes src/components/home
    about/page.tsx          about page — composes src/components/about
    events/[slug]/page.tsx  the event details page — composes the sections
  components/
    layout/                 SiteHeader (+ AccountMenu, LocaleMenu, SiteMenu), SiteFooter
    home/                   one file per homepage section
    about/                  AboutStats, AboutFestivals, AboutTeam
    event/                  one file per section of the event page (+ MiniPlayer)
    motion/MotionProvider   page-wide scroll motion, driven by data attributes
    ui/                     DisplayHeading, StickerPeel
  data/
    events.ts               all copy + imagery for the event page, typed
    home.ts                 homepage copy, festivals, news, gallery rows
    about.ts                about copy, stats, festivals, team (from seven-pm.com)
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
- **Display type.** Every oversized heading is live text in **Daltown**
  (`src/fonts/Daltown.woff2`, loaded with `next/font/local` as
  `--font-daltown`; `.display-text` sets Figma's 260/208, `.display-text--faq`
  152/118, both scaled by `--display-scale`). Daltown is a licensed face — the
  file is the team's own copy; check the licence covers web embedding before
  launch. Ticket titles use `.font-daltown` at 72/60.
- **`@theme static`.** Tailwind v4 only emits theme variables that a utility
  class uses. Tokens read from plain CSS or from
  `font-[family-name:var(--font-…)]` don't count, so the block is `static` —
  without it the three font tokens vanished and the whole site rendered in the
  system font.
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
  resolves to a _length_, which silently invalidates both `scale()` and any
  `calc(<px> * var(…))` height that uses it.
- **Horizontal bleed.** Several blocks (the ticket ribbons, the artist row)
  extend past the 1512 frame on purpose. `html, body { overflow-x: clip }`
  keeps that from creating a horizontal scrollbar.

## Motion

`<MotionProvider />` wires GSAP + ScrollTrigger to data attributes, so sections
stay declarative:

| Attribute                               | Effect                                                |
| --------------------------------------- | ----------------------------------------------------- |
| `data-reveal="up" \| "clip" \| "scale"` | fade + rise / mask wipe / settle in on scroll         |
| `data-reveal-stagger`                   | stagger the element's children instead of the element |
| `data-reveal-delay="0.2"`               | extra delay in seconds                                |
| `data-parallax="-0.12"`                 | drift on scroll; negative moves against it            |
| `data-magnetic="0.25"`                  | nudge toward the cursor on hover                      |

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

## Experience layer

`<Experience />` is mounted once in `app/layout.tsx` and carries everything
that is site-wide rather than per section:

- **Smooth scroll** — [Lenis](https://lenis.darkroom.engineering), driven
  from GSAP's ticker so ScrollTrigger and the scroll position agree. Anchor
  links glide. Anything that sets `body { overflow: hidden }` (the menu, the
  preloader) pauses it automatically through a MutationObserver, and
  `data-lenis-prevent` keeps native wheel on nested scrollers (the location
  tile row).
- **Custom cursor** — a dot and a trailing ring, fine pointers only. Links and
  buttons grow the ring; `data-cursor="Play"` (deck), `"Drag"` (polaroids),
  `"Peel"` (stickers), `"Hold"` (featured poster), `"Read"` / `"Open"` fill it
  yellow with the word. The native cursor stays on touch devices and whenever
  JS hasn't mounted.
- **Preloader** — first visit per tab: wordmark, a 000→100 counter in Daltown
  and a hairline, then the sheet lifts (~2.5s). Repeat visits skip it
  (`sessionStorage` key `sevenpm:seen`). `MotionProvider` holds its
  ScrollTriggers until the preloader's `sevenpm:ready` event so the hero
  plays after the reveal, not under it.
- **Route transitions** — internal link clicks are intercepted in the capture
  phase; a yellow then a black sheet wipe up, the route changes through
  `router.push`, and the sheets wipe away when the new pathname renders.
  Modifier-clicks, `target="_blank"` and same-page hashes pass through.
- **Type reveals** — GSAP SplitText (free since 3.13): every `.display-text`
  heading rises character by character; paragraphs marked
  `data-split="lines"` rise line by line through a mask.
- **Header** — sticky, frosts and shrinks the logo once scrolled, slides away
  on the way down and back on the way up (never while a menu is open).
- **Footer** — live Casablanca time and a magnetic "Back to top".
- **Film grain** — a 256px noise tile at 4.5% overlay, jittering in 8 steps.

Everything respects `prefers-reduced-motion`: Lenis, the cursor, the preloader
and the transitions all step aside, and the page is plain scrolling.

## The hero deck

The records _are_ the playlist (`VinylCarousel`, from Figma node 2091:56611):
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
the Black Eyed Peas _album_, not the act. Both are corrected in
`src/data/events.ts` with a comment — revert the two fields if design disagrees.

## Location and FAQ

The Location section has no visual heading in the current comp (an `sr-only`
h2 keeps the landmark for assistive tech); the venue name and the info-tile
titles are uppercase. Below `lg` the info tiles become one horizontal,
snap-scrolling row that bleeds to the viewport edges (`.tile-row`) instead of
wrapping into a grid.

The FAQ is a single-open accordion. The answer panel is a _sibling_ of the
question button (the earlier build nested it inside the button, which broke
the open state), animated with `grid-template-rows: 0fr → 1fr`. All five items
carry an answer; the copy is placeholder.

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
  element to Draggable uses its _layout_ box, which is wider than what's on
  screen once `--gallery-scale` shrinks it; local numbers scale with the stage,
  so the clamp matches the visible edge at every width.

## Ticket stubs

The tier cards are landscape **ticket stubs** (`TicketStub`, from Figma
2179:33880 and 2179:35522): ticket paper with perforated ends and scooped
corners, an inner body, and centred content — a "★ ★ GENERAL ADMISSION ★ ★"
line, the tier name in Daltown, "From **50 MAD** / Person", a struck
previous price with "20% off", and the "Get your ticket" button. Two papers:

- **Grey** — a photographic paper texture (`stub-paper.jpg` at 80% plus a 10%
  black wash), a textured light body PNG, and a translucent dark button.
- **Dark** (`featured: true`, the weekend pass) — a 20% white card with a
  noise-filtered dark body SVG, white text and the brand-yellow button.

The comp draws each stub as a portrait column rotated 90°; the component lays
the same exports out in screen orientation (403 × 250 grey, 393 × 250 dark —
the dark card is 12px shorter in the comp) so only the strip and body artwork
rotate. Neighbouring stubs overlap by 6px so the corner notches merge into one
hole; each stub passes its width to `.ticket-stub-box` through `--stub-w`, and
the row scales down as a unit below one stub's width (`--stub-scale`).

Tier data is `{ kicker, title, priceFrom, currency, wasPrice?,
discount?, cta, featured? }`. Prices follow the comp (50 / 100 / 500 MAD, was
70 / 120 / 700). Note the comp styles the discount row differently on the two
papers (10px struck price with a currency glyph on grey, 12px bold "120 MAD"
on dark) — reproduced as drawn; worth unifying with design.

## Header, menus and the floating player

`SiteHeader` is a client component. Its buttons are the design system's
**Secondary** style (5% white fill, 0.5px 10% white border):

- **Account** (`AccountMenu`, Figma 2091:45854) — name/email, "View profile",
  My bookings, Wallet with balance, Logout. Pass `user={null}` for the
  logged-out "Login / sign up" header the homepage comp shows; the mock
  session is on by default so the menu can be tried on every page.
- **Globe** (`LocaleMenu`, 2091:45844) — language and currency radio groups.
  UI state only for now; wire `onLanguage` / `onCurrency` to i18n when ready.
- **Menu** (`SiteMenu`, 2227:5808) — full-screen: yellow panel with the
  luminosity-blended photo and wordmark; Roboto Black 72 navigation in white
  (Festivals with the four festivals listed under it, News, Team, Careers)
  separated by 5% hairlines that draw in; social links and copyright below.
  Locks page scroll, closes on Escape, animates in with GSAP.

Popovers close on outside click and Escape; only one is open at a time.

On the event page, `MiniPlayer` slides in at the bottom once the deck scrolls
out of view: cover (spins while playing), title/artist, previous / play-pause
/ next. Prev/next run the deck's real arm-and-disc swap through a
`stepRequest` prop on `VinylCarousel`; the cover scrolls back to the deck. It
is rendered as a sibling of the hero section, not inside it — the section is a
stacking context and a `position: fixed` child would paint under later
sections.

## Homepage

`src/app/page.tsx`, from Figma 15:202. Sections in `src/components/home/`:

- **HomeHero** — "MORE MUSIC MORE LIFE" in Daltown inside the comp's 786px
  text box, intro, and the comp's four yellow equaliser bars animated. Moving
  the cursor across the hero leaves a trail of concert photos behind the copy
  (`components/ui/image-trail.tsx`, from 21st.dev on framer-motion; one
  addition, `hideCursor={false}`, keeps the native cursor and touch scrolling).
- **FestivalsStage** — the five poster exports in their fixed 1901.63 × 526
  composition, scaled with the viewport (`--home-stage-scale`) so it bleeds
  the same proportion past both edges. Side posters are grey (the comp's
  luminosity blend) and come back to colour on hover, which also swaps the
  name under the row. **Press & hold spacebar** (or press the centre poster)
  plays the featured festival's preview and stops on release. The posters are
  drawn in perspective _per slot_, so rotating them through the slots would
  need flat poster exports — hence a fixed composition, not a carousel.
- **NewsSection** — three paper cards with image tiles and "Load more"; the
  yellow scribble around "NEWS" is inlined SVG that draws itself on first view.
  The cards are a **stack** (`NewsStack`): each one is `position: sticky`
  pinned a little lower than the last, so they pile up under the heading as
  the page scrolls, and a scrubbed ScrollTrigger scales the card underneath
  back and dims it as the next slides over.
- **HomeGallery** — two rows of 404 × 269 tiles drifting in opposite
  directions on a GSAP loop, slowed on hover. The comp shows empty grey tiles;
  the event photos fill them here — swap `galleryRows` in `data/home.ts`.
- **Partners** reuse the event page's `SponsorsSection`; **NewsletterSection**
  is the yellow headline + pill button (the comp has no input field).

Festival names other than Jazzablanca are read off the poster artwork and
marked as placeholders in `data/home.ts`.

## About page

`/about` has no Figma comp. It is composed from the system the other pages
established — shell grid, Daltown display type, Roboto body, info tiles,
stickers, GSAP reveals — with content taken from the current site,
[seven-pm.com](https://www.seven-pm.com) (French, translated). Sections:

- **Hero** — eyebrow, "ABOUT US", the manifesto in bold caps, a crowd photo with
  parallax, and a peelable smiley sticker.
- **Numbers** — 2018 / 4 festivals / 20,000+ / 22 editions, counting up on
  first view (`AboutStats`). Figures are the ones the site states.
- **Who we are** + **Mission / Vision / Values** tiles.
- **Our festivals** (`AboutFestivals`) — an index of the four festivals; hovering
  a row swaps the poster on the right. Links go to each festival's own site and
  Instagram; Jazzablanca also links to its event page.
- **The team** (`AboutTeam`) — the twelve people on seven-pm.com with their
  portraits (downsized to 480px in `public/assets/team/`), roles translated,
  company e-mail addresses only (two personal Gmail addresses on the current
  site were left out).
- **They trust us** reuses `SponsorsSection`; **Join the team** links to the
  careers page on seven-pm.com, the playlist button to the Jazzablanca Spotify
  playlist; address and contact e-mail as published.

The menu's Team / Careers entries point here, and the three festivals without
their own page land on the festival index.

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
- **FAQ and news copy** are placeholders (`data/events.ts`, `data/home.ts`).
- **Careers** has no page of its own yet; the menu entry lands on the
  "Join the team" block of the About page.
- **Audio licensing** — see "Where the audio comes from" above.
- **Smooth scroll** is in (Lenis). Worth a deliberate pass on a trackpad and a
  mouse wheel for the horizontal tile row and the poster stage.
