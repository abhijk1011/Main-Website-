# Product photography status

Every product page and category block resolves to a real file — nothing renders
broken. Three products still carry a clearly-marked placeholder; six more carry
real photography that is too low-resolution for a high-density display.

**Every image already has the correct alt text baked into the markup**, taken from
the client content document. It is product-accurate, not the word "placeholder",
so swapping a file is the only step needed.

## 1. Real photography, current (1000 × 1000)

Eight products shot on a consistent studio setup and delivered August 2026.
Filenames match their page slug.

| Product | Page | File |
|---|---|---|
| Baling wire | `baling-wire.html` | `product-baling-wire.jpg` |
| Copper coated stitching wire | `copper-coated-stitching-wire.html` | `product-copper-coated-stitching-wire.jpg` |
| G.I. stitching wire | `galvanised-stitching-wire.html` | `product-galvanised-stitching-wire.jpg` |
| G.I. wire | `galvanised-gi-wire.html` | `product-galvanised-gi-wire.jpg` |
| Power G.I. stitching wire | `power-gi-stitching-wire.html` | `product-power-gi-stitching-wire.jpg` |
| Pure brass stitching wire | `pure-brass-stitching-wire.html` | `product-pure-brass-stitching-wire.jpg` |
| Rust resistant stitching wire | `rust-resistant-stitching-wire.html` | `product-rust-resistant-stitching-wire.jpg` |
| Stainless steel stitching wire | `stainless-steel-stitching-wire.html` | `product-stainless-steel-stitching-wire.jpg` |

Delivered as 1254 × 1254 PNG (~2–3 MB each) and converted in-repo to 1000 × 1000
progressive JPEG at quality 86 — 18 MB of source became 1.25 MB served. Keep that
conversion step for future deliveries; the PNG originals are not committed.

## 2. Still needed — no photograph exists

These three carry a generated placeholder and a "Photography pending" caption on
the product page hero. **This is the shot list.**

| Product | Page | File to replace | Alt text (already in the markup) |
|---|---|---|---|
| H.H.B. wire (half hard bright) | `half-hard-bright-wire.html` | `placeholder-half-hard-bright-wire.jpg` | Prime Wires half hard bright (H.H.B.) mild steel wire coil |
| Annealed wire | `annealed-wire.html` | `placeholder-annealed-wire.jpg` | Prime Wires soft annealed mild steel wire coil |
| Binding wire | `binding-wire.html` | `placeholder-binding-wire.jpg` | Prime Wires soft annealed binding wire coils for rebar tying |

Each appears twice — product page hero, and the block image on `steel-wires.html`.

## 3. Real photography, but low-resolution (300 × 249)

Legacy files. They are not broken and not placeholders, but they are visibly soft
on a high-density display and do not fill the square frame. Re-shoot when
convenient.

| Product | Page | File |
|---|---|---|
| Pure copper stitching wire | `pure-copper-stitching-wire.html` | `product-copper.jpg` |
| H.B. wire (hard bright) | `hard-bright-wire.html` | `product-ms-wire.jpg` |
| High carbon wire | `high-carbon-wire.html` | `product-spring-steel.jpg` |
| Book / narrow flat spools | `stitching-wires.html`, `machine-compatibility.html` | `product-book-spools.jpg` |
| Narrow flat wire | `cost-per-pin.html` | `product-narrow-flat.jpg` |
| Rope wire | `steel-wires.html#steel-other` | `product-rope-wire.jpg` |

## How to swap any of them

Drop the real photograph in at **1000 × 1000 px, 1:1, JPEG**. For a file in
section 2 or 3, name it `product-<page-slug>.jpg`, update the references, and
delete the old file. For section 2, also replace the placeholder caption with the
product name — that is the convention every photographed page follows:

```html
<div class="photo-card__cap">H.H.B. wire (half hard bright)</div>
```

Each product is referenced in three places: the JSON-LD `image` property, the
product page hero `<img>`, and the category page block on `steel-wires.html` or
`stitching-wires.html`. `index.html` additionally uses
`product-galvanised-stitching-wire.jpg` for `og:image` and two homepage blocks.

## Placeholder source and licence

**The three remaining placeholders are not stock photography.** They are rendered
locally from the site's own design tokens — the `#ECECE8` surface, the `#D6221C`
accent square, Archivo and Instrument Sans — using the same "wire is a precisely
gauged line" motif the homepage hero uses.

- **Source:** generated in-repo, `scratchpad/placeholders.js` (headless Chromium)
- **Licence:** none required — original artwork, no third-party rights
- **Regenerate:** `node placeholders.js`

Openly-licensed stock was not used and should not be: this is a commercial site,
and a scraped competitor or supplier photograph carries real legal exposure. The
generated placeholders hold the space safely until the real frames land.

## A note on the frame

`.photo-card__img` is `aspect-ratio:1/1` with `object-fit:contain`, so mixed
ratios letterbox rather than distort — the 300 × 249 files are safe, just soft.
Supplying everything at 1000 × 1000 makes the set consistent.
