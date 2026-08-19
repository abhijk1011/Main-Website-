# Product photography status

**One product still needs a photograph: binding wire.** Everything else on the
site now carries real 1000 × 1000 photography, and the last of the 300 × 249
legacy files are gone.

Every image already has the correct alt text baked into the markup, so swapping a
file is the only step needed.

## 1. Still needed

| Product | Page | File to replace | Alt text (already in the markup) |
|---|---|---|---|
| Binding wire | `binding-wire.html` | `placeholder-binding-wire.jpg` | Prime Wires soft annealed binding wire coils for rebar tying |

It appears twice — the product page hero, and the block image on `steel-wires.html`.
The hero still carries the "Photography pending — placeholder" caption; replace it
with `<div class="photo-card__cap">Binding wire</div>` when the real frame lands,
which is what every photographed page does.

The August 2026 delivery included a file named `product-binding-wire.png`, but it
was a byte-identical duplicate of the pure copper frame — the copper image saved
twice under two names. It was not used. Binding wire needs a genuine frame: two
compact ring coils of thin black annealed wire, roughly 1.2–1.6 mm, one on edge
and one flat, on the same plain studio background as the rest of the set.

## 2. Product photography — complete (1000 × 1000)

Sixteen products, shot on a consistent studio setup, delivered August 2026.
Filenames match their page slug.

| Product | Page | File |
|---|---|---|
| Annealed wire | `annealed-wire.html` | `product-annealed-wire.jpg` |
| Baling wire | `baling-wire.html` | `product-baling-wire.jpg` |
| Book / narrow flat spools | `stitching-wires.html`, `machine-compatibility.html` | `product-book-spools.jpg` |
| Copper coated stitching wire | `copper-coated-stitching-wire.html` | `product-copper-coated-stitching-wire.jpg` |
| G.I. stitching wire | `galvanised-stitching-wire.html` | `product-galvanised-stitching-wire.jpg` |
| G.I. wire | `galvanised-gi-wire.html` | `product-galvanised-gi-wire.jpg` |
| H.B. wire (hard bright) | `hard-bright-wire.html` | `product-hard-bright-wire.jpg` |
| H.H.B. wire (half hard bright) | `half-hard-bright-wire.html` | `product-half-hard-bright-wire.jpg` |
| High carbon wire | `high-carbon-wire.html` | `product-high-carbon-wire.jpg` |
| Narrow flat wire | `cost-per-pin.html` | `product-narrow-flat.jpg` |
| Power G.I. stitching wire | `power-gi-stitching-wire.html` | `product-power-gi-stitching-wire.jpg` |
| Pure brass stitching wire | `pure-brass-stitching-wire.html` | `product-pure-brass-stitching-wire.jpg` |
| Pure copper stitching wire | `pure-copper-stitching-wire.html` | `product-pure-copper-stitching-wire.jpg` |
| Rope wire | `steel-wires.html#steel-other` | `product-rope-wire.jpg` |
| Rust resistant stitching wire | `rust-resistant-stitching-wire.html` | `product-rust-resistant-stitching-wire.jpg` |
| Stainless steel stitching wire | `stainless-steel-stitching-wire.html` | `product-stainless-steel-stitching-wire.jpg` |

### Known issue: H.H.B. reads too dark

`product-half-hard-bright-wire.jpg` came back as a dark blue-black coil, close in
tone to the annealed frame and unlike the bright silver H.B. frame it sits beside
on `steel-wires.html`. Process annealing does put a temper colour on the wire, so
it is not indefensible, but a trade buyer scanning the steel wire page will see
"half hard **bright**" over a dark coil. Worth regenerating toward a brighter
satin silver finish when there is time.

## 3. Plant photography

Three images at three native ratios. Previously one file was stretched across all
three placements at `object-fit: cover`, so two of them were heavily cropped.

| Placement | Ratio | File |
|---|---|---|
| `index.html` — "Seven operations" block | 16:9 | `plant-drawing-floor.jpg` |
| `about.html` — "The plant" band | 21:9 | `plant-floor-wide.jpg` |
| `knowledge-centre.html` — article hub | 4:3 | `plant-quality-lab.jpg` |

**These images do not depict the Waliv plant.** They were generated, not
photographed on site, so the alt text describes wire manufacturing generally
rather than claiming to show this company's facility — "Wire manufacturing floor
— drawing machines and palletised wire coils", not "Prime Wires manufacturing
floor, Waliv". If real photographs of Waliv replace them, put the location back
in the alt text; until then the wording must not assert provenance it does not
have.

## How to swap any of them

Drop the real photograph in at **1000 × 1000, 1:1, JPEG** for products, or the
ratio named above for plant images. Name it `product-<page-slug>.jpg`, update the
references, and delete the old file.

Source frames arrive as PNG (1024 × 1024 or larger) and are converted in-repo:

```python
from PIL import Image
Image.open(src).convert("RGB").resize((1000, 1000), Image.LANCZOS) \
     .save(dst, "JPEG", quality=86, optimize=True, progressive=True)
```

That step matters — the two deliveries totalled ~40 MB of PNG and ~3 MB of served
JPEG. Do not commit the PNG originals.

Each product is referenced in three places: the JSON-LD `image` property, the
product page hero `<img>`, and the category block on `steel-wires.html` or
`stitching-wires.html`. `index.html` additionally uses
`product-galvanised-stitching-wire.jpg` for `og:image`.

## Placeholder source and licence

The single remaining placeholder is **not stock photography**. It is rendered
locally from the site's own design tokens — the `#ECECE8` surface, the `#D6221C`
accent square, Archivo and Instrument Sans.

- **Source:** generated in-repo, `scratchpad/placeholders.js` (headless Chromium)
- **Licence:** none required — original artwork, no third-party rights

Openly-licensed stock was not used and should not be: this is a commercial site,
and a scraped competitor or supplier photograph carries real legal exposure.

## A note on the frame

`.photo-card__img` is `aspect-ratio:1/1` with `object-fit:contain`, so a
non-square product image letterboxes rather than distorts — but it will not fill
the card. The plant images use `object-fit:cover`, so a wrong-ratio file is
centre-cropped with no control over what is lost.
