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

## V4 — Darstellungswahl (hell / dunkel) im Browser

| Feld | Wert |
|---|---|
| Zweck | Merkt die vom Besucher gewählte Farbdarstellung |
| Datenkategorien | ein `localStorage`-Eintrag `haugit.theme` mit dem Wert `light` oder `dark` |
| Auslöser | ausschließlich ein Klick auf den Darstellungsschalter. Der Modus „auto" **löscht** den Eintrag, statt das Wort `auto` zu speichern; die automatische Erkennung **liest** nur `prefers-color-scheme` und schreibt nichts |
| Empfänger | keine — der Wert verlässt den Browser nicht |
| Personenbezug | keiner: kein Identifier, keine Zusammenführung, kein Rückschluss auf eine Person |
| § 25 TDDDG | Abs. 2 Nr. 2 — für den ausdrücklich gewünschten Dienst unbedingt erforderlich, daher einwilligungsfrei (**LEGAL-REVIEW**: gängige Auslegung, aber eine Einschätzung) |
| Speicherdauer | bis der Besucher die Websitedaten in seinem Browser löscht |
| Löschkonzept | in der Hand des Besuchers; „auto" löscht den Eintrag selbst |

Wenn das nicht gewollt ist: `js/theme.js` und den `data-theme-toggle`-Button
entfernen — dann entscheidet bei jedem Aufruf `prefers-color-scheme`, und es
wird nichts gespeichert.

## V5 — MCU-Tracker: Sichtungsfortschritt (`/mcu/`)

| Feld | Wert |
|---|---|
| Zweck | Merkt, welche Titel im MCU-Tracker als gesehen markiert wurden, sowie die zuletzt gewählten Anzeigeoptionen (Episoden-Aufteilung, Nicht-MCU einblenden, Post-Credit-Hinweis, Sortierung) |
| Datenkategorien | ein `localStorage`-Eintrag `haugit.mcu.progress` mit einer JSON-Struktur: Titel-/Episoden-IDs (feste, im Quellcode definierte Kennungen wie `iron-man`, keine personenbezogene Kennung) auf `true`/`false`; ein Zeitstempel je zuletzt als „gesehen" markiertem Eintrag (`watchedAt`, für das Diagramm „Gesehen über die Zeit" im Dashboard); die zuletzt angesehene Filmminute laufender, noch nicht abgeschlossener Titel (`filmProgress`); sowie die zuletzt gewählten Anzeige-, Filter-, Gruppierungs- und Sortieroptionen |
| Auslöser | ausschließlich Klicks auf die „gesehen"-Kästchen, den Minuten-Regler in der Detailansicht, bzw. die Filter-/Options-Schalter auf `/mcu/` und `/mcu/dashboard.html` |
| Empfänger | keine — der Wert verlässt den Browser nicht, auch nicht bei aktiviertem TMDb-Abgleich (siehe V6). Das Dashboard liest denselben Eintrag nur, es schreibt nichts zusätzlich |
| Personenbezug | keiner: die Titel-/Episoden-IDs sind feste Werkskennungen aus dem Datensatz, die Zeitstempel betreffen ausschließlich den Sichtungszeitpunkt eines Werks (nicht Ort, Gerät oder sonstige Umstände), kein Bezug zur besuchenden Person, keine Zusammenführung mit anderen Daten |
| § 25 TDDDG | Abs. 2 Nr. 2 — für den ausdrücklich angeforderten Tracking-Dienst unbedingt erforderlich, daher einwilligungsfrei (**LEGAL-REVIEW**: gleiche Einordnung wie V3/V4, gängige Auslegung) |
| Speicherdauer | bis der Besucher die Websitedaten löscht oder den „Fortschritt zurücksetzen"-Knopf benutzt |
| Löschkonzept | in der Hand des Besuchers; ein Export (JSON-Datei-Download, rein clientseitig über `Blob`/`URL.createObjectURL`) und ein passender Import stehen zusätzlich zur Verfügung, damit ein Browserwechsel den Fortschritt nicht zwingend löscht |

