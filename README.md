# Jyoti Stitching Wires — new website

Static build. No framework, no build step required to deploy, no dependencies at runtime.
Upload the folder and it runs.

---

## ⚠️ Read this before go-live

### 1. The current live site has injected spam

The homepage on `jyotistitchingwires.com` contains the phrase *"state of rolex replica the art
equipment"* — an SEO link injection, almost certainly rendering as a hidden outbound link to a
replica-watch site. **This is not a design problem and replacing the site does not fix it.**

Do this first, independently of this project:

- Audit every page of the old site for injected links (`grep -ri "replica\|rolex\|viagra\|casino"` over the source).
- Change FTP/cPanel/hosting credentials.
- Check Google Search Console → Security & Manual Actions for a manual penalty.
- If the domain was flagged, submit a reconsideration request *after* cleaning.

Launching a beautiful site onto a compromised domain wastes the whole budget.

### 2. Data in this build that must be verified

Every figure below is an **indicative industry value**, not Jyoti's own data. They are realistic
and internally consistent, but they are placeholders. Replace them with real mill data before launch.

| What | Where | Status |
|---|---|---|
| Coating weights (8–12, 18–25, 30–40 g/m²) | `assets/js/site.js` → `GRADES`, and product tables | **Verify** |
| Tensile / elongation bands | same | **Verify** |
| Flat section dimensions | `assets/js/site.js` → `SIZES` | **From the works costing sheet.** 12×22 thickness is inferred from the naming convention — confirm |
| Index prices (₹/kg): G.I. ₹75, pure copper ₹650 | `assets/js/site.js` → `GRADES[].rate` | **From the works costing sheet.** Moves with metal market |
| Index prices (₹/kg): R.P. ₹82, Power G.I. ₹98, copper coated ₹94, brass ₹580 | `assets/js/site.js` → `GRADES[].rate` | **Verify** — not in the costing sheet. Rebased onto the two prices above, keeping the premium each already carried |
| Per-grade section availability | `assets/js/site.js` → `GRADES[].sections` | **Verify** — all grades currently list the full range |
| "Manufacturing since 2003" | every page, and Organization schema | **Verify founding year** |
| Machine gauge ranges & spool formats | `assets/js/site.js` → `MACHINES` | **Verify against your own supply history** |
| Phone `+91 99999 99999`, emails, PIN 401208 | footer, contact page, schema | **Replace** |
| "ISO 9001 — certification in progress" | homepage, about | **Only keep if true. Remove if not.** |

`GRADES` and `SIZES` in `site.js` are the single source of truth for both calculators and the
material ladder. Change a number once there and it propagates.

**Index prices are the opening figure, not a fixed one.** Metal prices move, so the cost per pin
page carries a *Your prices, ₹ per kg* table — every grade's rate is editable, drives the headline
figure, the comparison bars and the monthly spend, and is remembered in the visitor's browser
(`localStorage`, key `jsw.rates.v1`). Only the grades a visitor actually overwrites are stored, so
editing `GRADES[].rate` here still reaches everyone who never touched that grade. *Reset to
indicative* clears their overrides. Storage failures (private browsing) degrade to session-only.

### 3. Resolve the brand identity question

The site currently reads *Jyoti* as the product brand and *Prime Wires Pvt. Ltd.* as the
manufacturer, which is the cleanest resolution of the three-way conflict on the old site
(domain says Jyoti, H1 said Prime Wires, copy said "Jyoti Brand"). If the company wants to
lead with Prime Wires instead, that is a one-hour change but it must be decided before launch —
it affects the logo, the schema `name`/`legalName`, and every title tag.

---

## What's here

```
index.html                        Homepage
products.html                     All six grades + book + steel wire
galvanised-stitching-wire.html    Deep product page — the TEMPLATE for the other five
cost-per-pin.html                 Cost per pin + length/weight calculators
machine-compatibility.html        Machine finder + full reference table
gi-vs-brass-stitching-wire.html   Flagship comparison article
knowledge-centre.html             Article hub (2 live, 8 outlined)
about.html                        Plant, quality regime, export
contact.html                      RFQ form

assets/css/site.css               Design system — tokens, grid, components
assets/js/site.js                 All behaviour + the wire data model
assets/img/*.svg                  Interim artwork (see Photography below)

build.py / pages.py / pages2.py   Page generator. Header, footer and schema live in build.py
makeart.py                        Regenerates the interim SVG artwork
robots.txt sitemap.xml llms.txt   Crawl + AI discovery
.htaccess                         301 map from old URLs, compression, security headers
```

**To edit a page:** change the content in `pages.py` / `pages2.py`, run `python3 pages.py &&
python3 pages2.py`. To change the nav or footer everywhere, edit `build.py` once.
`index.html` is hand-authored (its hero is bespoke) — edit it directly.

---

## Design

The palette is taken from the products themselves: graphite (mild steel), zinc grey, brass,
copper, kraft. The accent colour is literally a grade the company sells.

- **Display type** — Archivo, set expanded (`font-stretch: 118%`). Expanded grotesque reads as
  engineering signage rather than magazine editorial.
- **Body** — Instrument Sans.
- **Data** — IBM Plex Mono. *Every number on the site is monospaced*, because this is a company
  that sells tolerances. Specs, gauges, prices, table cells, section labels.
- **The gauge rail** — the fixed vertical scale down the left edge with tick marks and a live
  section index. It is a measuring scale on a site about measurement, not decoration.
