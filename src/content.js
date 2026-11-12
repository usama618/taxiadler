import { CalendarDays, HeartPulse, MapPin, Plane, ShieldCheck, ShoppingBag } from 'lucide-react';
import { airportTransfer } from './airport.js';

export const business = {
  name: 'Taxi Adler Rastatt',
  yearsOfService: 20,
  phone: '07222 9011511',
  phoneHref: 'tel:+4972229011511',
  mobile: '0151 4655 7964',
  mobileHref: 'tel:+4915146557964',
  whatsappUrl: 'https://wa.me/4915146557964',
  email: 'info@taxiadler-rastatt.de',
  street: 'Rauentaler Straße 45, Eingang A',
  city: '76437 Rastatt',
  address: 'Rauentaler Straße 45, Eingang A, 76437 Rastatt',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Rauentaler+Stra%C3%9Fe+45+76437+Rastatt',
  googleReviewsUrl: 'https://maps.app.goo.gl/ZDxjcY8WJ8uYo6iw5',
};

// Original images and order from the live website's Zahlungsarten section.
export const paymentMethods = [
  { name: 'EC-Karte', file: 'ec-karte.gif', width: 90, height: 62 },
  { name: 'Visa', file: 'visa-karte.gif', width: 92, height: 61 },
  { name: 'Mastercard', file: 'master.gif', width: 88, height: 65 },
  { name: 'Sofortüberweisung', file: 'sofort.gif', width: 92, height: 62 },
  { name: 'giropay', file: 'giropay.gif', width: 88, height: 62 },
  { name: 'Visa Electron', file: 'evisakarte.gif', width: 92, height: 65 },
  { name: 'Maestro', file: 'maester-karte.gif', width: 88, height: 61 },
  { name: 'Bargeld', file: 'bargeld.png', width: 88, height: 61 },
];

