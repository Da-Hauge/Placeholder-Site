# Offene rechtliche Punkte — Übergabeliste

Stand: 2026-09-08.

Diese Datei ist die vollständige Liste dessen, was an `haug-it.eu` noch
rechtlich offen ist. Sie ist so geschrieben, dass sie einem Anwalt oder einem
Generator direkt vorgelegt werden kann.

**Sachverhalt in einem Absatz:** Rein statische, private Visitenkarten-Website
ohne Shop, ohne Konto, ohne Login, ohne Formular, ohne Newsletter, ohne
Zahlungen und ohne Werbung. Kein Analytics, kein Tracking, keine Cookies, keine
externen Schriftarten, keine eingebetteten Inhalte Dritter. Gespeichert werden
im Browser ausschließlich zwei selbst gesetzte Anzeigepräferenzen (Sprache,
Hell/Dunkel). Kontakt läuft über eine `mailto:`-Adresse. Gehostet auf GitHub
Pages (USA). Betreiber ist eine Privatperson, keine gewerbliche Tätigkeit über
die Seite.

---

## A. Erledigt — recherchiert und belegt

Kein Handlungsbedarf mehr, nur noch Kenntnisnahme.

| Punkt | Ergebnis |
|---|---|
| Anschrift der Aufsichtsbehörde | BayLDA, Promenade 18, 91522 Ansbach; Postfach 1349, 91504 Ansbach; Tel. +49 981 180093-0; poststelle@lda.bayern.de. In beiden Datenschutzseiten eingetragen |
| OS-Plattform / ODR-Link | Durch Verordnung (EU) 2024/3228 abgeschafft; keine neuen Beschwerden seit 20.03.2025, vollständig eingestellt zum 20.07.2025. Verlinkungspflicht entfallen. Es wird bewusst **nicht** verlinkt |
| Veraltete Normverweise | § 5 TMG → § 5 DDG, § 55 Abs. 2 RStV → § 18 Abs. 2 MStV. Korrigiert |
| Transfermittel GitHub | DPF-Selbstzertifizierung **und** Standardvertragsklauseln (Durchführungsbeschluss (EU) 2021/914). Belegt aus GitHubs Privacy Statement und DPA; in beiden Datenschutzseiten benannt |
| Log-Speicherdauer GitHub Pages | GitHub veröffentlicht dazu **keine** Angabe. Das ist die Antwort — eine Zahl gibt es nicht |
| Tippfehler in der Kontaktadresse | `huag-it.eu` → `haug-it.eu` korrigiert |
| Falschbehauptung „keine personenbezogenen Daten" | Entfernt. Server-Logs verarbeiten IP-Adressen; das steht jetzt drin |

---

## B. Braucht juristische Wertung — kann ich nicht liefern

### B1. Rechtstexte, die formuliert werden müssen

Stehen im `impressum.html` als sichtbare `TODO`-Blöcke:

- **Haftung für Inhalte**
- **Haftung für Links**
- **Urheberrecht**

Diese drei sind reine Textbausteine. Ein seriöser Generator (eRecht24,
activeMind, Dr. Schwenke, IHK-Muster) liefert sie in fünf Minuten. Sie müssen
nicht erfunden werden — sie müssen von jemandem kommen, der dafür haftet.

Im `datenschutz.html` und `privacy-policy.html` betrifft das die Formulierung
der Betroffenenrechte-Belehrung und die Begründung der Rechtsgrundlagen.

### B2. Fragen, die nur der Betreiber beantworten kann

| Frage | Warum sie zählt |
|---|---|
| Ist die Seite rein privat oder geschäftsmäßig? | Entscheidet, ob § 5 DDG überhaupt greift und wie streng |
| Besteht eine Umsatzsteuer-ID? | Dann Pflichtangabe im Impressum |
| Gibt es eine Register- oder Berufsangabe, eine Kammerzugehörigkeit? | Dann Pflichtangabe |
| Besteht eine Berufshaftpflicht mit räumlichem Geltungsbereich? | Dann Pflichtangabe |
| Welcher Anbieter betreibt das Postfach hinter der Kontaktadresse? | Für `auftragsverarbeiter.md` und die Datenschutzerklärung |

