# Placeholder images

Five products have no photography. Each carries a clearly-marked placeholder so
nothing renders broken. **Every placeholder already has the correct alt text from
the client content document baked into the page markup** — the alt text is
product-accurate, not the word "placeholder", so swapping the file is the only
step needed.

## How to swap them

Drop the real photograph in at the same path and filename, at **1000 × 1000 px,
1:1 aspect ratio, JPEG**. Nothing else needs editing: the alt text, captions,
schema `image` property and `width`/`height` attributes are already correct.

Then remove the "Photography pending — placeholder" caption from the product
page hero (`<div class="photo-card__cap">`) and delete that product's row below.

## Source and licence

**These are not stock photography.** They are rendered locally from the site's own
design tokens — the `#ECECE8` surface, the `#D6221C` accent square, Archivo and
Instrument Sans — using the same "wire is a precisely gauged line" motif the
homepage hero uses.

Openly-licensed stock could not be used: the build environment's network policy
blocks `images.unsplash.com` and `images.pexels.com` (HTTP 403 at the proxy on
CONNECT). Nothing here is scraped from a competitor's or a supplier's website.

- **Source:** generated in-repo, `scratchpad/placeholders.js` (headless Chromium)
- **Licence:** none required — original artwork, no third-party rights
- **Regenerate:** `node placeholders.js`

When the factory shoot lands, these are all deleted. The shot list in `README.md`
("macro of each grade on the reel, same lighting setup") covers the stitching
grades; the five below need coil photography on the same setup.

## The five placeholders

| Product | Page | File path | Alt text (already in the markup) |
|---|---|---|---|
| H.H.B. wire (half hard bright) | `half-hard-bright-wire.html` | `assets/img/placeholder-half-hard-bright-wire.jpg` | Prime Wires half hard bright (H.H.B.) mild steel wire coil |
| Annealed wire | `annealed-wire.html` | `assets/img/placeholder-annealed-wire.jpg` | Prime Wires soft annealed mild steel wire coil |
| Binding wire | `binding-wire.html` | `assets/img/placeholder-binding-wire.jpg` | Prime Wires soft annealed binding wire coils for rebar tying |
| G.I. wire | `galvanised-gi-wire.html` | `assets/img/placeholder-galvanised-gi-wire.jpg` | Prime Wires galvanised (G.I.) mild steel wire coil |
| Stainless steel stitching wire | `stainless-steel-stitching-wire.html` | `assets/img/placeholder-stainless-steel-stitching-wire.jpg` | Prime Wires stainless steel flat stitching wire, magnetic and non-magnetic grades |

Each appears twice — once on its product page hero, once as the block image on
its category page (`steel-wires.html` or `stitching-wires.html`).

## Existing photography, remapped

Three steel wire images already existed on the retired products page and have
been remapped to the correct new product. No new files, no re-shoot needed.

| New product | Reused file | Was |
|---|---|---|
| H.B. wire (hard bright) | `assets/img/product-ms-wire.jpg` | the "Mild steel wire" card, captioned "HB and HHB bright annealed" |
| Baling wire | `assets/img/product-baling-wire.jpg` | the "Baling wire" card — a direct one-to-one match |
| High carbon wire | `assets/img/product-spring-steel.jpg` | the "Spring steel wire" card, "high carbon, patented and drawn, for springs" |

The seven stitching wire images map one-to-one and were not moved:
`product-gi.jpg`, `product-rp.jpg`, `product-power.jpg`, `product-copper-coated.jpg`,
`product-brass.jpg`, `product-copper.jpg`, `product-book-spools.jpg`.

## Unassigned

- `assets/img/product-rope-wire.jpg` — rope wire is not in the approved product
  list. The file is retained and still used on the "Also drawn at Waliv" strip at
  `steel-wires.html#steel-other`, pending the client's keep/drop decision.
- `assets/img/product-narrow-flat.jpg` — unchanged, still the `cost-per-pin.html`
  hero image.

## A note on dimensions

The existing product photography is not a consistent set: eleven files are
300 × 249 px and two (`product-power.jpg`, `product-copper-coated.jpg`) are
1000 × 1000. The frame is square — `.photo-card__img` is `aspect-ratio:1/1` with
`object-fit:contain` — so mixed ratios letterbox rather than distort.

Placeholders were generated at **1000 × 1000** to match the two newest assets and
the frame. When the shoot lands, supplying every product at 1000 × 1000 would let
the eleven low-resolution files be replaced at the same time; at 300 × 249 they
are visibly soft on a high-density display.
