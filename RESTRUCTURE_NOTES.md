# Product range restructure — implementation notes

The product range was rebuilt as two categories, **Steel Wires** (7 products) and
**Stitching Wires** (7 grades plus a book and narrow flat format section), from
`Prime_Wires_Website_Product_Content_v1.0.docx`.

Sections 1, 4.2–4.7 and 5 of that document are internal — client corrections,
compliance checklists, HS codes, sign-off — and appear nowhere in the output.
Neither does the `Status` column from any specification table.

**Every specification figure on the site is transcribed verbatim.** Nothing was
rounded, interpolated, widened or improved. Where the document had no value, the
site has no value.

---

## 1. Specification rows the document could not fill

The document marks 68 rows `Confirm` (a proposed industry value, present and
publishable pending the client's check) and 16 rows `Required` (no value held).
The `Confirm` rows are published as written. The rows below could not be.

### 1a. Published as an em-dash, with a visible note under the table

Twelve rows have no value in the document. Each is rendered `—`, and the table
carries a line naming which rows are pending. Nothing is silently dropped and
nothing is invented.

| Product | Property | Page |
|---|---|---|
| H.B. wire | Coil weight | `hard-bright-wire.html` |
| H.H.B. wire | Coil weight | `half-hard-bright-wire.html` |
| Annealed wire | Coil weight | `annealed-wire.html` |
| Baling wire | Coil weight | `baling-wire.html` |
| High carbon wire | Coil weight | `high-carbon-wire.html` |
| G.I. wire | Coil weight | `galvanised-gi-wire.html` |
| Stainless steel stitching wire | Tensile strength | `stainless-steel-stitching-wire.html` |
| Stainless steel stitching wire | Elongation | same |
| Stainless steel stitching wire | Relative cost / kg | same |
| Stainless steel stitching wire | Spools | same |
| Book & narrow flat | Stainless steel option | `stitching-wires.html#book` |

The all-grades comparison table on `stitching-wires.html` has the same treatment
for the stainless steel row: coating weight, tensile and relative cost are `—`.
The document printed the literal word **"Confirm"** in the tensile and relative
cost cells; publishing that would have put a review artifact on a live page.

### 1b. Withheld entirely — two compliance rows

These are the one category where a placeholder is actively dangerous. Section 4.2
of the document is explicit: *"Publish only what you can actually produce on the
day it is asked for… an absent claim costs you far less than one you cannot
support."* Both rows are omitted from the live tables and recorded here instead.

| Product | Property | Document value | Why withheld |
|---|---|---|---|
| Binding wire | BIS licence | *(blank)* — "Required, confirm whether you hold one" | Domestic tenders specify IS-marked material. An unconfirmed BIS claim is a contractual exposure. |
| Stainless steel stitching wire | Food-contact declaration | "EU 1935/2004 and/or US FDA 21 CFR" — "Required, confirm whether you can issue one" | A European buyer ordering against a published declaration you cannot produce has a grievance, not a disappointment. |

**To publish either:** add the row back to the `spec` list for that product in
`scratchpad/content.py` and regenerate, or hand-edit the two `<tr>` rows.

### 1c. Published with the alternatives intact

Four `Required` rows do carry a value, but it is a question rather than an answer
— the client has to say which variant they supply. The value is published exactly
as written and the table note reads *"Where a row lists alternatives, confirm the
exact variant on enquiry."*

| Product | Property | Value as published |
|---|---|---|
| Annealed wire | Finish | Black annealed / bright annealed |
| G.I. wire | Coating process | Hot dip / electro-galvanised |
| Binding wire | Packing | Coils and bundles, 15 – 50 kg |
| Stainless steel stitching wire | Grades offered | Ferritic (magnetic, 430 type) and austenitic (non-magnetic, 304 or 302 type) |

Document section 1.1 item 6 states the G.I. wire page cannot go live until hot
dip versus electro is resolved. **That page is live but the question is open.**

---

## 2. `stainless-steel-stitching-wire.html` is `noindex`

The page renders, is linked from the category page and the homepage, and carries
its full copy — but four of its specification rows are empty, so it ships with:

```html
<meta name="robots" content="noindex,follow">
```

and is deliberately absent from `sitemap.xml`. It is reachable and readable; it
just should not rank or be quoted until it is complete.

**To publish:** fill the four rows, delete the `noindex` line, add the URL to
`sitemap.xml`, and remove `quoteOnly` from the `ss` grade in `assets/js/site.js`
after supplying a `density` and a `rate`.

---

## 3. What was removed

`products.html` — deleted. It carried the whole range as anchored sections and is
superseded by the two category pages. It 301s to `stitching-wires.html` via
`_redirects`, and every one of its eight anchor ids is reproduced on the new page
so existing inbound links land in the right place. Fragments are never sent to
the server and therefore cannot be redirected individually; reproducing the ids
is what keeps them live.

Nothing else was deleted. In particular:

**Rope wire, spring steel wire, hair pin wire and wire nails & springs** are not
in the approved product list, and document section 1.2 leaves them open
(*"Required from you: keep, drop, or fold into Category A?"*). Their existing
cards are carried over verbatim to `steel-wires.html#steel-other` under the
heading **"Also drawn at Waliv"**, visibly outside the two categories, with no
published specification. One commit removes the section if the client drops them.

---

## 4. Copy changes not sourced from the document

Three, all flagged rather than quiet:

1. **High carbon wire, opening paragraph.** The document reads *"a different steel
   from everything above it on this page"* — correct on the category page, which
   is where it is used verbatim. On the standalone product page there is nothing
   above it, so that page reads *"a different steel from everything else in the
   Steel Wires range."* Wording only; no technical change.
2. **Homepage.** The document supplies no homepage copy, but the page asserted
   "Six grades" three times. Corrected to seven, and the range index rebuilt to
   point at the two categories. This wording is not client-approved.
3. **Category page H1s.** *"Steel wire, drawn at Waliv"* and *"Seven grades of
   stitching wire"*. The document gives category intros but no category headline.

Also: `galvanised-stitching-wire.html` keeps its title tag unchanged (section 4.1
says *"Already live — no change proposed"*) but its H1 is now the document's
product heading, **G.I. stitching wire**, rather than "Galvanised stitching wire".

Published G.I. figures now carry the document's spacing — `8 – 12 g/m²` rather
than the old `8–12 g/m²`. The figures are identical; only the en-dash spacing
changed, because the document is the source of truth.

---

## 5. The two tools

`assets/js/site.js`. **The arithmetic and the density constants (7.85 / 8.50 /
8.90 g/cm³) are untouched.** Verified: every existing grade returns bit-identical
results for identical inputs.

- `Power stitching wire` → `Power G.I. stitching wire` throughout, per section 1.2.
- A seventh grade, `ss` (Stainless steel), was added to `GRADES` carrying only
  what the document actually states — base metal, coating, sections, corrosion
  life. Its `density`, `rate` and `relCost` are `null`, and it is flagged
  `quoteOnly:true`.
- A new `CALC_GRADES` list (the six costed grades, original order) drives the
  material ladder, the cost-per-pin selector, the comparison bars and the length
  and weight calculator — so no arithmetic path can ever see a null density.
- Stainless is enumerated where grades are listed: the machine finder output, the
  machine compatibility reference table and its FAQ, and a note under the
  cost-per-pin grade selector explaining that it is quoted on application.

Per-machine compatibility for stainless was **not** invented. The document does
not state which heads run it, so the finder says to confirm with us.

---

## 6. One CSS addition

`.tbl--wrap` in `assets/css/site.css` — two declarations, no new tokens:

```css
.tbl--wrap th,.tbl--wrap td{white-space:normal}
.tbl--wrap td:first-child,.tbl--wrap th:first-child{width:38%}
```

The base `.tbl` sets `white-space:nowrap`, which is right for `8 – 12 g/m²` and
wrong for `Light 40 – 120 g/m²; medium 75 – 150 g/m²; heavy 150 – 275 g/m², by
diameter`. Applied only to tables with a value over 42 characters. Same
typography, same colours, same borders.

---

## 7. Still open

Carried from document section 1.3 and the outstanding-items list. None of these
were guessed at.

- **Domain** — settled 20 Aug 2026. The registered domain is `primewires.in`, and every
  canonical, `og:url`, schema URL, sitemap entry and `robots.txt` line now reads
  `https://www.primewires.in/<page>.html`. Neither candidate in the original document
  (`primewires.com`, `jyotistitchingwires.com`) was the one purchased. See `GO-LIVE.md`.
- **Telephone `+91 90040 37154`** — real number, applied across all 24 pages on 19 Aug 2026.
- **Email** — settled 21 Aug 2026. `sales@` and `export@` moved to the `.in` domain on
  20 Aug, then collapsed into a single `info@primewires.in` on 21 Aug: 24 page footers, the
  contact panel and the enquiry form's failure message. The contact panel's separate Sales
  and Export rows became one Email row, since the same address under two labels reads as a
  mistake. Whether the mailbox has actually been created is still unverified — and it is now
  the only address on the site, so a bounce costs every emailed enquiry rather than some.
- **ISO 9001** — settled 21 Aug 2026. The badge reads "ISO 9001:2015 certified"; the 2015 in the
  original brief was the revision of the standard, not the year of first certification.
- Contact person, Managing Director, workforce, year established,
  full address, and the About Us scope claim — all untouched.
- Coil and reel weights across every Steel Wires product.
- All stainless steel stitching wire specifications.
- Whether rope, spring, hair pin wire and wire nails are kept.

`README.md` is stale by a generation — it documents `build.py`, `pages.py`,
`makeart.py` and `.htaccess`, none of which exist in the repo, and names the brand
*Jyoti Stitching Wires*. Out of scope here; worth a pass of its own.
