import React from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, CalendarDays, CarFront, Check, ChevronDown, Clock3, HeartPulse, Mail, MapPin, MessageCircle, Phone, PlaneTakeoff, ShieldCheck } from 'lucide-react';
import { business, inquiryUrl, services, serviceUrl } from './content';
import { airportTransfer } from './airport';
import legalPages from './legal-pages.json';

export function PageHero({ label, title, emphasis, lead, image, imageAlt = '', fallback, service = false, className = '', children }) {
  return (
    <section className={`page-hero ${image ? 'page-hero--photo' : ''} ${className}`}>
      {image && <div className="page-hero-image"><img src={image} alt={imageAlt} onError={event => { if (fallback && !event.currentTarget.dataset.fallback) { event.currentTarget.dataset.fallback = '1'; event.currentTarget.src = fallback; } }}/></div>}
      <div className="container-wide page-hero-inner">
        <nav className="breadcrumbs" aria-label="Brotkrümelnavigation"><a href="/">Startseite</a><ArrowRight size={12} aria-hidden="true"/>{service && <><a href="/services/">Leistungen</a><ArrowRight size={12} aria-hidden="true"/></>}<span aria-current="page">{label}</span></nav>
        <div className="page-hero-copy">
          <div className="section-label section-label-light"><span className="section-label-bar"/>{label}</div>
          <h1>{title}{emphasis && <><br/><em>{emphasis}</em></>}</h1>
          {lead && <p>{lead}</p>}
          {children}
        </div>
        <div className="page-hero-baseline"><span><Clock3 size={16}/>24 Stunden erreichbar</span><span><MapPin size={16}/>Rastatt & Umgebung</span></div>
      </div>
    </section>
  );
}

function MiniLabel({ children }) {
  return <div className="section-label"><span className="section-label-bar"/>{children}</div>;
}

function PhoneButton() {
  return <a className="btn btn-gold" href={business.phoneHref}><Phone size={17} aria-hidden="true"/>{business.phone}</a>;
}

function Questions({ items }) {
  return <div className="faq-list">{items.map(item => <details className="faq-item" key={item.q}><summary><span>{item.q}</span><span className="faq-plus"><ChevronDown size={20} aria-hidden="true"/></span></summary><p>{item.a}</p></details>)}</div>;
}

export function ServicesPage({ children }) {
  return <>
    <PageHero label="Unsere Leistungen" title="Was Sie vorhaben." emphasis="Wir fahren Sie hin." lead="Vom kurzen Weg durch Rastatt bis zur regelmäßigen Behandlung: Hier finden Sie die passende Fahrt – und die Informationen für Ihre Anfrage.">
      <a className="btn btn-gold" href="#leistungsuebersicht">Leistungen entdecken <ArrowRight size={18}/></a>
    </PageHero>
    <div id="leistungsuebersicht">{children}</div>
    <section className="editorial-section">
      <div className="container-wide editorial-split">
        <div className="reveal"><MiniLabel>GUT VORBEREITET</MiniLabel><h2>Ihre Fahrt ist<br/><em>nicht irgendeine.</em></h2></div>
        <div className="editorial-copy reveal"><p>Ein früher Flug, ein wichtiger Arzttermin, ein Abend mit Freunden: Jede Fahrt hat ihren eigenen Anlass. Deshalb stimmen wir die Details lieber persönlich ab.</p><p>Nennen Sie uns Abholort, Ziel, Termin und die Anzahl der Personen. Für Gepäck, Kindersitze, Hilfsmittel oder besondere Anforderungen sprechen Sie uns bitte schon bei der Anfrage an.</p><div className="inline-note"><CarFront size={23}/><span>Ob allein, mit der Familie oder als größere Gruppe: Wir stimmen Ihre Fahrt, das Gepäck und die Verfügbarkeit individuell mit Ihnen ab. Auch mehr als 6 Personen können eine Fahrt anfragen.</span></div><a href="/kontakt/" className="text-link">Fragen Sie uns persönlich <ArrowUpRight size={18}/></a></div>
      </div>
    </section>
  </>;
}