export const services = [
  {
    id: 'flughafen', slug: 'flughafenfahrten', no: '01', title: 'Flughafenfahrten', landingUrl: airportTransfer.path,
    subtitle: 'Karlsruhe/Baden-Baden (FKB) und weitere Airports.',
    description: 'Flughafentransfer ab Karlsruhe, Baden-Baden, Rastatt und Umgebung. Hin- und Rückfahrt nach Absprache.',
    icon: Plane,
    photo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=85&auto=format&fit=crop',
    fallback: '/images/service-airport.svg', className: 'service-large',
    heading: 'Entspannt starten.', emphasis: 'Gut ankommen.',
    lead: 'Die Reise beginnt vor dem Terminal. Wir stimmen Ihre Flughafenfahrt ab Karlsruhe, Baden-Baden, Rastatt und Umgebung persönlich mit Ihnen ab – vom ersten Abholpunkt bis zur Rückfahrt.',
    route: ['Ihre Abholadresse', 'Ihr Flughafen'],
    highlights: ['Hin- und Rückfahrt abstimmen', 'Abholung am vereinbarten Treffpunkt', 'Auch für größere Gruppen'],
    sections: [
      { title: 'Ein guter Start braucht einen guten Plan.', text: 'Teilen Sie uns Flughafen, Reisetag und Abflugzeit mit. Gemeinsam besprechen wir die Abholzeit und berücksichtigen Ihre Wünsche für die Anreise. Planen Sie auch die vom Flughafen und der Fluggesellschaft empfohlenen Zeitreserven ein.' },
      { title: 'Auch für den Weg nach Hause.', text: 'Für die Abholung am Flughafen sind Flugnummer, Ankunftszeit und eine erreichbare Telefonnummer hilfreich. Den genauen Treffpunkt und den Umgang mit möglichen Verspätungen klären wir vor Ihrer Fahrt.' },
      { title: 'Alle Personen. Das ganze Gepäck.', text: 'Ob allein oder gemeinsam: Bitte nennen Sie die Personenzahl und die Menge des Gepäcks. Kindersitze, große Koffer oder besonderes Gepäck stimmen Sie bitte vorab mit uns ab, damit das passende Fahrzeug eingeplant werden kann.' },
    ],
    checklist: ['Flughafen und Flugnummer', 'Reisetag, Abflug- oder Ankunftszeit', 'Abholadresse und Telefonnummer', 'Personen, Koffer und besondere Wünsche'],
    faq: [{ q: 'Ist die Rückfahrt gleich mit planbar?', a: 'Ja, Sie können beide Strecken gemeinsam anfragen. Die Termine, Treffpunkte und Verfügbarkeit bestätigen wir persönlich.' }, { q: 'Wird hier ein Festpreis berechnet?', a: 'Nein. Das Formular ist eine Anfragevorschau. Den Fahrpreis beziehungsweise die Abrechnungsgrundlage besprechen Sie vorab direkt mit unserem Team.' }],
  },
  {
    id: 'kranken', slug: 'krankenfahrten', no: '02', title: 'Krankenfahrten',
    subtitle: 'Begleitung auf wichtigen Wegen.',
    description: 'Sitzende Fahrten zu Arztterminen, Untersuchungen und Behandlungen – persönlich abgestimmt.',
    icon: HeartPulse,
    photo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=900&q=85&auto=format&fit=crop',
    fallback: '/images/service-medical.svg',
    heading: 'Wichtige Termine.', emphasis: 'Persönlich begleitet.',
    lead: 'Ein Arzttermin bringt oft genug Organisation mit sich. Für Ihre sitzende Krankenfahrt besprechen wir Abholung, Ziel und Rückfahrt in Ruhe mit Ihnen.',
    route: ['Ihre Adresse', 'Praxis oder Klinik'],
    highlights: ['Sitzende Krankenfahrten', 'Arzt, Untersuchung und Therapie', 'Rückfahrt persönlich vereinbaren'],
    sections: [
      { title: 'Von zu Hause bis zum Termin.', text: 'Wir fahren Sie zu Arztpraxen, Untersuchungen, ambulanten Behandlungen oder zu einem vereinbarten Kliniktermin. Nennen Sie uns bitte die genaue Anlaufstelle und die Uhrzeit, zu der Sie dort sein müssen.' },
      { title: 'Die Abrechnung vorab klären.', text: 'Ob eine Direktabrechnung mit Ihrer gesetzlichen Krankenkasse oder Berufsgenossenschaft möglich ist und welche Unterlagen benötigt werden, klären wir vor der Fahrt. Eine ärztliche Verordnung oder Genehmigung kann erforderlich sein. Eine Kostenübernahme wird auf dieser Website nicht zugesagt.' },
      { title: 'Was Sie für die Fahrt brauchen.', text: 'Bitte sprechen Sie eine Begleitperson, einen Rollator oder sonstige Unterstützung vorab an. Wir klären mit Ihnen, ob die Fahrt mit unseren Fahrzeugen möglich ist. Für medizinisch betreute oder liegende Transporte ist ein entsprechend ausgestatteter Anbieter erforderlich.' },
    ],
    checklist: ['Termin und genaue Zieladresse', 'Abholadresse und Rückfahrtwunsch', 'Begleitperson oder Hilfsmittel', 'Fragen zu Verordnung und Abrechnung'],
    notice: 'Unsere Leistung ist eine Taxifahrt, kein Rettungsdienst und kein medizinisch betreuter Krankentransport. In akuten Notfällen wählen Sie 112.',
    faq: [{ q: 'Übernimmt meine Krankenkasse die Fahrt?', a: 'Das hängt von Ihren individuellen Voraussetzungen und der Genehmigung Ihrer Krankenkasse ab. Bitte klären Sie die Kostenübernahme und die notwendigen Unterlagen vor der Fahrt.' }, { q: 'Kann eine Begleitperson mitfahren?', a: 'Bitte geben Sie eine Begleitperson bereits bei der Anfrage an. So können wir die benötigten Plätze und die Verfügbarkeit abstimmen.' }],
  },
  {
    id: 'dialyse', slug: 'dialyse-bestrahlungsfahrten', no: '03', title: 'Dialyse & Bestrahlung',
    subtitle: 'Auch bei regelmäßigen Terminen.',
    description: 'Fahrten zu Dialyse, Bestrahlung und Chemotherapie. Hin- und Rückwege gemeinsam planen.',
    icon: ShieldCheck,
    photo: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=900&q=85&auto=format&fit=crop',
    fallback: '/images/service-dialysis.svg',
    heading: 'Regelmäßige Wege.', emphasis: 'In Ruhe geplant.',
    lead: 'Wiederkehrende Behandlungen brauchen eine verlässliche Organisation. Wir stimmen Ihre Taxifahrten zur Dialyse, Bestrahlung oder Chemotherapie persönlich mit Ihnen ab.',
    route: ['Zuhause', 'Ihre Behandlung'],
    highlights: ['Wiederkehrende Behandlungstermine', 'Terminserie gemeinsam abstimmen', 'Abrechnung vorab besprechen'],
    sections: [
      { title: 'Eine Terminserie statt vieler Einzelanfragen.', text: 'Wenn Ihre Behandlung über mehrere Wochen oder Monate stattfindet, können Sie die bekannten Termine gesammelt mit uns besprechen. Abholzeit, Behandlungsort und Rückfahrten werden für Ihre Terminserie abgestimmt.' },
      { title: 'Wenn sich der Tagesablauf ändert.', text: 'Sagen Sie uns bitte möglichst früh Bescheid, wenn ein Termin verschoben wird oder sich die Dauer Ihrer Behandlung ändert. Wie Sie sich für die Rückfahrt melden, vereinbaren wir direkt mit Ihnen.' },
      { title: 'Unterlagen und Kostenübernahme.', text: 'Fragen zur Verordnung, einer möglichen Genehmigung und der Direktabrechnung mit Krankenkassen oder Berufsgenossenschaften gehören zur Vorbereitung. Wir besprechen die Abrechnung individuell; eine automatische Kostenübernahme ist damit nicht verbunden.' },
    ],
    checklist: ['Behandlungsort und Terminplan', 'Gewünschte Abholzeiten', 'Organisation der Rückfahrten', 'Erforderliche Unterlagen und Abrechnung'],
    faq: [{ q: 'Kann ich mehrere Termine auf einmal anfragen?', a: 'Ja. Halten Sie möglichst den vollständigen Terminplan bereit. Wir stimmen die einzelnen Fahrten und ihre Verfügbarkeit mit Ihnen ab.' }, { q: 'Kann ich einen Termin später ändern?', a: 'Bitte rufen Sie uns bei Änderungen möglichst früh an. Den geänderten Termin bestätigen wir Ihnen persönlich.' }],
  },
  {
    id: 'stadt', slug: 'stadt-regionalfahrten', no: '04', title: 'Stadt- & Regionalfahrten',
    subtitle: 'Flexibel durch Rastatt und Umgebung.',
    description: 'Zum Bahnhof, zum Einkauf oder zur Feier. Für alltägliche Wege und besondere Anlässe.',
    icon: MapPin, photo: '/images/rastatt-bahnhof-enhanced.webp', fallback: '/images/service-city.svg',
    heading: 'Hier unterwegs.', emphasis: 'Für Ihre Pläne.',
    lead: 'Manchmal geht es nur ein paar Straßen weiter. Manchmal über die Stadt hinaus. Taxi Adler ist Ihr Ansprechpartner für Fahrten in Rastatt und der Region.',
    route: ['Ihr Startpunkt', 'Ihr Ziel'],
    highlights: ['Stadt- und Bahnhofsfahrten', 'Feiern und Geschäftstermine', 'Abholung und Rückfahrt nach Absprache'],
    sections: [
      { title: 'Vom Bahnhof direkt weiter.', text: 'Ob mit Gepäck nach Hause oder rechtzeitig zum nächsten Zug: Stimmen Sie Bahnhof, Abholzeit und Treffpunkt mit uns ab. Teilen Sie uns Änderungen Ihrer Ankunft bitte direkt mit.' },
      { title: 'Für den Alltag. Und den Abend danach.', text: 'Zum Einkaufen, zu Besuch, ins Restaurant oder zur Feier: Fragen Sie Ihre gewünschte Strecke einfach an. Auch Fahrten zu Veranstaltungen oder nach einem Diskothekenbesuch können Sie persönlich mit uns abstimmen.' },
      { title: 'Gäste und Geschäftspartner abholen.', text: 'Sie organisieren einen Geschäftstermin oder erwarten Gäste? Besprechen Sie die Abholpunkte und Zeiten mit uns. Auch Fahrten für Gruppen mit mehr als 6 Personen sind auf Anfrage möglich. Gruppengröße, Gepäck, Organisation und Verfügbarkeit klären wir individuell.' },
    ],
    checklist: ['Abholort und genaue Zieladresse', 'Uhrzeit und gewünschte Rückfahrt', 'Anzahl der Personen', 'Gepäck oder besondere Anforderungen'],
    faq: [{ q: 'Kann ich eine Fahrt für meine Gäste anfragen?', a: 'Ja. Bitte geben Sie eine erreichbare Kontaktperson, den Treffpunkt und die Zahl der Fahrgäste an.' }, { q: 'Fahren Sie auch außerhalb von Rastatt?', a: 'Fragen Sie Ihre Strecke direkt bei uns an. Ziel, Fahrpreis und Verfügbarkeit stimmen wir persönlich ab.' }],
  },
  {
    id: 'serie', slug: 'serien-rechnungsfahrten', no: '05', title: 'Serien- & Rechnungsfahrten',
    subtitle: 'Ihre regelmäßige Verbindung.',
    description: 'Wiederkehrende Termine und geschäftliche Fahrten. Ablauf und Abrechnung vorab klären.',
    icon: CalendarDays, photo: '/images/taxi-adler-mercedes-fleet.webp', fallback: '/images/service-regular.svg',
    heading: 'Einmal abstimmen.', emphasis: 'Regelmäßig fahren.',
    lead: 'Für wiederkehrende Termine oder geschäftliche Wege lohnt sich eine gemeinsame Planung. Wir besprechen Ihre Serienfahrt und die passende Abrechnung persönlich.',
    route: ['Feste Abholung', 'Wiederkehrendes Ziel'],
    highlights: ['Regelmäßige Termine planen', 'Geschäftliche Fahrtanfragen', 'Rechnungsstellung nach Vereinbarung'],
    sections: [
      { title: 'Wiederkehrende Wege gut organisieren.', text: 'Teilen Sie uns die bekannten Termine, Abholadressen und Ziele mit. Das gilt auch für regelmäßige Fahrten zu Therapieangeboten, etwa in der Kinder- und Jugendpsychiatrie. Die konkrete Durchführung, notwendige Begleitung und Zuständigkeiten werden vorab abgestimmt.' },
      { title: 'Geschäftlich unterwegs.', text: 'Ob für Mitarbeitende, Kunden oder Geschäftspartner: Nennen Sie uns den Ansprechpartner, die Fahrtstrecken und Ihren gewünschten Ablauf. Bei mehreren Abholungen stimmen wir Zeiten und Fahrzeugverfügbarkeit gemeinsam ab.' },
      { title: 'Rechnungsfahrten nach Vereinbarung.', text: 'Für eine gewünschte Rechnungsstellung klären wir vor der ersten Fahrt die Rechnungsadresse, den Auftraggeber und die Konditionen. Eine Sammelabrechnung oder besondere Abrechnungsform muss individuell vereinbart werden.' },
    ],
    checklist: ['Terminserie oder Fahrtübersicht', 'Ansprechpartner und Fahrgäste', 'Abhol- und Zieladressen', 'Rechnungsadresse und gewünschte Abrechnung'],
    faq: [{ q: 'Sind Rechnungsfahrten für Firmen möglich?', a: 'Sie können geschäftliche Fahrten mit Rechnungsstellung anfragen. Die Voraussetzungen und Konditionen vereinbaren wir vorab persönlich.' }, { q: 'Gilt das auch für regelmäßige Behandlungen?', a: 'Ja, regelmäßige Kranken-, Dialyse- und Bestrahlungsfahrten können als Terminserie besprochen werden. Fragen zur Kostenübernahme klären Sie bitte vorab.' }],
  },
  {
    id: 'besorgung', slug: 'besorgungen-starthilfe', no: '06', title: 'Besorgungen & Starthilfe',
    subtitle: 'Auch darüber hinaus für Sie da.',
    description: 'Hol- und Bringdienste, Einkäufe, Medikamentenabholung und Starthilfe auf Anfrage.',
    icon: ShoppingBag,
    photo: 'https://images.unsplash.com/photo-1481437156560-3205f6a55735?w=900&q=85&auto=format&fit=crop',
    fallback: '/images/service-errands.svg',
    heading: 'Kleine Erledigung.', emphasis: 'Große Entlastung.',
    lead: 'Nicht jeder Weg muss eine Personenfahrt sein. Für Besorgungen, Hol- und Bringdienste oder Starthilfe erreichen Sie uns ebenfalls persönlich.',
    route: ['Abholen', 'Zu Ihnen bringen'],
    highlights: ['Hol- und Bringdienst', 'Besorgungen nach Absprache', 'Starthilfe vor Ort anfragen'],
    sections: [
      { title: 'Wenn Sie nicht selbst loskönnen.', text: 'Ob Einkauf oder eine andere Erledigung: Beschreiben Sie uns, was abgeholt werden soll, wo es bereitliegt und wohin es gebracht werden muss. Verfügbarkeit, Umfang und Kosten sprechen wir vorab mit Ihnen ab.' },
      { title: 'Medikamente abholen lassen.', text: 'Fragen Sie eine Abholung in Ihrer Apotheke persönlich an. Klären Sie vorher mit der Apotheke, welche Unterlagen, Vollmachten oder Zahlungsvereinbarungen für die Übergabe erforderlich sind. Bitte senden Sie keine Gesundheitsdaten über die Formularvorschau.' },
      { title: 'Wenn die Batterie nicht mitspielt.', text: 'Nennen Sie uns Ihren Standort und Ihr Fahrzeug, wenn Sie Starthilfe benötigen. Wir klären, ob wir vor Ort helfen können und was die Hilfe kostet. Ein Abschlepp- oder Reparaturdienst wird damit nicht zugesagt.' },
    ],
    checklist: ['Abholort oder Fahrzeugstandort', 'Genaue Beschreibung der Erledigung', 'Kontaktperson und Erreichbarkeit', 'Übergabe, Zahlung und Kosten klären'],
    faq: [{ q: 'Wie frage ich eine Besorgung an?', a: 'Rufen Sie uns an und schildern Sie kurz den Auftrag. Wir besprechen Ablauf, Verfügbarkeit und Kosten, bevor die Besorgung durchgeführt wird.' }, { q: 'Ist Starthilfe rund um die Uhr möglich?', a: 'Sie erreichen uns rund um die Uhr. Ob Starthilfe an Ihrem Standort möglich ist, klären wir im direkten Gespräch.' }],
  },
];

export const serviceUrl = service => `/leistungen/${service.slug}/`;
export const inquiryUrl = service => `/?leistung=${service.id}#buchen`;

export function resolvePage(pathname) {
  const path = `/${pathname.split('/').filter(Boolean).join('/')}/`.replace(/^\/\/$/, '/');
  if (path === airportTransfer.path) return { type: 'airport' };
  const service = services.find(item => serviceUrl(item) === path);
  if (service) return { type: 'service', service };
  return { type: ({ '/': 'home', '/services/': 'services', '/ueber-uns/': 'about', '/kontakt/': 'contact', '/impressum/': 'imprint', '/datenschutz/': 'privacy' })[path] || 'not-found' };
}
