# Taxi Adler: Redaktion

## Einstieg

Backend: https://taxi-adler.ddev.site/typo3/

Lokale Administrator-Zugangsdaten: `.local-credentials`. Für spätere Redakteure eigene Benutzer anlegen und der Gruppe **Taxi Adler Redaktion** zuordnen. Die Gruppe ist vorbereitet; kein zusätzlicher geteilter Redakteur-Login wurde angelegt.

Im Modul **Inhalt / Layout** eine Seite auswählen. Jedes Element kann bearbeitet, verschoben, ausgeblendet und kopiert werden. Änderungen speichern und Vorschau öffnen. Optionale Schaltflächen verschwinden, wenn Beschriftung oder Ziel fehlt. Für Links den TYPO3-Linkbrowser nutzen, insbesondere bei internen Seiten und Sprungmarken.

## Globale Bereiche

Die Startseite hat drei Inhaltsbereiche:

- **Website-Kopf**: Logo, Markenname, Festnetz, Mobil, E-Mail, Anschrift, Erreichbarkeit, WhatsApp-Link, Hauptschaltfläche und sortierbare Navigation.
- **Seiteninhalt**: frei kombinierbare Inhaltsblöcke.
- **Zahlungsarten und Website-Fuß**: Logo-Liste sowie Footer mit Logo, Text, Bereichsüberschriften und Links.

Kopf und Fuß nur auf der Startseite pflegen. Sie erscheinen automatisch überall. Kontaktdaten in Kontaktblöcken kommen aus dem globalen Kopf. WhatsApp hat einen eigenen Link, unabhängig vom Festnetz.

Das schwebende WhatsApp-Symbol verwendet denselben WhatsApp-Link. Im Footer hat jeder Link einen Bereich: Navigation, Leistungen oder Rechtliches. Bereichsüberschriften stehen im Footer-Element. Die Texte im Cookie-Banner und der Datenschutz-Link werden in den Website-Einstellungen unter „Datenschutz und Cookie-Banner“ gepflegt. Derzeit sind keine optionalen Analyse- oder Marketing-Dienste aktiv; diese Kategorien nicht ohne technische Einbindung einschalten.

Bei Karten, Text-Bild-Bereichen und Seiten-Bannern steht eine **Layout-Variante** zur Auswahl. Sie bestimmt etwa Fotokarten, Rastatt-Galerie, Leistungsdetails mit Checkliste oder Flughafen-Abschnitte. Seitenbereiche haben eigene Überschrift- und Richtextfelder. Beim Flughafen-Formular kann das vorausgefüllte Ziel geändert werden; die Rückrichtung verwendet diesen Wert als Abholort. Vertrauenspunkte unter Formularen sind sortierbare Einträge.

## Wiederverwendbare Elemente

| Element | Bearbeitbare Inhalte |
| --- | --- |
| Großes Startseiten-Banner | Kicker, Überschrift, hervorgehobene Zeile, Text, Hintergrundbild, zwei Schaltflächen, Vertrauenspunkte mit Symbol |
| Seiten-Banner | Kicker, Überschrift, hervorgehobene Zeile, Einleitung, optionales Hintergrundbild, zwei Schaltflächen |
| Leistungskarten / Bildergalerie | Bereichsüberschrift, Einleitung, Hintergrund; pro Karte Kicker, Titel, Text, Bild, Symbol, Link und Bildnachweis |
| Text & Bild / Vorteile | Überschriften, Text, Bild, Hintergrund, Schaltfläche; Vorteilspunkte mit Titel, Text und Symbol |
| Fahrzeuge / Bildkarten | Überschrift, Text, Schaltfläche, Hinweis; pro Fahrzeug Bild, Titel, Beschreibung und Link |
| Ablauf in Schritten | Überschriften, Einleitung, Hinweis, Schaltfläche; Schritte mit Bild, Symbol, Titel, Text und Link |
| Häufige Fragen | Überschriften, Einleitung, Schaltfläche; sortierbare Frage-Antwort-Paare |
| Bewertungen-Karussell | Überschriften, Einleitung, Gesamtbewertung, Anzahl, Quelle/Link, Auswahlhinweis, Autoplay/Intervall; je Rezension Name, Originalauszug, Sterne und Quellenlink |
| Kontakt-Banner | Überschriften, Text, Hintergrundbild, zwei Schaltflächen |
| Fahrtanfrage-Formular | Überschriften, Einleitung, Formularauswahl nach Name, Hinweis |
| Kontaktinformationen | Überschrift, Text, WhatsApp-Beschriftung, Adressaufklapp-Beschriftung, Hinweis; zentrale Kontaktdaten aus dem Kopf |
| Redaktioneller Text / Rechtstext | Kicker, Überschrift, hervorgehobene Zeile, Richtext, Hintergrund, Schaltfläche |
| Zahlungsarten | Überschrift, sortierbare Einträge mit Namen, Bild/Logo und optionalem Link |