export function ServicePage({ service }) {
  const Icon = service.icon;
  const related = services.filter(item => item.id !== service.id).slice(service.id === 'flughafen' ? 2 : 0, service.id === 'flughafen' ? 4 : 2);
  return <>
    <PageHero service label={service.title} title={service.heading} emphasis={service.emphasis} lead={service.lead} image={service.photo} fallback={service.fallback}>
      <div className="page-hero-actions"><a href={inquiryUrl(service)} className="btn btn-gold">Fahrt anfragen <ArrowUpRight size={18}/></a><a href={business.phoneHref} className="page-hero-call"><Phone size={17}/>{business.phone}</a></div>
    </PageHero>
    <div className="service-highlights"><div className="container-wide">{service.highlights.map(text => <span key={text}><Check size={17} aria-hidden="true"/>{text}</span>)}</div></div>
    {service.id === 'stadt' && <p className="container-wide page-image-credit">Bahnhof Rastatt · <a href="https://commons.wikimedia.org/wiki/File:Rastatt-Bahnhof-10-2023-gje.jpg" target="_blank" rel="noopener noreferrer">Gerd Eichmann / Wikimedia Commons</a> · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a> · KI-bearbeitet</p>}
    <section className="service-detail-section">
      <div className="container-wide service-detail-layout">
        <div className="service-detail-copy">
          <div className="journey-line reveal"><span className="journey-icon"><Icon size={25}/></span><span>{service.route[0]}</span><span className="journey-dash"/><ArrowRight size={18}/><strong>{service.route[1]}</strong></div>
          {service.id === 'flughafen' && <a className="airport-service-link" href={airportTransfer.path}><PlaneTakeoff size={25} aria-hidden="true"/><span><strong>Zum Flughafen Karlsruhe/Baden-Baden (FKB)?</strong><small>Ihr Transfer ab Karlsruhe, Baden-Baden, Rastatt und Umgebung – auch für Familien und größere Gruppen.</small></span><ArrowUpRight size={22} aria-hidden="true"/></a>}
          {service.sections.map((section, index) => <article className="service-copy-block reveal" key={section.title}><span className="copy-index">0{index + 1}</span><div><h2>{section.title}</h2><p>{section.text}</p></div></article>)}
          {service.notice && <p className="service-safety-note"><ShieldCheck size={20}/><span>{service.notice}</span></p>}
          <div className="detail-questions reveal"><MiniLabel>NOCH GUT ZU WISSEN</MiniLabel><Questions items={service.faq}/></div>
        </div>
        <aside className="inquiry-panel reveal" aria-label="Ihre Fahrt vorbereiten">
          <span className="inquiry-panel-icon"><CalendarDays size={27}/></span><MiniLabel>FÜR IHRE ANFRAGE</MiniLabel><h2>Diese Angaben<br/><em>helfen uns.</em></h2>
          <ol>{service.checklist.map(item => <li key={item}>{item}</li>)}</ol>
          <a href={inquiryUrl(service)} className="btn btn-ink">Anfrage vorbereiten <ArrowUpRight size={18}/></a>
          <p>Kurzfristig unterwegs? Rufen Sie uns bitte direkt an.</p><a className="inquiry-panel-phone" href={business.phoneHref}><Phone size={17}/>{business.phone}</a>
        </aside>
      </div>
    </section>
    <section className="related-section">
      <div className="container-wide"><div className="related-heading"><div><MiniLabel>AUCH FÜR SIE DA</MiniLabel><h2>Weitere Wege mit uns.</h2></div><a href="/services/" className="text-link">Alle Leistungen <ArrowUpRight size={18}/></a></div><div className="related-links">{related.map(item => { const RelatedIcon = item.icon; return <a href={serviceUrl(item)} key={item.id}><RelatedIcon size={29}/><span><strong>{item.title}</strong><small>{item.subtitle}</small></span><ArrowUpRight size={23}/></a>; })}</div></div>
    </section>
  </>;
}

export function AboutPage({ children }) {
  const values = [
    { icon: Phone, title: 'Ein direkter Draht.', text: 'Keine anonyme Buchungsstrecke: Sie besprechen Ihre Fahrt mit unserem Team. So lassen sich Fragen, Treffpunkte und individuelle Wünsche direkt klären.' },
    { icon: HeartPulse, title: 'Ein offenes Ohr.', text: 'Ob Krankenfahrt, Flughafen oder kurzer Weg zum Bahnhof – wir hören zu, was für Ihre Fahrt wichtig ist, und stimmen den Ablauf mit Ihnen ab.' },
    { icon: MapPin, title: 'Ein Stück Rastatt.', text: 'In Rastatt zu Hause und für Ihre Wege in der Region da. Unsere Anschrift finden Sie in der Rauentaler Straße 45, Eingang A.' },
  ];
  return <>
    <PageHero label="Über Taxi Adler" title="Persönlich erreichbar." emphasis={`Seit ${business.yearsOfService} Jahren unterwegs.`} lead={`Seit ${business.yearsOfService} Jahren ist Taxi Adler als Personenbeförderungsunternehmen in Rastatt und der Region für Sie da. Für den Alltag, besondere Reisen und die Termine, auf die es ankommt.`} image="/images/taxi-adler-mercedes-fleet.webp" imageAlt="Mercedes-Benz E-Klasse von Taxi Adler – KI-Visualisierung auf Basis des Fahrzeugfotos">
      <a href="/kontakt/" className="btn btn-gold">Sprechen wir über Ihre Fahrt <ArrowUpRight size={18}/></a>
    </PageHero>
    <section className="editorial-section about-intro">
      <div className="container-wide editorial-split"><div className="reveal"><MiniLabel>UNSER ANSPRUCH</MiniLabel><h2>Gute Fahrten<br/>beginnen mit<br/><em>gutem Kontakt.</em></h2></div><div className="editorial-copy reveal"><p className="editorial-lead">Ein Anruf. Ein vereinbarter Treffpunkt. Ein gutes Gefühl auf dem Weg.</p><p>Wir möchten, dass Ihre Fahrt zu Ihrem Tagesablauf passt. Deshalb nehmen wir uns Zeit für die Vorbereitung – ob Sie einmalig ein Taxi benötigen oder regelmäßig zu einem Termin fahren.</p><p>Sie erreichen Taxi Adler rund um die Uhr. Verfügbarkeit, Unterstützung beim Ein- und Aussteigen, Gepäck und besondere Wünsche besprechen Sie bitte vorab mit unserem Team.</p><PhoneButton/></div></div>
      <div className="container-wide values-list">{values.map((value, index) => { const Icon = value.icon; return <article className="value-row reveal" key={value.title}><span className="copy-index">0{index + 1}</span><Icon size={28}/><h3>{value.title}</h3><p>{value.text}</p></article>; })}</div>
      {children}
    </section>
  </>;
}

