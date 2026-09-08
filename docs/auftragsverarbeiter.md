# Auftragsverarbeiter — haug-it.eu

Stand: 2026-09-08. Art. 28 DSGVO (AVV), Art. 44 ff. DSGVO (Drittlandtransfer).
Jeder Dienst, der personenbezogene Daten dieser Website berührt, gehört in diese
Tabelle — bevor er eingebaut wird, nicht danach.

Kontakt- und Betreiberdaten stehen bewusst nur im `impressum.html`, nicht
zusätzlich hier.

| Anbieter | Zweck | Datenkategorien | Serverstandort | AVV | Status |
|---|---|---|---|---|---|
| GitHub, Inc. (GitHub Pages) | Hosting und Auslieferung der statischen Seiten | IP-Adresse, Zeitstempel, URL, User-Agent, Referrer (Server-Logs) | USA / global (CDN) | siehe unten | **LEGAL-REVIEW** (eingegrenzt) |
| Mailanbieter der Kontaktadresse | Empfang und Speicherung eingehender E-Mails | E-Mail-Adresse, Name, Nachrichteninhalt | **unbekannt** | **offen** | **offen — bitte ergänzen** |
| TMDB (The Movie Database) | *Nur wenn der Besucher im MCU-Tracker (`/mcu/`) einen eigenen API-Schlüssel einträgt:* Poster und aktuelle Wertungen live nachladen | IP-Adresse, Standard-HTTP-Kopfzeilen, der eingetragene API-Schlüssel | USA (laut eigener Datenschutzerklärung; ggf. weitere Länder über Zulieferer) | **offen** | **LEGAL-REVIEW — konditionale Verarbeitung, siehe unten** |

## GitHub Pages — was recherchiert und belegt ist

Recherchiert am 2026-09-08, Primärquellen von GitHub selbst:

**Transfermittel — geklärt.** GitHub, Inc. hat gegenüber dem US-Handelsministerium
selbst zertifiziert, dass es die Grundsätze des **EU-U.S. Data Privacy Framework**
einhält (samt UK Extension und Swiss-U.S. DPF), und stützt Übermittlungen aus
EU/EWR/UK/Schweiz zusätzlich auf die **Standardvertragsklauseln** der
EU-Kommission, Durchführungsbeschluss (EU) 2021/914.
Quelle: [GitHub General Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement).