- **The hero** — a field of horizontal lines at varying stroke weights, drawn in on load. Wire is
  a precisely gauged line; this is the most literal possible portrait of the product, and it needs
  no photography.
- **The signature element** — the **material ladder** on the homepage. Six grades on two bars:
  corrosion life against relative cost per pin. It encodes the single decision this entire
  industry turns on, and it is the company's own honest sales argument made visual.

---

## The two tools

These are the competitive moat, and both were already latent in the old site.

**Cost per pin.** The old site had a `/cost-per-pin.html` page — it is the strongest asset on the
domain and the URL is preserved. It is now a real calculator, and it follows the works costing sheet line for line: cross-section
(t × w) × density × length consumed per stitch × price per kg. It returns weight per pin, pins per
kilogram, metres per kilogram, and cost per pin in both rupees and paise. No hidden wastage factor.
It also expresses wire cost as a share of carton value, which is the number that actually settles
the brass-versus-galvanised argument in a costing meeting.

**Machine compatibility finder.** Insun, Gods Will, MEPL, Bielomatik, ECH, Joy Dzign and manual
heads. This data is proprietary, verifiable, and nobody else in the sector publishes it in a
structured form. It is the single most likely thing on this site to earn links and AI citations.

Verify the machine data against your own supply history before launch. It is currently my best
reconstruction from the old site's machine list.

---

## SEO / AEO / GEO — what's implemented

- Clean semantic HTML, one `<h1>` per page, correct heading order.
- Full schema graph: `Organization` (one node, referenced by `@id` from every page),
  `WebSite`, `BreadcrumbList` on every inner page, `FAQPage` on home / product / article /
  machine pages, `TechArticle` on the comparison piece.
- FAQ answers are written to be **lifted whole** by an AI assistant — self-contained, specific,
  numeric, no "as mentioned above". This is the actual mechanic behind GEO.
- `llms.txt` at root: a plain-text summary of the product range and the key technical facts,
  which is what assistants read when they cannot parse the site.
- `robots.txt` explicitly allows GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot,
  Google-Extended and CCBot. Being cited is the entire point; do not block them.
- Old `meta keywords`, `revisit-after`, `distribution`, `classification` and the custom
  keyword-stuffed meta tags are all gone.
- `maximum-scale=1.0` is removed from the viewport — the old site blocked pinch-zoom, a WCAG failure.
- Canonicals are self-referential and correct; `/index.html` 301s to `/`.
- No dofollow links out to the agency in the footer.

**What is NOT implemented, and matters:** GEO is not purely on-site. When someone asks an AI
assistant "who is the best stitching wire manufacturer in India", the answer is assembled largely
from third-party sources — IndiaMART, trade directories, export data, listings. Entity consistency
across those (identical name, address, phone, category everywhere) is what gets you into the
consideration set. The on-site schema helps you get cited once you are in it. Budget for that
workstream separately.

---

## Photography

`assets/img/*.svg` is interim artwork: a wound reel rendered in each grade's actual metal colour,
and an abstract drawing-bench plate. They are vector, ~8 KB each, and designed to be **deleted**
the day the photographer delivers.

Commissioning the factory shoot is the highest-ROI line item in the whole brief and it gates the
design, so book it in week one. Shot list, in priority order:

1. Wire drawing bench, wide — the hero of the About page
2. Macro of each grade on the reel, same lighting setup, six frames — the product pages
3. Spooling / level winding in motion
4. Testing bench: micrometer on wire, UTM in use
5. Electroplating line
6. Plant exterior, drone, golden hour
7. Packed reels, palletised, ready for export
8. Hands: an operator setting a die, an inspector gauging a reel

Shoot 2 (macro, six grades) is the one that transforms the product pages. If budget is tight,
shoot only that plus the drawing bench.

---

## Deploy

Any static host. Netlify, Cloudflare Pages, Vercel, or the existing cPanel.

If staying on Apache/cPanel, `.htaccess` is ready and handles the 301 map, gzip, cache headers
and security headers. On Netlify/Cloudflare, translate the redirects to `_redirects`.

After launch, in order:
1. Verify the domain in Google Search Console, submit `sitemap.xml`.
2. Check every old URL 301s correctly (`curl -I`) — this is where redesigns lose rankings.
3. Re-run the security audit from section 1.
4. Set up GA4 and connect it to Search Console.
5. Wire the enquiry form to a real endpoint (see below).

---

## Still to wire up

- **The enquiry form does not submit anywhere.** It validates and shows a confirmation, nothing more.
  Point it at Formspree, Web3Forms, a Netlify form, or your own handler, and route the lead into
  whatever CRM the sales team actually opens.
- **WhatsApp link** uses a placeholder number.
- **Live chat** — not included. Add only if someone will genuinely answer it.
- **Downloads centre** — the brief asks for PDF datasheets and certificates. The product pages are
  structured to take a downloads block; the PDFs need producing.
- **Eight knowledge-centre articles** are outlined and titled but not written. They are the
  content workstream, and content is the real bottleneck on a project like this — not design.

---

## One honest note on the brief

The brief asks for "hundreds of educational pages". I would not build that. Stitching wire is a
narrow topic space; past roughly 50–60 pages you start producing near-duplicates that cannibalise
each other and read as bulk-generated, which is now actively penalised rather than rewarded.

Forty deep, specification-heavy, genuinely expert pages will outperform three hundred thin ones —
in Google and in LLM retrieval both. The ten titles in the knowledge centre are the first tranche.
Write those properly, measure, then extend.
