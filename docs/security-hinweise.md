# Sicherheitshinweise — haug-it.eu

Stand: 2026-09-07. Bezug: OWASP Top 10:2025, CLAUDE.md Abschnitt 2.

## Was umgesetzt ist

**A02 — Security Misconfiguration.** Jede HTML-Seite trägt eine
`Content-Security-Policy` als `<meta http-equiv>`:

```
default-src 'none'; base-uri 'none'; form-action 'none';
img-src 'self' data:; style-src 'self'; script-src 'self';
font-src 'self'; connect-src 'none'; object-src 'none'; frame-src 'none'
```

Kein `unsafe-inline`, keine Wildcards. Deshalb gibt es im gesamten Projekt
**kein** `<style>`-Element, **kein** `style="…"`-Attribut, **kein** Inline-`<script>`
und **kein** `onclick`-artiges Attribut. Wer das ändert, bricht die Seite —
das ist beabsichtigt.

`<meta name="referrer" content="strict-origin-when-cross-origin">` bildet die
Referrer-Policy nach.

**A05 — Injection.** Kein `innerHTML`, kein `eval`, keine Template-Ausgabe von
Nutzereingaben. Die Seite ist vollständig statisch; es gibt keinen Eingabepfad.
`js/main.js` liest ausschließlich eigene Fragment-Bezeichner und löst sie über
`getElementById` auf, nicht über einen aus dem `href` zusammengesetzten Selektor.

**A03 — Supply Chain.** Null Laufzeit-Abhängigkeiten, null Build-Abhängigkeiten,
kein `package.json`, kein CDN. Damit gibt es nichts zu auditieren und keine
SBOM-Fläche außer den eigenen Dateien.

**A08 — Integrity.** Es wird nichts von extern geladen, daher sind keine
SRI-Hashes nötig. Kommt jemals ein externes Skript hinzu, ist SRI Pflicht —
und vorher die Prüfung nach § 25 TDDDG.

**A10 — Exceptional Conditions.** Die Scroll-Animation ist so gebaut, dass sie
im Fehlerfall *offen* ausfällt: der versteckte Zustand wird nur gesetzt, wenn
`IntersectionObserver` vorhanden ist, und ein Timeout macht nach vier Sekunden
in jedem Fall alles wieder sichtbar. Ohne JavaScript ist die Seite vollständig
lesbar und bedienbar.

## Bekannte Lücken

**Echte Response-Header fehlen.** GitHub Pages erlaubt keine eigenen HTTP-Header.
Deshalb fehlen:

- `Strict-Transport-Security` — GitHub Pages erzwingt HTTPS bei aktivierter
  Option, setzt HSTS für eigene Domains aber nicht selbst. **Prüfen, ob
  „Enforce HTTPS" für `haug-it.eu` in den Repository-Einstellungen aktiv ist.**
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options` bzw. `frame-ancestors` — `frame-ancestors` wird in einem
  `<meta>`-Tag von Browsern ignoriert, die Seite ist also einbettbar. Bei einer
  rein informativen Seite ohne Login und ohne Formulare ist das Clickjacking-Risiko
  gering, aber es ist eine Lücke und keine Nicht-Lücke.
- `Permissions-Policy`

Wer diese Header will, braucht einen Hoster mit Header-Konfiguration oder ein
CDN davor. Das deckt sich mit der EU-Hosting-Frage aus
`auftragsverarbeiter.md` — beide Punkte lassen sich in einem Umzug lösen.

**A09 — Logging.** Es gibt keine eigenen Logs und keinen Zugriff auf die des
Hosters. Ein Angriff auf die ausgelieferten Inhalte wäre über die Git-Historie
nachvollziehbar, ein Zugriff auf Besucherdaten nicht.

## Wenn etwas dazukommt

Vor dem Merge zu klären, in dieser Reihenfolge:

1. Lädt es etwas von einem Dritten? → § 25 TDDDG, Consent, AVV, Drittland.
2. Verarbeitet es personenbezogene Daten? → `docs/verarbeitung.md` ergänzen.
3. Braucht es Inline-Code? → Nein. CSP nicht aufweichen; Datei auslagern.
4. Ist es eine Abhängigkeit? → Name, Version, Downloads, letztes Release,
   Lizenz nennen; erst dann entscheiden.