## V6 — MCU-Tracker: optionaler TMDb-Live-Abgleich (`/mcu/`)

| Feld | Wert |
|---|---|
| Zweck | Zeigt aktuelle Poster und Wertungen von TMDb (The Movie Database) an, wenn der Besucher das ausdrücklich aktiviert |
| Datenkategorien (lokal) | ein `localStorage`-Eintrag `haugit.mcu.tmdbKey` mit dem selbst eingetragenen TMDb-API-Schlüssel des Besuchers |
| Datenkategorien (an TMDb übertragen) | IP-Adresse und Standard-HTTP-Kopfzeilen des Besuchers, sowie der API-Schlüssel selbst, bei jeder Anfrage an `api.themoviedb.org` / `image.tmdb.org` |
| Auslöser | ausschließlich das Eintragen eines eigenen TMDb-API-Schlüssels im Einstellungsdialog. Ohne eingetragenen Schlüssel findet **keine** Netzwerkanfrage von `/mcu/` statt |
| Empfänger | **TMDB (The Movie Database)**, eine US-amerikanische Plattform — siehe `auftragsverarbeiter.md` |
| Drittland | Ja (USA) — **LEGAL-REVIEW, ungeklärt**, siehe `auftragsverarbeiter.md` |
| Rechtsgrundlage | Art. 6 Abs. 1 lit. a DSGVO (Einwilligung durch die aktive, informierte Handlung des Eintragens eines eigenen Schlüssels — der Einstellungsdialog erklärt vorher, was passiert) |
| Speicherdauer (lokal) | bis der Besucher den Schlüssel über „Schlüssel löschen" entfernt oder die Websitedaten löscht |
| Speicherdauer (bei TMDb) | nicht durch den Betreiber dieser Seite bestimmbar — richtet sich nach TMDbs eigener Datenschutzerklärung |
| Löschkonzept | vollständig in der Hand des Besuchers: Schlüssel entfernen beendet die Funktion sofort, die Offline-Basisdaten bleiben unverändert nutzbar |

Diese Funktion ist die einzige bewusste Ausnahme von der Grundregel „lädt nichts von Dritten" (siehe README, Abschnitt „Rules for this repository") — und nur, weil sie erstens standardmäßig aus ist, zweitens einen vom Besucher selbst besorgten und eingetragenen Schlüssel voraussetzt, und drittens im Einstellungsdialog vor der Eingabe erklärt wird.

## Bewusst nicht vorhandene Verarbeitungen

Die folgenden Dinge existieren auf dieser Website **nicht** und dürfen ohne neue
Bewertung auch nicht eingeführt werden:

- Kontaktformular oder sonstige Formulare (`form-action 'none'` in der CSP)
- Cookies, `sessionStorage`, IndexedDB
- `localStorage` für irgendetwas anderes als V3, V4, V5 und V6
- Analytics, Tag-Manager, Pixel, A/B-Testing, Fingerprinting
- Externe Schriftarten, Icon-Dienste, JS-Bibliotheken von einem CDN
- Eingebettete Karten, Videos, Social-Plugins, Captchas
- Newsletter, Konten, Login, Warenkorb, Zahlungen
- Netzwerkanfragen von `/mcu/` an TMDb ohne einen vom Besucher selbst
  eingetragenen API-Schlüssel (siehe V6) — der Grundzustand der Seite bleibt
  vollständig ohne Drittanfragen

**Wenn eines davon hinzukommt**, sind vor dem Merge zu klären: Rechtsgrundlage,
Einwilligungsbedarf nach § 25 TDDDG (dann Consent-Banner mit gleichwertigem
„Ablehnen"), AVV, Drittlandtransfer, Speicherdauer und Löschpfad. Diese Datei
und `datenschutz.html` sind im selben PR mitzuändern.
