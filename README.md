# haug-it.eu

Static personal site behind `haug-it.eu`. Plain HTML and CSS on GitHub Pages —
no build step, no framework, no dependencies.

English is the default; German lives under `/de/`.

## Layout

```
index.html          Start page, English (primary)
de/index.html       Start page, German
impressum.html      Pflichtangaben § 5 DDG        — German, legal text still TODO
datenschutz.html    Art. 13 DSGVO                 — German, BINDING version, TODO
privacy-policy.html English translation of the above — informational only
legal.html          redirect -> impressum.html        (old URL)
privacy.html        redirect -> datenschutz.html      (old URL)
404.html            error page for GitHub Pages
favicon.svg         icon, a single SVG
css/brand.css       VENDORED brand tokens - see github.com/Da-Hauge/haug-it-brand
css/style.css       components; maps the brand tokens onto short local names
css/mcu.css         components for /mcu/ only
js/theme.js         theme resolution, loaded synchronously in <head>
js/lang.js          language routing, loaded synchronously in <head>
js/main.js          progressive enhancement, optional
js/mcu.js           MCU Tracker app logic (filtering, sorting, progress, export/import, optional TMDb sync)
js/mcu-data.js      MCU Tracker dataset — see mcu/methodology.html for sources
js/mcu-i18n.js      MCU Tracker EN/DE strings
mcu/                MCU Tracker subpage — track every MCU film/series, own watch progress, offline by default
docs/               processing records, processors, security notes
CNAME               haug-it.eu
```

## MCU Tracker (`/mcu/`)

A watch tracker for the Marvel Cinematic Universe: sort by release date or
in-universe timeline, filter by category or by corner of the universe, split
series into episodes, optionally include non-MCU Marvel films, and mark what
you've watched. Progress lives only in this browser
(`localStorage`, key `haugit.mcu.progress`) with export/import to a JSON file
as a manual backup — see `docs/verarbeitung.md` V5.

The dataset is a static file shipped with the site (`js/mcu-data.js`), not a
live API call — the tracker works fully offline and by default contacts
nothing. An optional Settings panel lets a visitor paste their **own** TMDb
API key to enable live poster/rating sync; that is the one deliberate, opt-in
exception to "load nothing from third parties" (see `docs/verarbeitung.md` V6
and `docs/auftragsverarbeiter.md`). Because of that exception, `/mcu/*.html`
carries a slightly wider CSP than the rest of the site
(`connect-src 'self' https://api.themoviedb.org`,
`img-src 'self' data: https://image.tmdb.org`) — every other directive is
unchanged, still no `unsafe-inline`, still no wildcards.

Data sources, confidence levels and known gaps are documented in
`mcu/methodology.html`.

The Impressum is German only — that is the legally binding version for a German
operator, and it carries a short English summary at the top. The privacy notice
exists in both languages, but `datenschutz.html` is the binding one and
`privacy-policy.html` says so at the top. **Change them together or not at all.**

## Brand tokens

Colour, type, shape and motion come from
[`Da-Hauge/haug-it-brand`](https://github.com/Da-Hauge/haug-it-brand).
`css/brand.css` is a **vendored copy** of `tokens/brand.css` from that repo,
currently v1.0.0.

It is copied rather than hotlinked on purpose: fetching it from GitHub at
runtime would be a third-party request from the visitor's browser, which drags
in § 25 TDDDG and Art. 44 DSGVO. Do not edit `css/brand.css` here — change it in
the brand repo and re-copy:

```bash
cp ../haug-it-brand/tokens/brand.css css/brand.css
cp ../haug-it-brand/logo/mark.svg    favicon.svg
```

`css/style.css` maps the `--hb-*` tokens onto short local names in one block at
the top and never contains a literal colour (the print block excepted).

## How the theme works

Three modes: **auto** (follow the OS, the default), **light**, **dark**. The
toggle in the header cycles through them.

- `js/theme.js` runs synchronously in `<head>` on every page, so a stored theme
  never flashes the wrong colours.
- The choice is stored in `localStorage` under `haugit.theme`. Choosing *auto*
  **removes** the key rather than storing the word `auto`, so a visitor who
  returns to auto leaves nothing behind.
- The button is hidden until JS confirms it can work — without JS it could not
  do anything, so it is not shown.

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
  inline SVG. The one documented, opt-in exception is `/mcu/`'s optional
  TMDb sync — off by default, requires the visitor's own API key, see
  "MCU Tracker" above and `docs/verarbeitung.md` V6.
- **Store nothing on the device beyond what's documented in
  `docs/verarbeitung.md`.** No cookies, no `sessionStorage`, no IndexedDB. Every
  `localStorage` key that exists (`haugit.lang`, `haugit.theme`,
  `haugit.mcu.progress`, `haugit.mcu.tmdbKey`) is written only on an explicit
  action and is covered by § 25 Abs. 2 Nr. 2 TDDDG (`haugit.mcu.tmdbKey` is
  additionally consent-based under Art. 6(1)(a) GDPR, since using it also
  sends data to TMDb). A new key needs a fresh assessment — and probably a
  banner.
- **Every stylesheet is local.** `brand.css` before `style.css`, both from
  `'self'`. Never add a `<link>` to a font service or a CDN.
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
`docs/auftragsverarbeiter.md`, `datenschutz.html` AND `privacy-policy.html`
in the same pull request.

## Open points

- Three prose blocks in `impressum.html` (Haftung für Inhalte, Haftung für
  Links, Urheberrecht) still need text from a lawyer or a generator. Everything
  that could be researched instead of drafted is done — the full handover list
  is `docs/rechtliche-todos.md`.
- Third-country transfer through GitHub Pages (US) is narrowed but not closed,
  see `docs/auftragsverarbeiter.md`.
- HTTP security headers cannot be set on GitHub Pages, see
  `docs/security-hinweise.md`.

## Accessibility

Target is WCAG 2.1 AA: semantic HTML, skip link, one `h1` per page, visible
focus indicator, keyboard operability, `prefers-reduced-motion`. Foreign-language
fragments carry their own `lang` attribute. Nothing has been checked with an
automated tool yet — an axe or Lighthouse run is still outstanding.

## Security

To report a security problem, see [SECURITY.md](SECURITY.md).
