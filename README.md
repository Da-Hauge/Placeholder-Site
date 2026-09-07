# haug-it.eu

Static personal site behind `haug-it.eu`. Plain HTML and CSS on GitHub Pages —
no build step, no framework, no dependencies.

English is the default; German lives under `/de/`.

## Layout

```
index.html          Start page, English (primary)
de/index.html       Start page, German
impressum.html      Pflichtangaben § 5 DDG        — German, legal text still TODO
datenschutz.html    Art. 13 DSGVO                 — German, legal text still TODO
legal.html          redirect -> impressum.html        (old URL)
privacy.html        redirect -> datenschutz.html      (old URL)
404.html            error page for GitHub Pages
favicon.svg         icon, a single SVG
css/style.css       the whole stylesheet, design tokens at the top
js/lang.js          language routing, loaded synchronously in <head>
js/main.js          progressive enhancement, optional
docs/               processing records, processors, security notes
CNAME               haug-it.eu
```

The legal pages are German only, and deliberately so: they are the legally
binding versions for a German operator. Both carry a short English summary at
the top.

## Run it locally

Double-clicking `index.html` mostly works, but the language routing and the
absolute paths in `404.html` need a real server:

```bash
python -m http.server 8000
```

## How the language switch works

1. First visit to `/`: `js/lang.js` reads `navigator.language`. German browser →
   redirected once to `/de/`. Everything else stays on English.
2. Clicking **EN/DE** stores the choice in `localStorage` under `haugit.lang`
   and it wins over the browser setting from then on.
3. `/de/` never redirects based on the browser language — only on an explicit
   stored choice. That is what stops the two pages bouncing a visitor back and
   forth.

Without JavaScript the switch is still an ordinary link; it just does not
persist. `lang.js` sits in `<head>` without `defer` so a German visitor never
sees the English page flash first.

## Rules for this repository

The site is built so that it needs no consent banner. To keep it that way:

- **Load nothing from third parties.** No Google Fonts, no CDN, no embedded
  maps, videos or captchas. Fonts come from the system stack, icons are
  inline SVG.
- **Store nothing on the device except the language choice.** No cookies, no
  `sessionStorage`, no IndexedDB. That one `localStorage` key is written only
  on an explicit click and is covered by § 25 Abs. 2 Nr. 2 TDDDG. Anything
  beyond it needs a fresh assessment — and probably a banner.
- **No inline CSS and no inline JS.** The CSP on every page forbids
  `unsafe-inline`. A `style="…"` attribute or an `onclick` breaks the page.
- **No forms.** Contact runs through the address in the Impressum; the CSP sets
  `form-action 'none'`.
- **No dependencies.** If one becomes necessary: name, version, downloads, last
  release and licence first, decision second.
- **No personal data beyond what the law requires.** Name, postal address and
  phone number appear in `impressum.html` and `datenschutz.html` only, because
  § 5 DDG and Art. 13 DSGVO require them there. Do not repeat them on the start
  page, in the footer, in meta tags or in `docs/`. The contact address is the
  one exception: it is also linked as a `mailto:` on both start pages, on
  purpose, so that getting in touch does not take a detour.

If any of that changes, update `docs/verarbeitung.md`,
`docs/auftragsverarbeiter.md` and `datenschutz.html` in the same pull request.

## Open points

- Impressum and Datenschutzerklärung contain `TODO` blocks — the legal texts
  have not been reviewed by a lawyer.
- Third-country transfer through GitHub Pages (US) is unresolved, see
  `docs/auftragsverarbeiter.md`.
- HTTP security headers cannot be set on GitHub Pages, see
  `docs/security-hinweise.md`.

## Accessibility

Target is WCAG 2.1 AA: semantic HTML, skip link, one `h1` per page, visible
focus indicator, keyboard operability, `prefers-reduced-motion`. Foreign-language
fragments carry their own `lang` attribute. Nothing has been checked with an
automated tool yet — an axe or Lighthouse run is still outstanding.

## Security

To report a security problem, see [SECURITY.md](SECURITY.md).
