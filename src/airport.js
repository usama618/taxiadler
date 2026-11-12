export const airportTransfer = {
  path: '/flughafentransfer-karlsruhe-baden-baden/',
  airportName: 'Flughafen Karlsruhe/Baden-Baden (FKB)',
  title: 'Flughafentransfer Karlsruhe/Baden-Baden (FKB) | Taxi Adler',
  description: 'Flughafentransfer FKB ab Karlsruhe, Baden-Baden, Rastatt & Umgebung. Für Familien und größere Gruppen. Hin- und Rückfahrt nach Absprache. Preis auf Anfrage.',
  officialUrl: 'https://www.baden-airpark.de/',
  officialHelpUrl: 'https://www.baden-airpark.de/kontakt/',
  faq: [
    {
      q: 'Sind Baden-Airpark und Flughafen Karlsruhe/Baden-Baden dasselbe Ziel?',
      a: 'Ja. Mit Baden-Airpark ist hier der Flughafen Karlsruhe/Baden-Baden mit dem Flughafencode FKB in Rheinmünster gemeint. Geben Sie bei Ihrer Anfrage am besten „Flughafen Karlsruhe/Baden-Baden (FKB)“ an, damit das Ziel eindeutig ist.',
    },
    {
      q: 'Was kostet ein Flughafentransfer ab Karlsruhe, Baden-Baden oder Rastatt?',
      a: 'Preis auf Anfrage. Den konkreten Fahrpreis beziehungsweise die Abrechnungsgrundlage besprechen wir vorab mit Ihnen. Dafür benötigen wir Ihre genaue Abholadresse, den Reisetermin sowie die Anzahl der Fahrgäste und des Gepäcks. Auch Hin- und Rückfahrt können gemeinsam angefragt werden.',
    },
    {
      q: 'Kann ich einen Transfer für einen sehr frühen Flug anfragen?',
      a: 'Sie erreichen Taxi Adler rund um die Uhr telefonisch. Fragen Sie frühe Abholungen bitte rechtzeitig an. Wir stimmen Abholzeit und Fahrzeugverfügbarkeit persönlich ab; erst unsere Bestätigung macht die Fahrt verbindlich.',
    },
    {
      q: 'Wo werde ich bei einer Abholung am FKB erwartet?',
      a: 'Den genauen Treffpunkt und die telefonische Kontaktaufnahme vereinbaren wir vorab mit Ihnen. Bitte halten Sie Flugnummer und eine erreichbare Mobilnummer bereit. Gehen Sie nicht davon aus, dass ein beliebiges Taxi am Terminal Ihre vorbestellte Fahrt ist.',
    },
    {
      q: 'Was passiert, wenn mein Flug Verspätung hat?',
      a: 'Informieren Sie uns möglichst früh telefonisch über Änderungen. Wie mit Wartezeiten, einer späteren Abholung und möglichen zusätzlichen Kosten umgegangen wird, klären Sie bei der Vereinbarung. Bitte halten Sie dafür Ihre aktuelle Flugnummer und eine erreichbare Mobilnummer bereit.',
    },
    {
      q: 'Kann ich Hin- und Rückfahrt zusammen planen?',
      a: 'Ja. Sie können die Fahrt zum Baden-Airpark und die Abholung nach Ihrer Rückkehr gemeinsam anfragen. Nennen Sie beide Reisetage, die Flugnummer der Rückreise und die gewünschte Zieladresse.',
    },
    {
      q: 'Gibt es ein Taxi für 6 Personen zum Flughafen Karlsruhe/Baden-Baden?',
      a: 'Ja. Unser größeres Fahrzeug bietet Platz für bis zu 6 Fahrgäste zusätzlich zum Fahrer. Auch Gruppen mit mehr als 6 Personen können einen Transfer anfragen. Nennen Sie uns Gruppengröße, Koffer und benötigte Kindersitze. Organisation und Verfügbarkeit stimmen wir individuell mit Ihnen ab.',
    },
    {
      q: 'Ist auch ein Transfer ab Bahnhof Rastatt möglich?',
      a: 'Sie können eine Taxifahrt ab Bahnhof Rastatt zum FKB anfragen. Nennen Sie Ankunftszeit, Zugverbindung und einen erreichbaren Kontakt. Der Flughafen hat keinen direkten Bahnanschluss; Informationen zu den ebenfalls vorhandenen Busverbindungen finden Sie auf der Flughafenwebsite.',
    },
  ],
};

export function airportInquiryDefaults(search = '') {
  const fromAirport = new URLSearchParams(search).get('richtung') === 'ab-flughafen';
  return {
    pickup: fromAirport ? airportTransfer.airportName : '',
    destination: fromAirport ? '' : airportTransfer.airportName,
    notes: `Flughafentransfer FKB – ${fromAirport ? 'Abholung am Flughafen' : 'Fahrt zum Flughafen'}`,
  };
}