**DPA — existiert, Reichweite unklar.** Das
[GitHub Data Protection Agreement](https://github.com/customer-terms/github-data-protection-agreement)
gilt seinem Wortlaut nach für „all Online Services except (i) Products
specifically identified as excluded … and (ii) Previews". Es bindet
ausdrücklich sowohl die Standardvertragsklauseln als auch die
DPF-Selbstzertifizierung ein. GitHub führt den DPA in der eigenen Darstellung
allerdings produktbezogen für **Enterprise Cloud, Enterprise (Unified), Teams
und Copilot** — nicht für kostenlose Privatkonten.

**Log-Speicherdauer — nicht ermittelbar.** GitHub veröffentlicht **keine**
konkrete Aufbewahrungsdauer für die Zugriffslogs von GitHub Pages. Das Privacy
Statement sagt nur allgemein, die Dauer richte sich nach Zweck und gesetzlichen
Pflichten. Die auffindbaren konkreten Zahlen (7 Tage Systemlogs, 90 Tage
Actions-Artefakte) betreffen GitHub Enterprise Server bzw. GitHub Actions und
**nicht** Pages. Damit ist dieser Punkt beantwortet, aber nicht mit einer Zahl:
*GitHub gibt sie nicht heraus.*

## Was davon noch juristische Wertung braucht

Nach der Recherche bleiben genau drei Fragen offen. Sie sind Rechtsfragen, keine
Recherchefragen:

1. **Ist GitHub hier überhaupt Auftragsverarbeiter?** Für reine
   Zugriffs-/Sicherheitslogs eines Hosters wird verbreitet vertreten, dass der
   Hoster insoweit *eigener* Verantwortlicher ist. Trifft das zu, ist ein AVV
   nach Art. 28 gar nicht der richtige Hebel.
2. **Falls doch: greift der DPA bei einem kostenlosen Privatkonto?** Der
   Geltungsbereich ist weit formuliert, GitHubs eigene Produktzuordnung ist es
   nicht. Das ist die entscheidende Lücke.
3. **Ist die DPF-Zertifizierung zum Veröffentlichungszeitpunkt noch aktiv?**
   Zertifizierungen laufen aus. Vor dem Livegang gegen
   [dataprivacyframework.gov/list](https://www.dataprivacyframework.gov/list)
   prüfen — die Beteiligtenliste ist die einzige belastbare Quelle, nicht die
   Aussage des Anbieters.

**Die Alternative, die alle drei Fragen erledigt:** Auslieferung über einen
Anbieter mit Servern in der EU/im EWR (z. B. Hetzner, netcup, Uberspace, IONOS).
Bei einer rein statischen Seite ohne Build-Schritt ist der Umzug technisch klein:
Dateien hochladen, DNS umstellen, TLS-Zertifikat einrichten. Der `CNAME`-Eintrag
im Repository entfällt dann. Nebeneffekt: echte HTTP-Sicherheitsheader werden
möglich, siehe `security-hinweise.md`.

**Mailanbieter.** Der Anbieter des Postfachs hinter der im Impressum genannten
Kontaktadresse ist hier noch nicht eingetragen — das weiß nur der Betreiber.
Ergänzen: Anbieter, Serverstandort, AVV-Status, Aufbewahrungsdauer. Liegt der
Anbieter außerhalb der EU/des EWR, gilt dieselbe Prüfung wie oben.

## TMDB (The Movie Database) — konditional, nur `/mcu/`

Recherchiert am 2026-09-08, Primärquelle TMDBs eigene Datenschutzerklärung
(themoviedb.org/privacy-policy):

**Auslöser.** Diese Verarbeitung findet nur statt, wenn der Besucher im
MCU-Tracker den Einstellungsdialog öffnet und dort einen eigenen,
selbstbeschafften TMDb-API-Schlüssel einträgt. Ohne eingetragenen Schlüssel
lädt `/mcu/` ausschließlich die im Repository ausgelieferten, statischen
Daten — keine Anfrage an TMDb, keine Drittanfrage überhaupt.

**Transfermittel — nicht geklärt.** TMDBs eigene Datenschutzerklärung nennt
Serverstandorte außerhalb der EU/des EWR (insbesondere USA) und verweist
allgemein auf Drittlandtransfers, ohne dabei — anders als GitHub — eine
DPF-Selbstzertifizierung oder Standardvertragsklauseln ausdrücklich zu
benennen. **LEGAL-REVIEW:** vor einem produktiven Livegang mit dieser
Funktion wäre zu prüfen, ob TMDB in der DPF-Teilnehmerliste
([dataprivacyframework.gov/list](https://www.dataprivacyframework.gov/list))
geführt wird, und andernfalls, auf welcher Grundlage nach Art. 44 ff. DSGVO
der Transfer stattfindet.

**Wer verantwortlich ist, ist hier ungewöhnlich.** Der Besucher selbst löst
die Übertragung aus, mit einem Schlüssel, den er selbst bei TMDb beschafft
und damit TMDBs eigenen Nutzungsbedingungen bereits zugestimmt hat. Das
ändert nichts an der Informationspflicht dieser Seite (Art. 13 DSGVO,
Einstellungsdialog und `datenschutz.html`/`privacy-policy.html` erklären es
vorher), verkleinert aber die Rolle des Seitenbetreibers gegenüber einem
Fall, in dem die Seite selbst allen Besuchern automatisch einen eigenen
Schlüssel unterschieben würde — genau das wurde bewusst vermieden, siehe
`verarbeitung.md` V6.

## Kein Auftragsverarbeiter: Sprach-, Darstellungs- und Sichtungsfortschritt

Die Einträge `haugit.lang`, `haugit.theme`, `haugit.mcu.progress` und
(bis auf die TMDb-Zeile oben) `haugit.mcu.tmdbKey` im `localStorage` bleiben
vollständig im Browser des Besuchers. Sie werden nicht übertragen und von
niemandem ausgelesen — es gibt dafür also keinen Empfänger und keinen
Auftragsverarbeiter. Die Einordnung nach § 25 TDDDG steht in `verarbeitung.md`
(V3, V4, V5, V6).

## Bewusst nicht eingesetzt

Kein Analytics, kein Error-Tracking, kein CDN für Assets, keine Schriftarten von
Dritten, keine LLM-API. Es gibt daher außer den drei Zeilen oben keine weiteren
Auftragsverarbeiter — TMDB nur konditional, wie beschrieben.
