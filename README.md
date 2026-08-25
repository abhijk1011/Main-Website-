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
| Flat section dimensions per gauge | `assets/js/site.js` → `SIZES` | **Verify** |
| Index prices (₹/kg) per grade | `assets/js/site.js` → `GRADES[].rate` | **Verify — moves with metal market** |
| "Manufacturing since 2003" | every page, and Organization schema | **Verify founding year** |
| Machine gauge ranges & spool formats | `assets/js/site.js` → `MACHINES` | **Verify against your own supply history** |
| Phone `+91 90040 37154` | footer, contact page, `tel:` and WhatsApp links | **Done** — real number, 19 Aug 2026 |
| PIN 401208 | footer, contact page, schema | **Done** — confirmed correct, 19 Aug 2026 |
| Email `info@primewires.in` | footer, contact page | **Verify the mailbox exists** |
| "ISO 9001:2015 certified" | homepage, about | **Done** — revision confirmed 21 Aug 2026. See note below. |

`GRADES` and `SIZES` in `site.js` are the single source of truth for both calculators and the
material ladder. Change a number once there and it propagates.

**On the ISO wording.** Settled 21 Aug 2026. The badge reads "ISO 9001:2015 certified" on both
pages, homepage and about.

The original brief said "ISO 9001 Certified in 2015", which reads two ways: the year the company
was first certified, or the 2015 revision of the standard. The badge deliberately carried the
plain form, which is true either way, until the client confirmed. They have: it is the standard's
revision, so the colon form is correct.

Keep it accurate if the certificate is reissued against a newer revision. A certification claim is
checkable, and a competitor can complain to the registrar.

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
assets/img/icons.svg              Icon sprite
assets/img/product-*.jpg          Product photography (see Photography below)
assets/img/plant-*.jpg            Plant imagery at 16:9, 21:9 and 4:3

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
domain and the URL is preserved. It is now a real calculator. The arithmetic is: cross-section
(t × w) × density × length consumed per stitch × price per kg. No hidden wastage factor.
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

**Status and the full manifest live in `IMAGE_PLACEHOLDERS.md`.** All seventeen products carry
real 1000 × 1000 studio photography — **no placeholders remain**. Plant imagery is three
purpose-shot images at 16:9, 21:9 and 4:3 rather than one file cropped three ways.

What is left is refinement, not gaps:

1. **H.H.B.** — delivered, but reads dark blue-black beside the bright H.B. frame it sits next to,
   and against its own "Finish — Bright" spec row. Worth a brighter regeneration.
2. **Real photographs of the Waliv plant** — the three plant images are generated, so their alt
   text deliberately does not claim to show this facility. Real ones would let it.
3. Spooling / level winding in motion
4. Electroplating line
5. Plant exterior, drone, golden hour
6. Packed reels, palletised, ready for export
7. Hands: an operator setting a die, an inspector gauging a reel

Deliver products at **1000 × 1000, 1:1**. PNG is fine — conversion to progressive JPEG happens
in-repo and cut the two deliveries from ~40 MB to ~3 MB served.

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

- ~~The enquiry form does not submit anywhere.~~ **Done, 20 Aug 2026 — Netlify Forms.** The form
  carries `data-netlify`, a `form-name` of `rfq` and a `bot-field` honeypot; `site.js` posts it
  over `fetch` so the sender stays on the page. Submissions land in the Netlify dashboard under
  Forms. **Add a notification email there** (Forms → Settings → Form notifications), or the
  enquiries sit in a dashboard nobody opens.
- **WhatsApp link** points at +91 90040 37154, confirmed as a WhatsApp number.
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
