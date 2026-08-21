# Go-live — hosting this site on the GoDaddy domain

Written for someone who has never deployed a website. Roughly 45 minutes of work, plus up to
24 hours of waiting for the internet to catch up. Hosting costs nothing.

The domain is `primewires.in`. All 24 pages, `sitemap.xml`, `robots.txt`, `llms.txt` and the
schema blocks were switched from `.com` to `.in` on 20 Aug 2026, so nothing in the code needs
changing before starting.

---

## The idea that makes the rest make sense

A domain and a website are two separate purchases from two separate companies.

| | Who | What it is |
|---|---|---|
| **The address** | GoDaddy — already owned | A name. Holds no files, shows no pages. A signpost that can point anywhere. |
| **The building** | Netlify — set up in Part 1 | A computer that stores the 24 pages and hands them to visitors. Where the site actually lives. |
| **The wiring** | DNS — Part 3 | The global address book saying "this name leads to that building." The only fiddly bit. |

### Why Netlify rather than GoDaddy's own hosting

This repo already contains `netlify.toml` and `_redirects`. The second keeps every old inbound
link to `products.html` alive by 301-ing it to `stitching-wires.html`. GoDaddy's basic hosting and
GitHub Pages cannot do redirects or custom headers; Netlify reads both files automatically, free.
The site is already built for Netlify.

---

## ⚠️ Four things to settle before launching

Not technical blockers — the steps below work regardless. Each costs money or credibility if
ignored.

### 1. ~~The enquiry form throws enquiries away~~ — fixed 20 Aug 2026

Wired to Netlify Forms. `contact.html` carries the `data-netlify` markup Netlify parses at deploy
time, and `site.js` posts over `fetch` so the sender stays on the page. Verified in a real browser
on all four paths: correct payload, honest failure on a 500 or a dropped connection, and no
submission when required fields are blank.

**One thing still to do in the dashboard:** Netlify does not email you when an enquiry arrives
unless told to. `Forms` → `Settings` → `Form notifications` → add `info@primewires.in`. Without
it the leads sit in a dashboard nobody opens.

### 2. Some published figures are placeholders, not mill data

`README.md` flags these as unverified: coating weights, tensile/elongation bands, flat section
dimensions, index prices in ₹/kg, machine gauge ranges, and "manufacturing since 2003." They are
realistic industry values but not *ours*. On a spec page a buyer reads them as a commitment.

### 3. Does `info@primewires.in` exist?

The site ran two addresses, `sales@` and `export@`, first on the `.com` and then on the `.in`.
On 21 Aug 2026 both were replaced by a single `info@primewires.in` everywhere — 24 page footers,
the contact panel and the enquiry form's failure message.

**This is now the only address on the site**, so the mailbox has to exist before launch or every
buyer who emails gets a bounce. Also relevant to Step 9: email is the one thing that can be
destroyed by careless DNS work.

### 4. The logo in the structured data points at a file that does not exist

`index.html:37` declares the Organization logo as
`https://www.primewires.in/images/primewires-logo.png`. There is no `images/` directory and no
logo file anywhere in the repo — the only images are in `assets/img/`, and none is a logo.

Google reads this block for the knowledge panel and can show that logo beside search results.
Supply a square PNG, drop it in `assets/img/`, and the path gets corrected to match.

---

## Part 1 · Put the site onto a host

Ends with the site genuinely live at a temporary address. Nothing here can break anything.

### 1. Create a Netlify account **using GitHub**