Jeder Block hat eine optionale **Sprungmarke** ohne `#`, z. B. `buchen`, `fragen` oder `bewertungen`. Jede Marke pro Seite nur einmal vergeben. TYPO3 erzeugt außerdem die normale Datensatz-Sprungmarke `c<Nummer>`.

Einträge über **Eintrag hinzufügen** anlegen und per Sortiergriff umordnen. Die Eingabemaske passt sich an: eine Rezension zeigt andere Felder als ein Logo oder eine Karte. Einzelne Einträge können verborgen werden. Für einen gemeinsamen Block auf mehreren Seiten das normale TYPO3-Element **Datensätze / Referenz** verwenden, statt Texte doppelt zu pflegen.

## Bilder

Medien: **fileadmin → adler**. Im Element Bilder ersetzen und den Ausschnitt bearbeiten. Alternativtext und Titel in der Medienreferenz pflegen. Bei Fahrzeugen und Logos wird ohne individuellen Alternativtext der Eintragstitel verwendet. Hintergrundbilder sind dekorativ und werden nicht vorgelesen.

Bildnachweise in den vorgesehenen Text- und Linkfeldern pflegen. Die E-Klasse-Bilder basieren auf dem echten Fahrzeugfoto, zeigen aber KI-generierte Umgebungen. Das größere Fahrzeug ist illustrativ. Zahlungslogos stammen unverändert von der bisherigen Website; vor Veröffentlichung tatsächlich angebotene Zahlungsarten prüfen.

## Formulare

Unter **Inhalt → Formulare / Forms** die **Taxi Adler Fahrtanfrage** öffnen. Sie liegt in der TYPO3-Datenbank und ist direkt im Formulareditor bearbeitbar. Dort Felder, Beschriftungen, Pflichtangaben und Validierung pflegen; unter **Abschlussaktionen / Finishers** Empfängeradresse und Bestätigung anpassen.

Nach Speichern aktualisiert sich das ausgewählte Formular überall. Für ein separates Formular eine Kopie im Formulareditor erstellen und anschließend im Inhaltselement auswählen. Kein Dateipfad und kein YAML-Code müssen eingegeben werden.

Lokal geht Versand nur an **Mailpit**: https://taxi-adler.ddev.site:8026/. Eine Anfrage ist keine verbindliche Buchungsbestätigung. Es gibt keine Personen-Auswahl mit Obergrenze. Gruppengröße, Koffer und Flugnummer gehören in die Hinweise; keine Gesundheitsdaten übermitteln.

„Datenschutzhinweise lesen“ öffnet die Datenschutzseite im Formular als Dialog. Der Text kommt beim ersten Öffnen direkt aus dem bearbeitbaren Rechtstext der Datenschutzseite, nicht aus einer separaten Kopie. Schließen, Escape und Tastaturnavigation erhalten die Formulareingaben. Ohne JavaScript bleibt der normale Seitenlink verfügbar.

## Rezensionen Und Rechtstexte

Die sechs Rezensionen und die Gesamtbewertung werden manuell gepflegt, nicht live mit Google synchronisiert. Nur echte Originalauszüge und nachvollziehbare Quellen verwenden. Kein Prüfdatum erscheint auf der Website.

Impressum und Datenschutz wurden vollständig von der bisherigen Website kopiert. Nur die genehmigte Anschrift in der Datenschutzerklärung wurde zu **Rauentaler Straße 45, Eingang A** geändert. Im Richtextfeld bearbeitbar; die Übernahme ersetzt keine rechtliche Prüfung vor dem Livebetrieb.

## Veröffentlichung

Seiten und Formulare auf Desktop und Mobilgeräten ansehen. Neue Bilder, lange Überschriften, leere Einträge und Links prüfen. Preise und zugesicherte Leistungen nur nach Freigabe ergänzen. Vor dem Livegang müssen Betreiber und technische Betreuung Mailversand, Datenschutz, Zahlungsarten, Weiterleitungen und Indexierbarkeit freigeben.
