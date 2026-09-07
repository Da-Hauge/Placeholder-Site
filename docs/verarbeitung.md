# Verarbeitungsübersicht — haug-it.eu

Stand: 2026-09-07. Pflegen, sobald sich am Quellcode oder am Hosting etwas ändert.
Grundlage: Art. 30 DSGVO (Verzeichnis von Verarbeitungstätigkeiten), Art. 6 DSGVO
(Rechtsgrundlage je Verarbeitung), Art. 5 Abs. 1 lit. e DSGVO (Speicherbegrenzung).

Verantwortlicher: Maximilian Haug, Ludwig-Thoma-Str. 23c, 85247 Schwabhausen.

## V1 — Auslieferung der Website

| Feld | Wert |
|---|---|
| Zweck | Technische Bereitstellung der statischen Seiten, Missbrauchsabwehr |
| Betroffene | Besucher der Website |
| Datenkategorien | IP-Adresse, Zeitstempel, angefragte URL, HTTP-Statuscode, übertragene Bytes, Referrer, User-Agent |
| Herkunft | Automatisch beim HTTP-Request |
| Rechtsgrundlage | Art. 6 Abs. 1 lit. f DSGVO — berechtigtes Interesse an einer funktionsfähigen, missbrauchsresistenten Website |
| Empfänger | GitHub, Inc. (Hosting, siehe `auftragsverarbeiter.md`) |
| Drittland | Ja (USA) — **LEGAL-REVIEW**, siehe `auftragsverarbeiter.md` |
| Speicherdauer | Wird durch GitHub bestimmt; vom Betreiber nicht konfigurierbar — **offen** |
| Löschkonzept | Nicht in eigener Hand. Eigener Löschpfad nur bei Wechsel auf selbst betriebenes Hosting möglich |
| Pseudonymisierung | Nicht möglich, da kein Zugriff auf die Logkonfiguration |

## V2 — Kontaktaufnahme per E-Mail

| Feld | Wert |
|---|---|
| Zweck | Bearbeitung einer eingehenden Anfrage |
| Betroffene | Absender der E-Mail |
| Datenkategorien | E-Mail-Adresse, ggf. Name, Inhalt der Nachricht |
| Herkunft | Freiwillige Angabe des Absenders |
| Rechtsgrundlage | Art. 6 Abs. 1 lit. b DSGVO (vorvertraglich) bzw. lit. f DSGVO |
| Empfänger | Betreiber des genutzten Mailpostfachs — **noch zu ergänzen**, siehe `auftragsverarbeiter.md` |
| Speicherdauer | Bis zur abschließenden Bearbeitung; danach löschen, soweit keine handels- oder steuerrechtliche Aufbewahrungspflicht besteht |
| Löschkonzept | Manuell im Postfach |

## Bewusst nicht vorhandene Verarbeitungen

Die folgenden Dinge existieren auf dieser Website **nicht** und dürfen ohne neue
Bewertung auch nicht eingeführt werden:

- Kontaktformular oder sonstige Formulare (`form-action 'none'` in der CSP)
- Cookies, `localStorage`, `sessionStorage`, IndexedDB → § 25 TDDDG nicht berührt
- Analytics, Tag-Manager, Pixel, A/B-Testing, Fingerprinting
- Externe Schriftarten, Icon-Dienste, JS-Bibliotheken von einem CDN
- Eingebettete Karten, Videos, Social-Plugins, Captchas
- Newsletter, Konten, Login, Warenkorb, Zahlungen

**Wenn eines davon hinzukommt**, sind vor dem Merge zu klären: Rechtsgrundlage,
Einwilligungsbedarf nach § 25 TDDDG (dann Consent-Banner mit gleichwertigem
„Ablehnen"), AVV, Drittlandtransfer, Speicherdauer und Löschpfad. Diese Datei
und `datenschutz.html` sind im selben PR mitzuändern.
