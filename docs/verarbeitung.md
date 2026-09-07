# Verarbeitungsübersicht — haug-it.eu

Stand: 2026-09-07. Pflegen, sobald sich am Quellcode oder am Hosting etwas ändert.
Grundlage: Art. 30 DSGVO (Verzeichnis von Verarbeitungstätigkeiten), Art. 6 DSGVO
(Rechtsgrundlage je Verarbeitung), Art. 5 Abs. 1 lit. e DSGVO (Speicherbegrenzung).

Verantwortlicher: siehe `impressum.html` (dort stehen die Pflichtangaben nach
§ 5 DDG). Personenbezogene Betreiberdaten stehen absichtlich nur dort und nicht
zusätzlich in dieser Datei.

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

## V3 — Sprachwahl im Browser

| Feld | Wert |
|---|---|
| Zweck | Merkt die vom Besucher gewählte Sprachfassung (`/` englisch, `/de/` deutsch) |
| Datenkategorien | ein `localStorage`-Eintrag `haugit.lang` mit dem Wert `en` oder `de` |
| Auslöser | ausschließlich ein Klick auf den EN/DE-Schalter. Die automatische Erkennung **liest** nur `navigator.language` und schreibt nichts |
| Empfänger | keine — der Wert verlässt den Browser nicht, weder zum Server noch zu Dritten |
| Personenbezug | keiner: kein Identifier, keine Zusammenführung, kein Rückschluss auf eine Person |
| § 25 TDDDG | Abs. 2 Nr. 2 — für den ausdrücklich gewünschten Dienst unbedingt erforderlich, daher einwilligungsfrei (**LEGAL-REVIEW**: gängige Auslegung, aber eine Einschätzung) |
| Speicherdauer | bis der Besucher die Websitedaten in seinem Browser löscht |
| Löschkonzept | in der Hand des Besuchers; die Seite funktioniert ohne den Eintrag unverändert |

Wenn das nicht gewollt ist: `js/lang.js` und den `data-set-lang`-Block in
`js/main.js` entfernen — dann entscheidet bei jedem Aufruf die Browsersprache,
und es wird gar nichts gespeichert.

## Bewusst nicht vorhandene Verarbeitungen

Die folgenden Dinge existieren auf dieser Website **nicht** und dürfen ohne neue
Bewertung auch nicht eingeführt werden:

- Kontaktformular oder sonstige Formulare (`form-action 'none'` in der CSP)
- Cookies, `sessionStorage`, IndexedDB
- `localStorage` für irgendetwas anderes als V3
- Analytics, Tag-Manager, Pixel, A/B-Testing, Fingerprinting
- Externe Schriftarten, Icon-Dienste, JS-Bibliotheken von einem CDN
- Eingebettete Karten, Videos, Social-Plugins, Captchas
- Newsletter, Konten, Login, Warenkorb, Zahlungen

**Wenn eines davon hinzukommt**, sind vor dem Merge zu klären: Rechtsgrundlage,
Einwilligungsbedarf nach § 25 TDDDG (dann Consent-Banner mit gleichwertigem
„Ablehnen"), AVV, Drittlandtransfer, Speicherdauer und Löschpfad. Diese Datei
und `datenschutz.html` sind im selben PR mitzuändern.
