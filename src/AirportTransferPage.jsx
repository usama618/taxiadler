import React from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronDown, Clock3, Luggage, MapPin, Phone, Plane, PlaneLanding, PlaneTakeoff, ShieldCheck, UsersRound } from 'lucide-react';
import { business } from './content';
import { airportTransfer } from './airport';

export default function AirportTransferPage({ children }) {
  return <>
    <section className="airport-hero">
      <div className="container-wide">
        <nav className="breadcrumbs" aria-label="Brotkrümelnavigation"><a href="/">Startseite</a><ArrowRight size={12} aria-hidden="true"/><a href="/services/">Leistungen</a><ArrowRight size={12} aria-hidden="true"/><span aria-current="page">Flughafentransfer FKB</span></nav>
        <div className="airport-hero-grid">
          <div className="airport-hero-copy">
            <div className="section-label section-label-light"><span className="section-label-bar"/>AB KARLSRUHE · BADEN-BADEN · RASTATT & UMGEBUNG</div>
            <h1>Flughafentransfer<br/><em>Karlsruhe/<wbr/>Baden-Baden</em><span>Flughafen FKB · Baden-Airpark</span></h1>
            <p>Ihr Taxi zum Baden-Airpark: ab Karlsruhe, Baden-Baden, Rastatt und Umgebung – oder nach der Landung wieder zurück. Für Einzelreisende, Familien und auch größere Gruppen nach Absprache. Preis auf Anfrage.</p>
            <div className="airport-hero-actions"><a href={business.phoneHref} className="btn btn-gold btn-large"><Phone size={18} aria-hidden="true"/>{business.phone}</a><a href="#buchen" className="btn btn-outline btn-large">Transfer anfragen <ArrowDown size={18} aria-hidden="true"/></a></div>
            <div className="airport-hero-facts"><span><Clock3 size={16} aria-hidden="true"/>24/7 telefonisch erreichbar</span><span><ShieldCheck size={16} aria-hidden="true"/>{business.yearsOfService} Jahre Erfahrung</span><span><UsersRound size={16} aria-hidden="true"/>Auch für größere Gruppen</span><span><Check size={16} aria-hidden="true"/>Hin- & Rückfahrt nach Absprache</span></div>
          </div>
          <div className="airport-route-card">
            <div className="airport-route-top"><span>IHRE VERBINDUNG ZUM FLUG</span><Plane size={23} aria-hidden="true"/></div>
            <div className="airport-route-code" aria-hidden="true">FKB</div>
            <div className="airport-route-points"><div><span className="route-point"/><span><strong>Karlsruhe · Baden-Baden · Rastatt</strong><small>Ihre Abholadresse und Umgebung</small></span></div><div><span className="route-point route-point--airport"/><span><strong>Karlsruhe/Baden-Baden</strong><small>Flughafen in Rheinmünster</small></span></div></div>
            <div className="airport-direction-links"><a href={`${airportTransfer.path}?richtung=zum-flughafen#buchen`}><PlaneTakeoff size={19} aria-hidden="true"/><span>Zum Flughafen</span><ArrowUpRight size={17} aria-hidden="true"/></a><a href={`${airportTransfer.path}?richtung=ab-flughafen#buchen`}><PlaneLanding size={19} aria-hidden="true"/><span>Abholung am FKB</span><ArrowUpRight size={17} aria-hidden="true"/></a></div>
            <p>Persönliche Vorbestellung · keine automatische Buchungsbestätigung</p>
          </div>
        </div>
      </div>
    </section>

    <section className="airport-booking-section" aria-label="Flughafentransfer anfragen">
      <div className="container-wide contact-priority-grid">
        <aside className="airport-preparation"><div className="section-label"><span className="section-label-bar"/>GUT VORBEREITET</div><h2>Ihr Transfer.<br/><em>Die Details zählen.</em></h2><p>Der FKB ist im Formular bereits vorausgewählt. Für eine Abholung am Flughafen wählen Sie oben die Rückrichtung.</p><ul><li><MapPin size={18} aria-hidden="true"/>Genaue Abhol- und Zieladresse</li><li><Plane size={18} aria-hidden="true"/>Flugnummer und Reisetermin</li><li><UsersRound size={18} aria-hidden="true"/>Fahrgäste und benötigte Kindersitze</li><li><Luggage size={18} aria-hidden="true"/>Koffer und besonderes Gepäck</li></ul><p className="airport-preparation-note">Für eine kurzfristige Fahrt bitte direkt anrufen. Das Formular bleibt in diesem Entwurf eine Vorschau ohne Versand.</p></aside>
        <div className="contact-inquiry">{children}</div>
      </div>
    </section>

    <section className="airport-routes-section" id="transfer-ablauf">
      <div className="container-wide">
        <div className="airport-section-heading"><div className="section-label"><span className="section-label-bar"/>HINFLIEGEN. HEIMKOMMEN.</div><h2>Ihr Taxi zum Flughafen<br/><em>Karlsruhe/Baden-Baden.</em></h2><p>Ob Urlaubsreise, Geschäftsflug oder Abholung nach der Rückkehr: Wir fahren Sie ab Karlsruhe, Baden-Baden, Rastatt und den umliegenden Orten zum FKB. Beide Fahrtrichtungen können Sie persönlich mit uns abstimmen.</p></div>
        <div className="airport-route-details">
          <article><PlaneTakeoff size={29} aria-hidden="true"/><span className="airport-detail-kicker">01 · VOR DEM ABFLUG</span><h3>Von Ihrer Adresse direkt zum FKB</h3><p>Wir holen Sie in Karlsruhe, Baden-Baden, Rastatt oder Umgebung an der vereinbarten Adresse ab und fahren Sie zum Flughafen Karlsruhe/Baden-Baden. Geben Sie bei der Anfrage die Abflugzeit an – nicht nur eine gewünschte Abholzeit. So können wir den Ablauf Ihrer Anreise gemeinsam besprechen.</p><p>Für einen frühen Flug stimmen Sie die Fahrt möglichst im Voraus ab. Berücksichtigen Sie die aktuellen Empfehlungen Ihrer Fluggesellschaft und des Flughafens für Check-in, Gepäckabgabe und Sicherheitskontrolle.</p><a href={`${airportTransfer.path}?richtung=zum-flughafen#buchen`} className="text-link">Hinfahrt vorbereiten <ArrowUpRight size={17} aria-hidden="true"/></a></article>
          <article><PlaneLanding size={29} aria-hidden="true"/><span className="airport-detail-kicker">02 · NACH DER LANDUNG</span><h3>Taxi ab Flughafen Karlsruhe/Baden-Baden</h3><p>Für Ihre vorbestellte Abholung am FKB vereinbaren wir Treffpunkt und Kontaktaufnahme persönlich. Teilen Sie uns Flugnummer, Ankunftszeit und Ihre Mobilnummer mit. Planen Sie auch die Zeit für Ausstieg und Gepäckausgabe ein.</p><p>Hat sich Ihr Flug verspätet oder geändert, rufen Sie uns bitte an. Die angepasste Abholzeit, mögliche Wartezeiten und deren Abrechnung klären wir direkt mit Ihnen.</p><a href={`${airportTransfer.path}?richtung=ab-flughafen#buchen`} className="text-link">Flughafenabholung vorbereiten <ArrowUpRight size={17} aria-hidden="true"/></a></article>
        </div>
      </div>
    </section>

    <section className="airport-price-section" id="transfer-preis">
      <div className="container-wide airport-price-layout">
        <div><div className="section-label"><span className="section-label-bar"/>PREIS AUF ANFRAGE</div><h2>Was kostet Ihr<br/><em>Flughafentransfer?</em></h2><p>Ob ab Karlsruhe, Baden-Baden oder Rastatt: Für eine konkrete Preisauskunft nennen Sie uns Startadresse, Reisetag, Personenzahl und Gepäck. Wir besprechen den Fahrpreis beziehungsweise die Abrechnungsgrundlage vor der Fahrt. Für Hin- und Rückfahrt können Sie beide Strecken zusammen anfragen.</p><p>Fragen Sie dabei auch nach möglichen Warte-, Park- oder Zusatzkosten. So ist klar, welche Leistungen für Ihre Fahrt vereinbart sind und Sie können Ihre Reisekosten besser planen.</p><a className="btn btn-ink" href={business.phoneHref}><Phone size={17} aria-hidden="true"/>Fahrpreis erfragen</a></div>
        <div className="airport-price-factors"><span>FÜR EINE KONKRETE PREISAUSKUNFT</span><div><strong>Start & Ziel</strong><small>Ihre genaue Adresse und die Fahrtrichtung</small></div><div><strong>Termin</strong><small>Reisetag, Abflug oder Ankunft, Rückfahrtwunsch</small></div><div><strong>Personen & Gepäck</strong><small>Benötigte Plätze, Koffer und besondere Anforderungen</small></div><div><strong>Vereinbarte Leistungen</strong><small>Abholung, Wartezeit und mögliche zusätzliche Kosten</small></div></div>
      </div>
    </section>

    <section className="airport-family-section">
      <div className="container-wide airport-family-layout">
        <figure><img src="/images/taxi-vw-touran-black.webp" alt="Illustrative Darstellung eines schwarzen VW Touran als Taxi für Familien und kleine Gruppen" width="1536" height="1024" loading="lazy"/><figcaption>Fahrzeugabbildung illustrativ. Fahrzeug und Gepäckraum nach Absprache.</figcaption></figure>
        <div><div className="section-label"><span className="section-label-bar"/>FÜR FAMILIEN & GRÖSSERE GRUPPEN</div><h2>Zusammen reisen.<br/><em>Gemeinsam ankommen.</em></h2><p>Unser größeres Fahrzeug bietet Platz für <strong>bis zu 6 Fahrgäste zusätzlich zum Fahrer</strong>. Sie reisen mit mehr Personen? Auch größere Gruppen können einen Flughafentransfer anfragen. Wir stimmen die passende Organisation und Verfügbarkeit persönlich mit Ihnen ab.</p><p>Nennen Sie uns einfach Ihre Gruppengröße sowie Anzahl und Größe der Koffer. Bei Kindern benötigen wir außerdem Alter und benötigten Kindersitz. Auch Kinderwagen, Rollator und sperrige Gepäckstücke stimmen wir vor der Fahrt mit Ihnen ab.</p><a href="#buchen" className="text-link">Fahrt für Ihre Gruppe anfragen <ArrowUpRight size={18} aria-hidden="true"/></a></div>
      </div>
    </section>

    <section className="airport-local-section">
      <div className="container-wide airport-local-layout"><div><div className="section-label"><span className="section-label-bar"/>IHR STARTPUNKT ZÄHLT</div><h2>Karlsruhe. Baden-Baden.<br/><em>Rastatt & Umgebung.</em></h2><p>Ob von zu Hause, vom Hotel oder nach einem Geschäftstermin: Wir organisieren Ihren Transfer zum FKB ab Ihrer vereinbarten Abholadresse. Unser Betriebssitz ist in Rastatt; die Fahrt kann auch in Karlsruhe, Baden-Baden und den umliegenden Orten starten.</p><ul className="airport-service-areas"><li><strong>Flughafentransfer ab Karlsruhe</strong><span>Privatadresse, Hotel oder Firmenadresse – Startpunkt und Abholzeit persönlich abstimmen.</span></li><li><strong>Flughafentransfer ab Baden-Baden</strong><span>Zum Baden-Airpark und wieder zurück, auch mit vorab geplanter Flughafenabholung.</span></li><li><strong>Flughafentransfer ab Rastatt & Umgebung</strong><span>Ab Ihrer Adresse oder Bahnhof Rastatt; weitere Abholorte einfach mit uns besprechen.</span></li></ul><a href="/leistungen/flughafenfahrten/" className="text-link">Weitere Flughafenfahrten <ArrowUpRight size={17} aria-hidden="true"/></a></div><aside><span className="airport-location-code">FKB</span><h3>Flughafen Karlsruhe/Baden-Baden</h3><p>Der Baden-Airpark liegt in Rheinmünster. Der Flughafen hat keinen direkten Bahnanschluss; es gibt auch Busverbindungen ab umliegenden Bahnhöfen.</p><p>Aktuelle Informationen zur Anreise und zur empfohlenen Ankunftszeit finden Sie direkt beim Flughafen.</p><a href={airportTransfer.officialHelpUrl} target="_blank" rel="noopener noreferrer">Offizielle Flughafeninformationen <ArrowUpRight size={15} aria-hidden="true"/></a><small>Taxi Adler ist ein unabhängiger Anbieter. Diese Seite ist kein Angebot des Flughafenbetreibers.</small></aside></div>
    </section>

    <section className="airport-faq-section" id="transfer-fragen"><div className="container-wide faq-layout"><div className="faq-left"><div className="section-label"><span className="section-label-bar"/>VOR DER FAHRT</div><h2>Fragen zu Ihrem<br/><em>Flughafentransfer.</em></h2><p>Die wichtigsten Antworten zu Vorbestellung, Flughafenabholung und Reisegepäck. Für Ihre konkrete Fahrt sind wir persönlich erreichbar.</p><a className="text-link" href={business.phoneHref}><Phone size={17} aria-hidden="true"/>{business.phone}</a></div><div className="faq-list">{airportTransfer.faq.map(item => <details className="faq-item" key={item.q}><summary><span>{item.q}</span><span className="faq-plus"><ChevronDown size={20} aria-hidden="true"/></span></summary><p>{item.a}</p></details>)}</div></div></section>
    <section className="airport-final-cta"><div className="container-wide"><div><span>KARLSRUHE · BADEN-BADEN · RASTATT & UMGEBUNG ↔ FKB</span><h2>Ihre nächste Reise<br/>beginnt mit <em>einem Anruf.</em></h2></div><div><a className="btn btn-gold btn-large" href={business.phoneHref}><Phone size={18} aria-hidden="true"/>{business.phone}</a><a className="text-link" href="#buchen">Oder Transfer vorbereiten <ArrowUpRight size={18} aria-hidden="true"/></a></div></div></section>
  </>;
}
