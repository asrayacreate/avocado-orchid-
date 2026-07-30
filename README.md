# EstimatePro ERP — Marketing Website

Static, dependency-free marketing site for **EstimatePro ERP** (https://estimateproerp.com).
Built with semantic HTML5, vanilla CSS, and vanilla JavaScript — no build step, no framework, no backend required.

## File structure

```
/
├── index.html              Main site (all sections)
├── admin.html               Content-management demo console (not publicly linked, noindex)
├── privacy.html             Privacy Policy
├── terms.html                Terms of Service
├── 404.html                  Custom 404 page
├── robots.txt
├── sitemap.xml
├── favicon.ico
├── assets/
│   ├── css/style.css         All styles (design tokens + components)
│   ├── js/main.js            Interactions: nav, mobile menu, FAQ, pricing toggle, i18n, currency, login modal, notice board, floating contact, etc.
│   ├── js/translations.js    EN + NE translation dictionary (data-i18n driven)
│   └── images/               favicon-256.png, og-cover.jpg
```

## Preview locally

No build tools needed. From this folder, run any static file server, for example:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080` in your browser.

(Opening `index.html` directly by double-clicking also works for a quick look, but a local server is recommended so relative paths and fonts behave exactly like production.)

## What's new in this round

- **Hero dashboard now has 4 tabs** — Estimation, Projects, Analytics, and **CRM** (a simple Lead → Quotation → Contract mini-board). All 4 auto-cycle every 4 seconds; the cycle logic reads tabs from the DOM dynamically, so it picked up the new CRM tab with no extra wiring.
- **Fixed: admin-synced pricing plan names reverting on language switch.** Admin-edited Pricing Plan names/descriptions (via `admin.html`) were being silently overwritten back to the English/Nepali dictionary defaults whenever the EN/ने toggle was clicked, because both systems wrote to the same DOM elements without coordinating. The language switcher now re-applies any admin-synced plan data immediately after translating, so admin edits persist through language changes. The BOQ rate table was not affected by this bug (it has no `data-i18n` text to conflict with).
- **Fixed: header could overflow/clip on medium desktop widths.** With the full nav, currency toggle, language toggle, Log In, Get App, and Start Free Demo all in one row, screens roughly 981–1180px wide didn't have enough room and could visually cut off the rightmost buttons (including Log In). The header now switches to its mobile/hamburger layout at 1180px instead of 980px, while every other section's responsive grid breakpoints are unchanged.

## Previously delivered (still in place)

- **One-click language toggle** — replaced the EN/ने `<select>` dropdowns (header, mobile menu, footer) with a single-click toggle button. Persists in `localStorage`.
- **Currency switcher (NPR / USD)** — header + mobile menu toggle. Defaults to NPR. Applies to the hero's live BOQ estimate mockup (`data-amount` attributes hold the USD base figure; `assets/js/main.js` converts using an indicative rate — see `USD_TO_NPR_RATE` near the top of the currency code, update it periodically). This does not touch the Pricing section's "Contact us for pricing" tag, since those plans intentionally show no invented numbers.
- **Auto-playing Download Center demo** — the phone mockup in `#download` now cycles through three CSS-animated frames (Add BOQ Items → Calculating → Quotation Ready) on a loop, fully decorative and `prefers-reduced-motion`-aware.
- **CRM section redesign** — the 12 feature cards use colored icon tiles instead of plain text, matching the visual language used elsewhere on the site (Why / Industries sections).
- **Floating contact widget** — bottom-left button (WhatsApp / Call / Request a Demo) that persists across scroll. WhatsApp and Call are hardcoded to **9801069733**, and the footer email is hardcoded to **asrayacreate.ac@gmail.com**.
- **Notice board** — dismissible, auto-scrolling announcement banner pinned above the header. Dismissal persists in `localStorage`. Edit the message in `translations.js` under the `notice.message` key (EN and NE).
- **Payments section simplified** — consolidated three previously separate blocks (global/local cards, a long feature-pill list, and the QR/bank block) into a single compact 4-card grid plus one summary line.
- **Login modal** — opens from "Log In" in the header/mobile menu. This site has no backend, so the form intentionally does not authenticate or redirect anywhere; it shows a clear "not yet active" message and offers "Request Demo Access Instead." Do not wire this to a fake success state — connect it to a real auth system before claiming login works.
- **Super Admin demo console (`admin.html`)** — a separate page demonstrating add/edit/delete content management for BOQ rate items and pricing plans. It is **not linked from the public site**, is blocked via `robots.txt` and a `noindex` meta tag, and uses a plaintext demo passcode (`demo123`) that is visible in the page source — this is not real security. Rate Library and Pricing Plan edits are stored in `localStorage` and **do** reflect on the live `index.html` hero dashboard and Pricing section, but only on the same browser/device, since there is no backend or server-side sync. The Notice Board tab in the console is preview-only and does not affect the live banner (that text lives in `translations.js`). Do not expose this admin pattern in production without real authentication and a real backend.

## Deploy to GitHub Pages

1. Create a new GitHub repository (or use an existing one).
2. Push the contents of this folder to the repository root (or to a `docs/` folder — adjust the Pages source setting to match).
3. In the repository: **Settings → Pages → Build and deployment → Source** → select **Deploy from a branch**, choose the branch (e.g. `main`) and folder (`/ (root)`).
4. Save. GitHub will publish at `https://<your-username>.github.io/<repo-name>/`.
5. Wait 1–2 minutes for the first deploy, then visit the URL to confirm.

No build step, no `package.json`, no GitHub Actions workflow is required — this is a plain static site.

## Connect the custom domain (estimateproerp.com)

1. In the repository: **Settings → Pages → Custom domain** → enter `estimateproerp.com` → Save.
   This creates a `CNAME` file in the repo automatically. (If you maintain `CNAME` manually instead, make sure it contains exactly `estimateproerp.com` with no protocol or trailing slash.)
2. At your DNS provider, add the records GitHub Pages currently documents for apex domains (typically a set of `A` records pointing to GitHub's IPs, plus a `CNAME` record for the `www` subdomain pointing to `<your-username>.github.io`). Check GitHub's own Pages documentation for the current IP list, since these can change.
3. Wait for DNS propagation (can take anywhere from minutes to ~24 hours).
4. Back in **Settings → Pages**, once GitHub detects the DNS is correct, enable **Enforce HTTPS**.

## Brand color note

The site uses a Navy + Emerald/Teal palette (with a warm orange construction accent), matching the original brand spec for a construction-tech SaaS product. If you were expecting a "Navy-Gold" theme, that was a wording choice in one of the build prompts, not a deliberate brand decision — gold tends to read as luxury/retail rather than construction/engineering trust, so it was intentionally not applied. If you do want a gold accent somewhere specific (e.g. a premium plan badge), say so and it can be added without disturbing the rest of the palette.

## Owner configuration still required

These are intentionally left as clearly-marked placeholders rather than invented values:

- **Contact form backend**: `assets/js/main.js` has a `FORM_CONFIG` object (search for `FORM SERVICE CONFIGURATION`). Set `provider` and `endpoint` (Web3Forms or Formspree are pre-wired) to enable real submissions. Until configured, the form validates correctly but shows an honest "not yet connected" message instead of a fake success state.
- **Footer contact details**: email, phone/WhatsApp number, and office location are placeholders in `index.html` and `translations.js` (search `footer.email.placeholder`, `footer.phone.placeholder`, `footer.location.placeholder`).
- **Payment instructions**: the Payments section has placeholder QR boxes for eSewa/Khalti and blank bank transfer fields (search `payments.local.` in `translations.js`). Replace with real QR images and account details when ready.
- **Android app**: the Download Center is built for an early-access flow (request → emailed link) rather than a live public APK. Once a real build exists, replace the request flow with a direct download link/button.
- **Pricing**: all plans intentionally say "Contact us for pricing" — no prices were invented. Add real figures if/when you want them public.
- **Social links**: hidden by default in the footer (no fake/placeholder social accounts). Unhide and link them once real accounts exist.
- **About Us / parent organization**: the About section (`#about`) has an `about.poweredby` line, and the footer has a matching `.footer-poweredby` line — both currently read "Powered by [Parent Company] — link to be configured by owner" (search `about.poweredby` and `footer.poweredby` in `translations.js`, EN and NE). If/when this site is linked to a parent company or sister platform, replace the placeholder text with the real name and wrap it in a link. The "Built on Our Own Workflow" card in the same section is also intentionally generic — replace its copy with verified internal-usage results once you have them to share.
- **Floating contact widget numbers**: the WhatsApp and Call links in the floating widget use placeholder numbers (search `wa.me/977` and `tel:+977` in `index.html`). Replace both with your real number before launch.
- **Currency conversion rate**: the NPR display is calculated from a fixed indicative rate (`USD_TO_NPR_RATE` near the top of the currency-switcher code in `assets/js/main.js`), not a live feed. Update it periodically so displayed NPR amounts stay realistic.
- **Admin demo console passcode**: `admin.html` uses a plaintext demo passcode (`demo123`, visible in the page source) purely to gate a UI demo. This is not real security — if you keep this page at all, treat it as internal-only and do not rely on it to protect anything sensitive. Replace with real authentication before this page handles real data.
- **CNAME**: only added if/when you confirm the domain connection in GitHub Pages settings, per the deployment steps above.

## Notes on this build

- Fully static — no backend, no database, no authentication actually runs in this repo. Sections describing CRM, accounting, multi-tenant workspaces, etc. describe the *product*, not features running on this marketing site itself.
- Language switching (English / Nepali) is handled client-side via `data-i18n` attributes and persists in `localStorage`.
- All animations respect `prefers-reduced-motion`.
- Lighthouse-style targets: semantic HTML, deferred JS, lazy-loadable images, visible focus states, and ARIA labeling throughout — verify with your own Lighthouse run after deployment, since exact scores depend on hosting/CDN behavior outside this repo's control.
