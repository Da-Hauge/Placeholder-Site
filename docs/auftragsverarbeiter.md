# Auftragsverarbeiter — haug-it.eu

Stand: 2026-09-07. Art. 28 DSGVO (AVV), Art. 44 ff. DSGVO (Drittlandtransfer).
Jeder Dienst, der personenbezogene Daten dieser Website berührt, gehört in diese
Tabelle — bevor er eingebaut wird, nicht danach.

Kontakt- und Betreiberdaten stehen bewusst nur im `impressum.html`, nicht
zusätzlich hier.

| Anbieter | Zweck | Datenkategorien | Serverstandort | AVV | Status |
|---|---|---|---|---|---|
| GitHub, Inc. (GitHub Pages) | Hosting und Auslieferung der statischen Seiten | IP-Adresse, Zeitstempel, URL, User-Agent, Referrer (Server-Logs) | USA / global (CDN) | **offen** | **LEGAL-REVIEW** |
| Mailanbieter der Kontaktadresse | Empfang und Speicherung eingehender E-Mails | E-Mail-Adresse, Name, Nachrichteninhalt | **unbekannt** | **offen** | **offen — bitte ergänzen** |

## Offene Punkte

**LEGAL-REVIEW — GitHub Pages (USA).** Zu klären und zu dokumentieren:

1. Liegt ein Auftragsverarbeitungsvertrag nach Art. 28 DSGVO vor (GitHub Data
   Protection Agreement) und ist er für den genutzten Plan gültig?
2. Auf welches Transfermittel nach Art. 44 ff. DSGVO wird gestützt —
   Angemessenheitsbeschluss EU-US Data Privacy Framework oder
   Standardvertragsklauseln? Ist GitHub aktuell unter dem DPF zertifiziert?
3. Welche Speicherdauer gilt für die Server-Logs, und ist sie belegbar?

Bis diese drei Punkte beantwortet sind, ist Abschnitt 4 der `datenschutz.html`
unvollständig.

**Alternative, die den Drittlandtransfer vermeidet:** Auslieferung über einen
Anbieter mit Servern in der EU/im EWR (z. B. Hetzner, netcup, Uberspace,
IONOS). Bei einer rein statischen Seite ohne Build-Schritt ist der Umzug
technisch klein: Dateien hochladen, DNS umstellen, TLS-Zertifikat einrichten.
Der `CNAME`-Eintrag im Repository entfällt dann.

**Mailanbieter.** Der Anbieter des Postfachs hinter der im Impressum genannten
Kontaktadresse ist hier noch nicht eingetragen. Ergänzen, sobald bekannt:
Anbieter, Serverstandort, AVV-Status, Aufbewahrungsdauer. Liegt der Anbieter
außerhalb der EU/des EWR, gilt dieselbe Prüfung wie oben.

## Kein Auftragsverarbeiter: die Sprachwahl

Der Eintrag `haugit.lang` im `localStorage` bleibt vollständig im Browser des
Besuchers. Er wird nicht übertragen, nicht gespeichert und von niemandem
ausgelesen — es gibt dafür also keinen Empfänger und keinen Auftragsverarbeiter.
Die Einordnung nach § 25 TDDDG steht in `verarbeitung.md`.

## Bewusst nicht eingesetzt

Kein Analytics, kein Error-Tracking, kein CDN für Assets, keine Schriftarten von
Dritten, keine LLM-API. Es gibt daher außer den beiden Zeilen oben keine weiteren
Auftragsverarbeiter.
