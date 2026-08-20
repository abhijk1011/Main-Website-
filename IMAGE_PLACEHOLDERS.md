# Product photography

**There are no placeholders left.** Every product page and category block on the
site carries real 1000 × 1000 photography. This file keeps its original name so
existing links to it still work, but it is now a manifest rather than a to-do
list.

Every image has product-accurate alt text baked into the markup, so swapping a
file is the only step needed to replace one.

## Product photography — 17 images, all 1000 × 1000

Delivered August 2026 on a consistent studio setup. Filenames match page slugs.

| Product | Page | File |
|---|---|---|
| Annealed wire | `annealed-wire.html` | `product-annealed-wire.jpg` |
| Baling wire | `baling-wire.html` | `product-baling-wire.jpg` |
| Binding wire | `binding-wire.html` | `product-binding-wire.jpg` |
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

### Outstanding: H.H.B. reads too dark

`product-half-hard-bright-wire.jpg` came back a dark blue-black coil. On
`steel-wires.html` it sits directly below the bright silver H.B. frame, and its
own spec table one column to the right reads **Finish — Bright**. Process
annealing does put a temper colour on wire, so it is not indefensible, but the
page currently contradicts itself in a way a trade buyer will notice. This is the
one frame worth regenerating, toward a brighter satin silver.

### Watch the copper / binding wire confusion

Across two deliveries the pure copper frame arrived three times labelled as
binding wire — once as a byte-identical duplicate named `product-binding-wire.png`.
The products look nothing alike (copper flat wire on paper-cored spools versus
thin black annealed steel ring coils), so check any future binding wire frame
before wiring it in. A quick tell: average the image down and look at the R−B
spread. The copper shot is strongly warm; annealed steel is near-neutral.

## Plant photography — 3 images, three native ratios

Previously one file was stretched across all three placements under
`object-fit: cover`, so two of them were heavily cropped.

| Placement | Ratio | File |
|---|---|---|
| `index.html` — "Seven operations" block | 16:9 | `plant-drawing-floor.jpg` |
| `about.html` — "The plant" band | 21:9 | `plant-floor-wide.jpg` |
| `knowledge-centre.html` — article hub | 4:3 | `plant-quality-lab.jpg` |

**These do not depict the Waliv plant.** They were generated, not photographed on
site, so the alt text describes wire manufacturing generally rather than claiming
to show this company's facility — "Wire manufacturing floor — drawing machines and
palletised wire coils", not "Prime Wires manufacturing floor, Waliv". If real
photographs of Waliv replace them, put the location back in the alt text. Until
then the wording must not assert provenance it does not have.

## How to replace an image

Drop the new photograph in at **1000 × 1000, 1:1, JPEG** for products, or the
ratio above for plant images. Keep the existing filename to make it a pure
swap; if you rename, update all three references.

Source frames arrive as PNG (1024 × 1024 or larger) and are converted in-repo:

```python
from PIL import Image
Image.open(src).convert("RGB").resize((1000, 1000), Image.LANCZOS) \
     .save(dst, "JPEG", quality=86, optimize=True, progressive=True)
```

That step matters — the deliveries totalled roughly 40 MB of PNG against about
3 MB of served JPEG. Do not commit the PNG originals.

Each product is referenced in three places: the JSON-LD `image` property, the
product page hero `<img>`, and the category block on `steel-wires.html` or
`stitching-wires.html`. `index.html` additionally uses
`product-galvanised-stitching-wire.jpg` for `og:image`.

## A note on the frame

`.photo-card__img` is `aspect-ratio:1/1` with `object-fit:contain`, so a
non-square product image letterboxes rather than distorts — but it will not fill
the card. The plant images use `object-fit:cover`, so a wrong-ratio file is
centre-cropped with no control over what is lost.

## On stock photography

None of these are stock, and none should be. This is a commercial site competing
against firms whose product photography looks much the same; a scraped competitor
or supplier photograph carries real legal exposure and is trivially reverse-image
searchable.
