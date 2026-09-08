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

## Kein Auftragsverarbeiter: Sprach- und Darstellungswahl

Die Einträge `haugit.lang` und `haugit.theme` im `localStorage` bleiben
vollständig im Browser des Besuchers. Sie werden nicht übertragen und von
niemandem ausgelesen — es gibt dafür also keinen Empfänger und keinen
Auftragsverarbeiter. Die Einordnung nach § 25 TDDDG steht in `verarbeitung.md`
(V3, V4).

## Bewusst nicht eingesetzt

Kein Analytics, kein Error-Tracking, kein CDN für Assets, keine Schriftarten von
Dritten, keine LLM-API. Es gibt daher außer den beiden Zeilen oben keine weiteren
Auftragsverarbeiter.