### B3. Fragen, die eine echte Rechtsfrage sind

1. **Ist § 18 Abs. 2 MStV hier überhaupt einschlägig?** Die Angabe „Verantwortlich
   für den Inhalt" ist nur bei journalistisch-redaktionellen Angeboten Pflicht.
   Eine Projektliste ist vermutlich keines. Aktuell steht die Angabe drin —
   schadet nicht, ist aber womöglich überflüssig.

2. **Ist GitHub für die Zugriffslogs Auftragsverarbeiter oder eigener
   Verantwortlicher?** Davon hängt ab, ob überhaupt ein AVV nach Art. 28 nötig
   ist. Details in `auftragsverarbeiter.md`.

3. **Falls AVV nötig: greift GitHubs DPA bei einem kostenlosen Privatkonto?**
   Wortlaut weit („all Online Services"), GitHubs eigene Produktzuordnung eng
   (Enterprise, Teams, Copilot). Das ist die eigentliche Lücke.

4. **Sind Sprach- und Darstellungswahl im `localStorage` von
   § 25 Abs. 2 Nr. 2 TDDDG gedeckt?** Die herrschende Auslegung sagt ja — eine
   vom Nutzer selbst gesetzte Anzeigepräferenz ist für den ausdrücklich
   gewünschten Dienst erforderlich. Es gibt dazu aber keine höchstrichterliche
   Entscheidung. Wer das Restrisiko nicht will: beide Funktionen entfernen, dann
   wird nichts gespeichert (Anleitung in `verarbeitung.md`, V3 und V4).

5. **Ist ein Datenschutzbeauftragter nötig?** Nach § 38 BDSG mit hoher
   Wahrscheinlichkeit nein (keine 20 Personen mit ständiger automatisierter
   Verarbeitung). Einschätzung, keine Feststellung.

6. **Reicht die englische Fassung als Übersetzung?** `datenschutz.html` ist als
   verbindlich bezeichnet, `privacy-policy.html` als Übersetzung. Ob diese
   Konstruktion trägt, ist zu prüfen.

---

## C. Wird erst relevant, wenn sich etwas ändert

- **AGB und Widerrufsbelehrung** — erst bei entgeltlichen Leistungen oder einem
  Shop. Dann auch die VSBG-Erklärung zur Verbraucherschlichtung, die den
  entfallenen ODR-Hinweis ersetzt.
- **Barrierefreiheitserklärung nach BFSG** — greift seit 28.06.2025 für
  verbraucherorientierten E-Commerce, Buchungs- und Kontodienste. Eine reine
  Visitenkartenseite fällt nicht darunter, und Kleinstunternehmen sind ohnehin
  ausgenommen. Sobald hier etwas verkauft oder gebucht wird, ändert sich das.
- **Consent-Banner** — sobald irgendetwas von einem Dritten geladen wird oder
  ein dritter Speichereintrag dazukommt. Dann mit gleichwertigem „Ablehnen" auf
  der ersten Ebene.

---

## D. Vorschlag für die Reihenfolge

1. B2 beantworten (fünf Minuten, weiß nur der Betreiber).
2. Die drei Textbausteine aus B1 von einem Generator holen und einsetzen. Danach
   sind die sichtbaren `TODO`-Blöcke auf der Seite weg.
3. B3.2/B3.3 entscheiden — **oder** in die EU umziehen und die Frage streichen.
4. B3.1, B3.4, B3.5, B3.6 mit dem Anwalt in einem Durchgang klären.

Schritt 2 macht die Seite präsentabel. Schritt 3 ist der einzige Punkt mit
echtem Risiko.