[app.netlify.com/signup](https://app.netlify.com/signup) → **Sign up with GitHub**. Not email —
signing in through GitHub is what lets Netlify see the repo. Free plan, no card.

### 2. Import the repository

`Add new site` → `Import an existing project` → `GitHub` → `abhijk1011/Main-Website-`

If the repo isn't listed, click **Configure the Netlify app on GitHub** and grant access to it.

### 3. Accept the build settings as they appear

`netlify.toml` means these are pre-filled. Confirm they read:

| Setting | Correct value | Meaning |
|---|---|---|
| Branch to deploy | `main` | The finished version |
| Build command | *(empty)* | Plain HTML — nothing to build |
| Publish directory | `.` | A single full stop: "the whole folder" |

If a build command was filled in, delete it. Then **Deploy**.

### 4. Wait ~30 seconds, then open the live site

Netlify gives a temporary address like `jade-marzipan-4f21c8.netlify.app`. **The site is now on
the internet** — it just has an ugly name.

Test it now, while fixes are free: several product pages, the cost-per-pin calculator, the machine
finder, the WhatsApp and `tel:` links, and the whole thing on a phone.

### 5. Rename the site

`Site configuration` → `Site details` → `Change site name` → `prime-wires`

Giving `prime-wires.netlify.app`. Not cosmetic: this exact string gets typed into GoDaddy at
Step 11, and copying two random words correctly is where people slip. **Write it down.**

> From here on, any change pushed to `main` updates the live site within a minute. No FTP, no
> manual uploads.

---

## Part 2 · Tell Netlify which domain to answer to

Netlify's side only. Changes nothing about the domain yet.

### 6. Add the domain

`Site configuration` → `Domain management` → `Add a domain` → `www.primewires.in`

Netlify sees the domain is registered elsewhere and offers the bare version too — accept, so both
`www.primewires.in` and `primewires.in` are listed.

It will then show *"awaiting external DNS"* or a warning triangle. Correct and expected — it is
waiting for Part 3.

### 7. Set `www` as the primary domain

Options menu on `www.primewires.in` → **Set as primary domain**.

Every page's `<link rel="canonical">` and `og:url`, plus `sitemap.xml` and `robots.txt`, already
declare the `www` form. Making it primary has Netlify auto-redirect the bare domain to it, so
Google sees one site rather than two competing copies.

---

## Part 3 · Point GoDaddy at Netlify

The only part where a mistake has consequences. Two records change; nothing else is touched.

### ⚠️ 0. First check there is no status hold on the domain

**Hit on 20 Aug 2026, cleared 21 Aug.** Kept here because the symptom reads like a permissions
problem and invites fiddling with records that are not the cause.

GoDaddy showed *"This domain has been placed on a status hold"* on `primewires.in`, with every
Edit and Delete control greyed out. A hold is applied above the DNS panel, at the registrar or
the registry, so no record can be changed and the domain does not resolve at all. Nothing in
Part 3 is possible until it is lifted.

For a newly registered `.in` domain it is almost always one of two pieces of unfinished paperwork:

| Cause | Who wants it | How it is cleared |
|---|---|---|
| Registrant email not confirmed | ICANN, via GoDaddy | Click the link in the verification email. 15-day window from registration; miss it and suspension is mandatory for the registrar |
| KYC documents not supplied | NIXI, the `.in` registry | NIXI asks the registrar for identity and address proof on new `.in` registrations. Send to `support@nixi.in`, then allow a few days for validation |

To clear it:

1. Search all mail folders, including spam and promotions, for anything from GoDaddy or NIXI.
   Subject lines run to *"Verify your email address"* or *"Immediate action required"*.
2. Check `Registration Settings` on the domain — contact verification status is shown there.
3. Call GoDaddy on the number in the banner (040-67607600 for India). Fastest route, and they can
   say which of the two holds it is rather than guessing.
4. Have ID and address proof ready in case it is the NIXI KYC.

Parts 1 and 2 do not involve the domain and can be finished while this is outstanding.

### 8. What the records do

| Record | Controls | Action |
|---|---|---|
| `A` | Where `primewires.in` sends web visitors | **Change** |
| `CNAME` | Where `www.primewires.in` sends web visitors | **Change** |
| `MX` | Where email is delivered | **Leave alone** |
| `TXT` | Domain ownership proofs, anti-spam | **Leave alone** |
| `NS` | Which company holds the whole list | **Leave alone** |

### 9. ⚠️ Do NOT change the nameservers

Netlify — and most tutorials — will suggest switching the domain's **nameservers** to Netlify's.
That hands the *entire* address book to Netlify, MX records included. If `info@primewires.in` is
a working mailbox, mail stops arriving, usually with no obvious error, possibly unnoticed for days.

Keep GoDaddy in charge of the list and change only the two web records. The result for visitors is
identical.

### 10. Open the DNS records

`godaddy.com` → sign in → `My Products` → `Domains` → the domain → `DNS` → `DNS Records`

`primewires.in` carries 14 records. Only two of them are ours. Observed 20 Aug 2026:

| Type | Name | Data | What it is |
|---|---|---|---|
| `A` | `@` | *WebsiteBuilder Site* | **Change** — GoDaddy's own page, occupying the address the site needs |
| `CNAME` | `www` | `primewires.in.` | **Change** — currently just points back at the line above |
| `NS` | `@` | `ns05` / `ns06.domaincontrol.com` | Leave. GoDaddy holds the record list; keeping it that way is the point |
| `CNAME` | `email` | `email.secureserver.net` | Leave — email |
| `CNAME` | `secureserver1._domainkey` | `s1.dkim…onsecureserver.net` | Leave — DKIM, signs outgoing mail |
| `CNAME` | `secureserver2._domainkey` | `s2.dkim…onsecureserver.net` | Leave — DKIM |
| `CNAME` | `_domainconnect` | `_domainconnect.gd.domaincontrol.com` | Leave — GoDaddy setup helper |
| `SOA` | `@` | `ns05.domaincontrol.com` | Leave — cannot be edited anyway |

Page 2 carries the other four, all of them email:

| Type | Name | Data | What it is |
|---|---|---|---|
| `MX` | `@` | `mailstore1.secureserver.net.` (priority 10) | Backup mail route |
| `TXT` | `@` | `v=spf1 include:secureserver.net -all` | SPF — names who may send as this domain |
| `TXT` | `_dmarc` | `v=DMARC1; p=quarantine; …` | DMARC — what to do with mail that fails the check |
| `SRV` | `_autodiscover._tcp.@` | `0 0 443 autodiscover.secureserver.net.` | Lets Outlook configure itself |

**Leave every one of them alone.** Together with the first `MX` and the two DKIM records on page 1,
that is a complete and correctly configured GoDaddy mail setup — MX, SPF, DKIM, DMARC, autodiscover.
It settles the Step 9 question conclusively: delegating the nameservers to Netlify would have taken
all of it down.

One consequence worth knowing. SPF ends in `-all` (hard fail) and DMARC is `p=quarantine`, so mail
sent *as* `info@primewires.in` from anywhere other than GoDaddy's servers will be quarantined.
That does not affect Netlify form notifications, which are sent from Netlify's own domain — but it
does mean any future newsletter or CRM tool needs adding to the SPF record before it can send.

`@` is DNS shorthand for the domain with nothing in front of it.

The `A` record reading *WebsiteBuilder Site* rather than a number means a GoDaddy Website Builder
product is attached to the domain. Replacing the record is enough; but if the old value reappears
by itself later, that product is putting it back, and it needs removing under `Website`.

### 11. Set exactly these values

**Edit the existing rows** rather than adding new ones — two records of the same type and name
fight each other.

| Type | Name / Host | Value / Points to | TTL |
|---|---|---|---|
| `A` | `@` | `75.2.60.5` | 600 seconds |
| `CNAME` | `www` | `prime-wires.netlify.app` | 600 seconds |

`75.2.60.5` is Netlify's public load balancer, identical for every customer — not a secret, not
unique to us. The CNAME value must be **our own** site name from Step 5, with no `https://` and no
trailing slash.

Save, then scroll down and confirm **Forwarding is off** — GoDaddy sometimes leaves a forward in
place that silently overrides all of the above.

*If GoDaddy refuses a CNAME on the bare domain: correct behaviour. DNS forbids it, which is
exactly why the bare domain uses an `A` record instead.*

---

## Part 4 · Wait, then switch on the padlock

### 12. Give it time, and check it properly

Usually 10 minutes to an hour; occasionally up to 48. The local machine caches the old answer, so
a browser is the *least* reliable check.

Use [whatsmydns.net](https://www.whatsmydns.net/): enter `www.primewires.in`, select **CNAME**,
watch locations worldwide turn green. Netlify's warning triangle becomes a tick on its own.

### 13. Provision the certificate and force HTTPS

`Domain management` → `HTTPS` → `Verify DNS configuration` → `Provision certificate`

Free, issued in a minute or two, renews itself forever. This is the padlock; without it browsers
show "Not secure" and Google ranks the site lower.

Then enable **Force HTTPS** so `http://` visitors are sent to the secure version automatically.

Open `https://www.primewires.in`. Done.

---

## The first hour after launch

1. **Check the bare domain forwards.** `primewires.in` with no www should land on
   `https://www.primewires.in`. If not, the `A` record hasn't propagated — wait longer before
   changing anything.
2. **Register with Google.** [Search Console](https://search.google.com/search-console) → add
   `www.primewires.in` → verify by TXT record (safe, affects nothing else) → submit
   `sitemap.xml`. Days instead of weeks to get indexed.
3. **Deal with the old site.** `README.md` records injected replica-watch spam on
   `jyotistitchingwires.com`. If that domain is still live and still ours, it is damaging search
   reputation right now, independently of this site. Clean or take it down, rotate the hosting
   credentials, check Search Console for a manual penalty.
4. **Watch someone use it on a phone.** Cheapest testing available.

---

## Troubleshooting

Nearly every problem here is one of five, and four are solved by waiting.

| Symptom | Cause | Fix |
|---|---|---|
| GoDaddy parking page | Old placeholder cached, or re-added alongside the new one | Confirm only **one** `A` record named `@`, then wait an hour |
| "Not secure" / no padlock | Certificate not issued yet | Redo Step 13 — only works once DNS has propagated |
| `DNS_PROBE_FINISHED_NXDOMAIN` | No answer in the address book yet | Normal in the first hour. Check whatsmydns.net, not the browser |
| `www` works, bare domain doesn't | `A` record wrong or missing | Re-check it reads exactly `75.2.60.5` with host `@` |
| Site loads but **email stopped** | Nameservers switched, or an MX record deleted | Act immediately — restore GoDaddy nameservers and the provider's MX records. See Step 9 |
| Edit and Delete greyed out on every row | Status hold on the domain | Not a DNS problem and not fixable in this panel. See Part 3 step 0 |
| The `@` record reverts to *WebsiteBuilder Site* | A GoDaddy Website Builder product is still attached | Remove it under `Website`, then set the `A` record again |
