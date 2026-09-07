# haug-it.eu

Persönliche Website von Maximilian Haug. Statisches HTML und CSS, ausgeliefert
über GitHub Pages. Kein Build, kein Framework, keine Abhängigkeiten.

## Aufbau

```
index.html          Startseite (Hero, Schwerpunkte, Stack, Projekte, Kontakt)
impressum.html      Pflichtangaben § 5 DDG        — Rechtstext noch TODO
datenschutz.html    Art. 13 DSGVO                 — Rechtstext noch TODO
legal.html          Weiterleitung -> impressum.html    (alte URL)
privacy.html        Weiterleitung -> datenschutz.html  (alte URL)
404.html            Fehlerseite für GitHub Pages
favicon.svg         Icon, ein einziges SVG
css/style.css       Gesamtes Stylesheet, Design-Tokens oben
js/main.js          Nur Progressive Enhancement, optional
docs/               Verarbeitungsübersicht, Auftragsverarbeiter, Security-Notizen
CNAME               haug-it.eu
```

## Lokal ansehen

Ein Doppelklick auf `index.html` genügt. Für realistischere Pfade:

```bash
python -m http.server 8000
```

## Regeln für dieses Repository

Diese Seite ist bewusst so gebaut, dass sie ohne Einwilligung auskommt. Damit
das so bleibt, gilt:

- **Nichts von Dritten nachladen.** Keine Google Fonts, kein CDN, keine
  eingebetteten Karten, Videos oder Captchas. Schriftarten kommen aus dem
  System-Stack, Icons sind Inline-SVG.
- **Nichts auf dem Endgerät speichern.** Keine Cookies, kein `localStorage`,
  kein `sessionStorage`, kein IndexedDB. Der Farbmodus folgt deshalb nur
  `prefers-color-scheme` — ein Umschalter bräuchte Speicher.
- **Kein Inline-CSS und kein Inline-JS.** Die CSP in jeder Seite verbietet
  `unsafe-inline`. Ein `style="…"`-Attribut oder ein `onclick` bricht die Seite.
- **Kein Formular.** Kontakt läuft über `mailto:`; die CSP setzt
  `form-action 'none'`.
- **Keine Abhängigkeiten.** Wenn doch eine nötig wird: Name, Version,
  Downloads, letztes Release und Lizenz erst nennen, dann entscheiden.

Kommt eines dieser Dinge trotzdem dazu, sind im selben Pull Request
`docs/verarbeitung.md`, `docs/auftragsverarbeiter.md` und `datenschutz.html`
mitzuändern — und die Einwilligungspflicht nach § 25 TDDDG neu zu bewerten.

## Offene Punkte

- Impressum und Datenschutzerklärung enthalten `TODO`-Blöcke: die Rechtstexte
  sind noch nicht juristisch geprüft.
- Drittlandtransfer durch GitHub Pages (USA) ist ungeklärt, siehe
  `docs/auftragsverarbeiter.md`.
- HTTP-Sicherheitsheader lassen sich auf GitHub Pages nicht setzen, siehe
  `docs/security-hinweise.md`.

## Barrierefreiheit

Ziel ist WCAG 2.1 AA: semantisches HTML, Skip-Link, eine `h1` pro Seite,
sichtbarer Fokusindikator, Tastaturbedienbarkeit, `prefers-reduced-motion`.
Automatisiert geprüft wurde bisher nichts — ein Durchlauf mit axe oder Lighthouse
steht aus.

## Sicherheit

Meldungen zu Sicherheitsproblemen: siehe [SECURITY.md](SECURITY.md).