export function ContactPage({ children }) {
  return <>
    <section className="contact-page-heading">
      <div className="container-wide">
        <nav className="breadcrumbs" aria-label="Brotkrümelnavigation"><a href="/">Startseite</a><ArrowRight size={12} aria-hidden="true"/><span aria-current="page">Kontakt</span></nav>
        <div className="contact-heading-row"><div><div className="section-label section-label-light"><span className="section-label-bar"/>KONTAKT & FAHRTANFRAGE</div><h1>Wohin darf es <em>gehen?</em></h1></div><p>Direkt anrufen, über WhatsApp schreiben oder Ihre nächste Fahrt vorbereiten.</p></div>
      </div>
    </section>
    <section className="contact-priority-section" aria-label="Telefon und Fahrtanfrage">
      <div className="container-wide">
        <div className="contact-priority-grid">
          <aside className="contact-direct">
            <div className="contact-phone-top"><span className="contact-phone-symbol"><Phone size={24} aria-hidden="true"/></span><h2>Direkt für Sie da.</h2><a className="contact-direct-number" href={business.phoneHref}>{business.phone}<ArrowUpRight size={24} aria-hidden="true"/></a><span className="contact-open"><span/>24 Stunden · 7 Tage die Woche</span></div>
            <div className="contact-phone-bottom"><p>Für kurzfristige Fahrten rufen Sie bitte an. Termin, Treffpunkt und Verfügbarkeit klären wir persönlich mit Ihnen.</p><a className="btn btn-outline" href={business.whatsappUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} aria-hidden="true"/>Über WhatsApp schreiben</a><a className="text-link" href="#buchen">Oder Anfrage vorbereiten <ArrowDown size={17} aria-hidden="true"/></a></div>
          </aside>
          <div className="contact-inquiry">{children}</div>
        </div>
        <div className="contact-secondary">
          <div className="contact-secondary-links"><a href={business.mobileHref}><Phone size={15} aria-hidden="true"/>Mobil: {business.mobile}</a><a href={`mailto:${business.email}`}><Mail size={16} aria-hidden="true"/>{business.email}</a></div>
          <details className="contact-address"><summary><MapPin size={16} aria-hidden="true"/><span>Anschrift & Anfahrt</span><ChevronDown size={16} aria-hidden="true"/></summary><div><address>{business.street}<br/>{business.city}</address><a href={business.mapsUrl} target="_blank" rel="noopener noreferrer">In Google Maps öffnen <ArrowUpRight size={14} aria-hidden="true"/></a></div></details>
        </div>
      </div>
    </section>
  </>;
}

export function LegalPage({ privacy = false }) {
  const legal = legalPages[privacy ? 'datenschutz' : 'impressum'];
  return <>
    <PageHero label={privacy ? 'Datenschutz' : 'Impressum'} title={legal.heading} className="page-hero--legal"/>
    <section className="editorial-section"><div className="container-wide legal-layout"><aside><MiniLabel>KONTAKT</MiniLabel><a href={business.phoneHref}>{business.phone}</a><a href={`mailto:${business.email}`}>{business.email}</a><a href="/kontakt/" className="text-link">Zur Kontaktseite <ArrowUpRight size={16}/></a></aside><article className="legal-copy" aria-label={legal.heading} dangerouslySetInnerHTML={{ __html: legal.contentHtml }}/></div></section>
  </>;
}

export function NotFoundPage() {
  return <PageHero label="Seite nicht gefunden" title="Hier endet der Weg." emphasis="Nicht Ihre Reise." lead="Diese Seite gibt es in unserem Entwurf nicht. Von der Startseite oder der Leistungsübersicht geht es weiter."><div className="page-hero-actions"><a href="/" className="btn btn-gold">Zur Startseite <ArrowRight size={18}/></a><a href="/services/" className="text-link">Unsere Leistungen <ArrowUpRight size={18}/></a></div></PageHero>;
}
