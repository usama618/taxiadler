import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowDown, ArrowRight, ArrowUpRight,
  CalendarDays, CarFront, Check, CheckCircle2,
  ChevronDown, Clock3, Copy, HeartPulse, Mail, MapPin, Menu, MessageCircle,
  Navigation2, Phone, ShieldCheck, Star, X
} from 'lucide-react';
import { business, paymentMethods, resolvePage, services, serviceUrl } from './content';
import { AboutPage, ContactPage, LegalPage, NotFoundPage, ServicePage, ServicesPage } from './Pages';
import AirportTransferPage from './AirportTransferPage';
import { airportInquiryDefaults, airportTransfer } from './airport';
import GoogleReviews from './GoogleReviews';
import { googleReviews } from './reviews';

const PHONE_DISPLAY = business.phone;
const PHONE_HREF = business.phoneHref;
const PRIVACY_URL = '/datenschutz/';
const ADDRESS = business.address;

const faqItems = [
  {
    q: 'Ist Taxi Adler rund um die Uhr erreichbar?',
    a: 'Ja. Sie erreichen unser Team 24 Stunden am Tag und sieben Tage die Woche. Für kurzfristige Fahrten rufen Sie uns bitte direkt an, damit wir die Verfügbarkeit persönlich klären können.'
  },
  {
    q: 'Kann ich eine Fahrt im Voraus anfragen?',
    a: 'Ja. Vereinbaren Sie Ihren Termin telefonisch mit uns. Abholort, Ziel, Uhrzeit, Personen und Gepäck stimmen wir gemeinsam ab. Im Formular können Sie Ihre Angaben vorab zusammenstellen; es versendet in diesem Entwurf noch keine Anfrage.'
  },
  {
    q: 'Sind auch wiederkehrende Krankenfahrten möglich?',
    a: 'Ja, Fahrten zu Dialyse, Bestrahlung, Chemotherapie oder anderen regelmäßigen Terminen können als Terminserie angefragt werden. Fragen zur Verordnung, Kostenübernahme und möglichen Direktabrechnung klären Sie bitte vor der ersten Fahrt.'
  },
  {
    q: 'Bekomme ich direkt einen verbindlichen Fahrpreis?',
    a: 'Den Fahrpreis beziehungsweise die Abrechnungsgrundlage besprechen Sie direkt mit unserem Team. Diese Formularvorschau berechnet keinen Fahrpreis und bestätigt keine Buchung.'
  },
  {
    q: 'Sind auch Fahrten für größere Gruppen möglich?',
    a: 'Ja. Auch Gruppen mit mehr als 6 Personen können eine Fahrt anfragen. Nennen Sie uns Ihre Gruppengröße, den Termin und das Gepäck; wir stimmen die passende Organisation und Verfügbarkeit persönlich mit Ihnen ab.'
  }
];

const emptyForm = {
  name: '', phone: '', email: '', pickup: '', destination: '', date: '', time: '',
  notes: '', privacy: false
};

function Brand({ footer = false }) {
  return (
    <a href="/" className={`brand ${footer ? 'brand-footer' : ''}`} aria-label="Taxi Adler Rastatt – zur Startseite">
      <img className="brand-logo" src="/images/taxi-adler-eagle-logo.png" alt="Taxi Adler Rastatt – Adlerlogo" width="1536" height="1024" decoding="async"/>
    </a>
  );
}

function SiteHeader({ page }) {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 35);
      const height = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setProgress(Math.max(0, Math.min(1, window.scrollY / height)));
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-lock', menuOpen);
    const closeOnEscape = event => {
      if (event.key === 'Escape') { setMenuOpen(false); toggleRef.current?.focus(); }
    };
    if (menuOpen) window.addEventListener('keydown', closeOnEscape);
    return () => { document.body.classList.remove('menu-lock'); window.removeEventListener('keydown', closeOnEscape); };
  }, [menuOpen]);

  function closeMenu() { setMenuOpen(false); }

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
      <div className="site-header-inner container-wide">
        <Brand />
        <nav id="main-navigation" className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Hauptnavigation">
          <a href="/services/" aria-current={['services', 'service'].includes(page) ? 'page' : undefined} onClick={closeMenu}>Leistungen</a>
          <a href="/ueber-uns/" aria-current={page === 'about' ? 'page' : undefined} onClick={closeMenu}>Über uns</a>
          <a href={airportTransfer.path} aria-current={page === 'airport' ? 'page' : undefined} onClick={closeMenu}>Flughafentransfer</a>
          <a href="/#fragen" onClick={closeMenu}>Fragen</a>
          <a href="/kontakt/" aria-current={page === 'contact' ? 'page' : undefined} onClick={closeMenu}>Kontakt</a>
          <a className="mobile-menu-phone" href={PHONE_HREF}><Phone size={17} /> {PHONE_DISPLAY}</a>
        </nav>
        <div className="header-actions">
          <a className="header-phone" href={PHONE_HREF}><Phone size={16} strokeWidth={2.5} /> <span>{PHONE_DISPLAY}</span></a>
          <a className="btn btn-gold btn-nav" href={['contact', 'airport'].includes(page) ? '#buchen' : '/#buchen'}>Taxi anfragen <ArrowUpRight size={17}/></a>
          <button ref={toggleRef} type="button" className="menu-toggle" aria-controls="main-navigation" aria-expanded={menuOpen} aria-label={menuOpen ? 'Menü schließen' : 'Menü öffnen'} onClick={() => setMenuOpen(v => !v)}>
            {menuOpen ? <X size={26}/> : <Menu size={26}/>}
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  const imageRef = useRef(null);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let scheduled = false;
    const onScroll = () => {
      if (scheduled || !imageRef.current) return;
      scheduled = true;
      window.requestAnimationFrame(() => {
        const value = Math.min(window.scrollY, window.innerHeight) * 0.14;
        if (imageRef.current) imageRef.current.style.transform = `translate3d(0, ${value}px, 0) scale(1.06)`;
        scheduled = false;
      });
    };
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <section className="hero" id="start" aria-label="Taxi Adler Rastatt">
      <div className="hero-image" ref={imageRef} aria-hidden="true" />
      <div className="hero-gradient" aria-hidden="true"/>
      <div className="hero-grain" aria-hidden="true"/>
      <div className="container-wide hero-content">
        <div className="hero-copy">
          <div className="hero-eyebrow enter-one"><span className="eyebrow-stroke"/> IHR TAXI IN RASTATT <span className="eyebrow-dot"/>{googleReviews.checkedAt && googleReviews.rating !== null ? <a href="#bewertungen" className="hero-review-link" aria-label={`${googleReviews.rating} von 5 bei Google – ${googleReviews.count} Bewertungen ansehen`}><Star size={12} fill="currentColor" aria-hidden="true"/>{new Intl.NumberFormat('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(googleReviews.rating)} / 5 AUF GOOGLE</a> : '24/7 ERREICHBAR'}</div>
          <h1 className="hero-heading enter-two">Sicher ans Ziel.<br/><em>Zu jeder Zeit.</em></h1>
          <p className="hero-subtitle enter-three"><strong>Seit {business.yearsOfService} Jahren</strong> bringt Sie Taxi Adler in Rastatt und der Region zuverlässig ans Ziel. Für alltägliche Wege, wichtige Termine und Ihre nächste Reise.</p>
          <div className="hero-ctas enter-four">
            <a href="#buchen" className="btn btn-gold btn-large">Fahrt anfragen <ArrowUpRight size={19} /></a>
            <a href={PHONE_HREF} className="btn btn-outline btn-large"><Phone size={18}/> Direkt anrufen</a>
          </div>
        </div>
        <div className="hero-bottom enter-four">
          <div className="hero-facts">
            <div><Clock3 size={22}/><span><strong>24 Stunden</strong><small>für Sie erreichbar</small></span></div>
            <div><ShieldCheck size={22}/><span><strong>{business.yearsOfService} Jahre Erfahrung</strong><small>in Rastatt & der Region</small></span></div>
            <div><CarFront size={24}/><span><strong>Auch für Gruppen</strong><small>Größe persönlich abstimmen</small></span></div>
          </div>
          <a href="#buchen" className="hero-scroll" aria-label="Zum Buchungsformular"><span>WEITER</span><ArrowDown size={21}/></a>
        </div>
      </div>
      <div className="hero-side-label" aria-hidden="true">RASTATT · BADEN-WÜRTTEMBERG</div>
    </section>
  );
}

function Field({label, icon: Icon, children, className = ''}) {
  return <label className={`field ${className}`}><span className="field-label">{Icon && <Icon size={15}/>} {label}</span>{children}</label>;
}

function ReviewModal({data, onClose}) {
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef(null);
  const fields = [
    ['Name',data.name], ['Telefon',data.phone], ['E-Mail',data.email],
    ['Abholort',data.pickup], ['Zielort',data.destination],
    ['Termin',`${new Intl.DateTimeFormat('de-DE').format(new Date(`${data.date}T12:00:00`))} · ${data.time} Uhr`],
    ...(data.notes ? [['Hinweise',data.notes]] : [])
  ];
  const text = `Fahrtanfrage Taxi Adler (Entwurf)\n${fields.map(([k,v])=>`${k}: ${v}`).join('\n')}\n\nDies ist ein Anfrageentwurf, keine bestätigte Buchung.`;
  async function copy() {
    try { await navigator.clipboard.writeText(text); setCopied(true); }
    catch { window.prompt('Bitte kopieren Sie die Fahrtanfrage:', text); }
  }
  useEffect(() => {
    const previousFocus = document.activeElement;
    const dialog = dialogRef.current;
    dialog?.querySelector('button')?.focus();
    const keyHandler = e => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && dialog) {
        const controls = dialog.querySelectorAll('a[href], button:not([disabled])');
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener('keydown',keyHandler);
    document.body.classList.add('modal-lock');
    return () => { window.removeEventListener('keydown',keyHandler); document.body.classList.remove('modal-lock'); previousFocus?.focus(); };
  },[onClose]);
  return (
    <div className="modal-backdrop" onMouseDown={e => {if(e.target === e.currentTarget) onClose();}} role="presentation">
      <div ref={dialogRef} className="review-modal" role="dialog" aria-modal="true" aria-labelledby="review-title">
        <button className="modal-close" onClick={onClose} aria-label="Schließen" type="button"><X size={21}/></button>
        <div className="modal-logo"><CheckCircle2 size={26}/></div>
        <div className="kicker dark-kicker">BUCHUNGSVORSCHAU</div>
        <h3 id="review-title">Ihre Fahrtanfrage im Überblick.</h3>
        <p className="modal-intro">Die Angaben wurden <strong>nicht versendet</strong> und es wurde <strong>keine Fahrt gebucht</strong>. Sie können den Entwurf kopieren und Taxi Adler telefonisch kontaktieren.</p>
        <dl className="review-data">
          {fields.map(([key,value])=><div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}
        </dl>
        <div className="review-actions">
          <button type="button" className="btn btn-ink" onClick={copy}>{copied ? <Check size={17}/> : <Copy size={17}/>} {copied ? 'Anfrage kopiert' : 'Anfrage kopieren'}</button>
          <a href={PHONE_HREF} className="btn btn-gold"><Phone size={16}/> Jetzt anrufen</a>
        </div>
      </div>
    </div>
  );
}

function BookingForm({form, setForm, selectedService}) {
  const [error,setError] = useState('');
  const [review,setReview] = useState(false);
  const handle = (key,value) => { setForm(previous => ({...previous,[key]:value})); setError(''); };
  const today = new Date();
  const localToday = new Date(today.getTime()-today.getTimezoneOffset()*60000).toISOString().slice(0,10);
  const formRef = useRef(null);

  function submit(e) {
    e.preventDefault();
    const time = new Date(`${form.date}T${form.time}`);
    if (Number.isNaN(time.getTime()) || time.getTime() <= Date.now()) {
      setError('Bitte wählen Sie ein gültiges Datum und eine Uhrzeit in der Zukunft.');
      return;
    }
    if(!form.privacy) { setError('Bitte akzeptieren Sie die Datenschutzhinweise.'); return; }
    setReview(true);
  }

  return (
    <section className="booking-section" id="buchen" aria-labelledby="booking-heading">
      <div className="container-wide booking-container">
        <div className="booking-card reveal" ref={formRef}>
          <div className="booking-card-top">
            <div>
              <div className="kicker dark-kicker"><span className="little-line"/> IHR WEG BEGINNT HIER</div>
              <h2 id="booking-heading">Ihre nächste Fahrt <span>anfragen.</span></h2>
            </div>
            <div className="booking-side-note"><span className="booking-round-icon"><Navigation2 size={20}/></span><span>Einfach planen.<br/>Direkt Kontakt aufnehmen.</span></div>
          </div>
          <form className="booking-form" onSubmit={submit}>
            <div className="form-grid">
              <div className="form-column">
                <Field label="Vor- und Nachname *" icon={CheckCircle2}>
                  <input autoComplete="name" required value={form.name} onChange={e=>handle('name',e.target.value)} placeholder="Ihr vollständiger Name" maxLength={120}/>
                </Field>
                <Field label="Telefonnummer *" icon={Phone}>
                  <input type="tel" autoComplete="tel" required value={form.phone} onChange={e=>handle('phone',e.target.value)} placeholder="z. B. 0176 12345678" maxLength={35}/>
                </Field>
                <Field label="E-Mail-Adresse *" icon={Mail}>
                  <input type="email" autoComplete="email" required value={form.email} onChange={e=>handle('email',e.target.value)} placeholder="name@beispiel.de" maxLength={160}/>
                </Field>
              </div>
              <div className="form-column">
                <Field label="Von · Abholort *" icon={MapPin}>
                  <input autoComplete="street-address" required value={form.pickup} onChange={e=>handle('pickup',e.target.value)} placeholder="Straße, Hausnummer, PLZ, Ort" maxLength={230}/>
                </Field>
                <Field label="Nach · Zielort *" icon={Navigation2}>
                  <input required value={form.destination} onChange={e=>handle('destination',e.target.value)} placeholder="Straße, Hausnummer, PLZ, Ort" maxLength={230}/>
                </Field>
                <div className="form-date-time">
                  <Field label="Reisedatum *" icon={CalendarDays}>
                    <input type="date" required min={localToday} value={form.date} onChange={e=>handle('date',e.target.value)}/>
                  </Field>
                  <Field label="Uhrzeit *" icon={Clock3}>
                    <input type="time" required value={form.time} onChange={e=>handle('time',e.target.value)}/>
                  </Field>
                </div>
              </div>
            </div>
            <div className="form-extras">
              <Field label="Hinweise (optional)" className="form-notes">
                <input value={form.notes} onChange={e=>handle('notes',e.target.value)} placeholder="Gruppengröße, Flugnummer, Gepäck, Wünsche …" maxLength={400}/>
              </Field>
            </div>
            {selectedService && <div className="service-selected"><Check size={16}/> Gewählte Leistung: <strong>{selectedService}</strong></div>}
            <div className="form-bottom">
              <div className="form-privacy">
                <label className="check-wrapper"><input type="checkbox" checked={form.privacy} onChange={e=>handle('privacy',e.target.checked)} required/><span>Ich habe die <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer">Datenschutzhinweise</a> gelesen. Mir ist bewusst, dass diese Vorschau keine Anfrage übermittelt. *</span></label>
                <p className="demo-notice">Vorschau: Das Formular versendet noch keine Daten und bestätigt keine Buchung.</p>
                {error && <p className="form-error" role="alert">{error}</p>}
              </div>
              <button className="btn btn-gold btn-submit" type="submit">Angaben prüfen <ArrowUpRight size={20}/></button>
            </div>
          </form>
        </div>
        <div className="booking-afterline"><span><ShieldCheck size={17}/> Persönlicher Fahrdienst</span><span><Clock3 size={17}/> 24/7 erreichbar</span><span><MapPin size={17}/> Rastatt und Umgebung</span></div>
      </div>
      {review && <ReviewModal data={form} onClose={()=>setReview(false)}/>}
    </section>
  );
}

function SectionLabel({children,light=false}) { return <div className={`section-label ${light?'section-label-light':''}`}><span className="section-label-bar"/>{children}</div>; }

function ServiceCards() {
  return (
    <section className="services-section" id="leistungen" aria-labelledby="services-heading">
      <div className="container-wide">
        <div className="services-intro reveal">
          <div>
            <SectionLabel light>UNSERE LEISTUNGEN</SectionLabel>
            <h2 id="services-heading">Für jeden Weg.<br/><em>Die passende Fahrt.</em></h2>
          </div>
          <p>Ob zum Flughafen, zum nächsten Termin oder einfach durch die Stadt: Wir sind für Ihre Wege da.</p>
        </div>
        <div className="services-grid">
          {services.map((service,index)=>{
            const Icon=service.icon;
            return (
              <a key={service.id} href={service.landingUrl || serviceUrl(service)} className={`service-card reveal ${service.className||''}`} style={{'--stagger':`${(index%3)*90}ms`}} aria-label={`${service.title} – Informationen ansehen`}>
                <img alt="" className="service-photo" src={service.photo} loading="lazy" onError={e=>{ if(!e.currentTarget.dataset.fallback){e.currentTarget.dataset.fallback='1'; e.currentTarget.src=service.fallback;} }} />
                <span className="service-overlay"/>
                <span className="service-card-top"><span>{service.no} / 06</span><ArrowUpRight size={20}/></span>
                <span className="service-card-content">
                  <span className="service-icon"><Icon size={25} strokeWidth={1.8}/></span>
                  <span className="service-subtitle">{service.subtitle}</span>
                  <strong>{service.title}</strong>
                  <span className="service-description">{service.description}</span>
                </span>
              </a>
            );
          })}
        </div>
        <div className="service-footnote reveal"><span>Auch für kurzfristige Fahrten:</span><a href={PHONE_HREF}>Rufen Sie uns direkt an <ArrowUpRight size={17}/></a></div>
      </div>
    </section>
  );
}

function VehicleOptions() {
  return (
    <div className="container-wide vehicle-options reveal" id="fahrzeuge">
      <div className="vehicle-options-photos">
        <img src="/images/taxi-adler-mercedes-fleet.webp" alt="Mercedes-Benz E-Klasse von Taxi Adler – KI-Visualisierung auf Basis des Fahrzeugfotos" width="1536" height="1024" loading="lazy"/>
        <img src="/images/taxi-vw-touran-black.webp" alt="Schwarzer VW Touran als Taxi – illustrative Darstellung" width="1536" height="1024" loading="lazy"/>
      </div>
      <div className="vehicle-options-copy">
        <span className="section-label">GEMEINSAM UNTERWEGS</span>
        <h3>Platz für Ihre Fahrt.</h3>
        <p>Unser größeres Fahrzeug bietet Platz für <strong>bis zu 6 Fahrgäste zusätzlich zum Fahrer</strong>. Auch Fahrten für größere Gruppen sind auf Anfrage möglich. Nennen Sie uns Ihre Gruppengröße und das Gepäck – wir stimmen die passende Organisation und Verfügbarkeit persönlich mit Ihnen ab.</p>
        <a href="/#buchen" className="text-link">Fahrt anfragen <ArrowUpRight size={19}/></a>
        <small>Fahrzeugabbildungen illustrativ. Verfügbarkeit bitte bei der Anfrage abstimmen.</small>
      </div>
    </div>
  );
}

function Benefits() {
  return (
    <section className="benefits-section" id="warum">
      <div className="container-wide benefits-layout">
        <div className="benefits-left reveal">
          <SectionLabel>WARUM TAXI ADLER</SectionLabel>
          <h2>Nicht einfach<br/>nur <em>von A nach B.</em></h2>
          <p>Seit {business.yearsOfService} Jahren begleiten wir Ihre Wege in Rastatt und der Region. Ob Alltag oder wichtiger Termin: Wir bringen Sie persönlich, flexibel und zuverlässig ans Ziel.</p>
          <a href="/ueber-uns/" className="text-link">Taxi Adler kennenlernen <ArrowUpRight size={19}/></a>
        </div>
        <div className="benefits-right">
          <div className="benefit-item reveal"><span className="benefit-number">01</span><span className="benefit-symbol"><Clock3 size={24}/></span><div><h3>Rund um die Uhr</h3><p>24 Stunden am Tag, sieben Tage die Woche erreichbar.</p></div><ArrowUpRight className="benefit-end" size={18}/></div>
          <div className="benefit-item reveal"><span className="benefit-number">02</span><span className="benefit-symbol"><MapPin size={24}/></span><div><h3>In Ihrer Nähe</h3><p>Ihr regionaler Taxidienst in Rastatt und Umgebung.</p></div><ArrowUpRight className="benefit-end" size={18}/></div>
          <div className="benefit-item reveal"><span className="benefit-number">03</span><span className="benefit-symbol"><HeartPulse size={24}/></span><div><h3>Für wichtige Termine</h3><p>Von der Alltagsfahrt bis zur regelmäßigen Krankenfahrt.</p></div><ArrowUpRight className="benefit-end" size={18}/></div>
          <div className="benefit-item reveal"><span className="benefit-number">04</span><span className="benefit-symbol"><Phone size={24}/></span><div><h3>Direkt erreichbar</h3><p>Ein Anruf genügt, um Ihre Fahrt persönlich zu besprechen.</p></div><ArrowUpRight className="benefit-end" size={18}/></div>
        </div>
      </div>
      <VehicleOptions />
    </section>
  );
}

function Statement() {
  return (
    <section className="rastatt-section" id="rastatt" aria-labelledby="rastatt-heading">
      <div className="container-wide">
        <div className="rastatt-intro reveal">
          <div><SectionLabel>HIER SIND WIR ZU HAUSE</SectionLabel><h2 id="rastatt-heading">Ihre Stadt.<br/><em>Unser Weg.</em></h2></div>
          <p>Vom Bahnhof in die Stadt, vom Schloss nach Hause. Wir verbinden die Orte in Rastatt mit den Menschen, die hier unterwegs sind.</p>
        </div>
        <div className="rastatt-grid">
          <article className="rastatt-card reveal">
            <div className="rastatt-photo"><img src="/images/rastatt-schloss-enhanced.webp" alt="Das Residenzschloss Rastatt mit seiner barocken Fassade und dem Ehrenhof" loading="lazy" width="1666" height="944"/><span><MapPin size={14}/> IM HERZEN DER STADT</span></div>
            <div className="rastatt-card-body"><div><span className="rastatt-kicker">RASTATT ENTDECKEN</span><h3>Ein Stück Heimat.</h3><p>Zum Residenzschloss, in die Innenstadt oder weiter in die Region – wir bringen Sie an Ihr Ziel.</p></div><a href="#buchen" className="text-link" aria-label="Stadtfahrt in Rastatt anfragen">Stadtfahrt anfragen <ArrowUpRight size={19}/></a></div>
            <p className="rastatt-credit">Residenzschloss · <a href="https://commons.wikimedia.org/wiki/File:Residenzschloss_Rastatt.jpg" target="_blank" rel="noopener noreferrer">Harke / Wikimedia Commons</a> · <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 3.0</a> · KI-bearbeitet</p>
          </article>
          <article className="rastatt-card reveal">
            <div className="rastatt-photo"><img src="/images/rastatt-bahnhof-enhanced.webp" alt="Der Bahnhof Rastatt mit historischem Empfangsgebäude, Uhr und Bahnhofsvorplatz" loading="lazy" width="1784" height="882"/><span><Navigation2 size={14}/> GUT ANKOMMEN. WEITERKOMMEN.</span></div>
            <div className="rastatt-card-body"><div><span className="rastatt-kicker">IHRE VERBINDUNG VOR ORT</span><h3>Hier geht’s weiter.</h3><p>Ihre Fahrt zum Bahnhof oder von dort weiter. Stimmen Sie Abholzeit und Treffpunkt direkt mit uns ab.</p></div><a href="#buchen" className="text-link" aria-label="Bahnhofsfahrt in Rastatt anfragen">Bahnhofsfahrt anfragen <ArrowUpRight size={19}/></a></div>
            <p className="rastatt-credit">Bahnhof Rastatt · <a href="https://commons.wikimedia.org/wiki/File:Rastatt-Bahnhof-10-2023-gje.jpg" target="_blank" rel="noopener noreferrer">Gerd Eichmann / Wikimedia Commons</a> · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a> · KI-bearbeitet</p>
          </article>
        </div>
      </div>
    </section>
  );
}



function Steps() {
  const steps = [
    {
      no:'01', icon: MapPin, title:'Route eingeben',
      text:'Tragen Sie Abholort, Ziel und Ihren Wunschtermin übersichtlich in das Formular ein.',
      image:'/images/step-route.svg', imageAlt:'Illustration einer Route mit Start- und Zielpunkt',
      tag:'IHR STARTPUNKT', figure:'01 — ROUTE'
    },
    {
      no:'02', icon: CheckCircle2, title:'Angaben prüfen',
      text:'Prüfen Sie Ihre Eingaben in der Vorschau und übernehmen Sie den Anfrageentwurf.',
      image:'/images/step-check.svg', imageAlt:'Illustration einer übersichtlichen Fahrtanfrage mit Checkliste',
      tag:'ALLES IM BLICK', figure:'02 — DETAILS'
    },
    {
      no:'03', icon: Phone, title:'Fahrt abstimmen',
      text:'Kontaktieren Sie Taxi Adler telefonisch, um Verfügbarkeit und Fahrt verbindlich zu klären.',
      image:'/images/step-call.svg', imageAlt:'Illustration eines Telefonats mit Taxi und Funkwellen',
      tag:'PERSÖNLICHER KONTAKT', figure:'03 — KONTAKT'
    }
  ];
  return (
    <section className="steps-section" id="ablauf" aria-labelledby="steps-heading">
      <div className="steps-ambient" aria-hidden="true" />
      <div className="container-wide steps-container">
        <div className="steps-intro reveal">
          <div className="steps-heading">
            <SectionLabel>UNTERWEGS IN DREI SCHRITTEN</SectionLabel>
            <h2 id="steps-heading">So einfach kann<br/><em>es losgehen.</em></h2>
          </div>
          <p className="steps-lead">Von der ersten Idee bis zum persönlichen Kontakt: Drei klare Schritte, ein entspanntes Gefühl.</p>
        </div>
        <div className="steps-track reveal" aria-hidden="true">
          <svg viewBox="0 0 1200 42" preserveAspectRatio="none">
            <path className="steps-track-base" d="M0 21 H1200" />
            <path className="steps-track-active" d="M0 21 H1200" />
          </svg>
          <span className="track-point track-one"/><span className="track-point track-two"/><span className="track-point track-three"/>
        </div>
        <div className="steps-list">
          {steps.map((step,index)=>{
            const Icon = step.icon;
            return (
              <article key={step.no} className="step-card reveal" style={{'--stagger':`${index*130}ms`}}>
                <div className="step-top">
                  <span className="step-icon"><Icon size={25} strokeWidth={1.8}/></span>
                  <span className="step-no">SCHRITT {step.no}</span>
                </div>
                <div className="step-visual">
                  <img src={step.image} alt={step.imageAlt} loading="lazy" width="920" height="520"/>
                  <span className="step-visual-label">{step.figure}</span>
                  <span className="step-visual-sheen" aria-hidden="true"/>
                </div>
                <div className="step-body">
                  <span className="step-kicker">{step.tag}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
                <span className="step-corner" aria-hidden="true"><ArrowUpRight size={19}/></span>
              </article>
            );
          })}
        </div>
        <div className="steps-bottom reveal">
          <p className="steps-disclaimer"><ShieldCheck size={19} aria-hidden="true" /> <span><strong>Wichtig:</strong> Die Online-Anfrage ist derzeit eine Vorschau und wird nicht automatisch versendet. Eine verbindliche Fahrt vereinbaren Sie direkt unter <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>.</span></p>
          <a href="#buchen" className="steps-cta">Fahrtanfrage vorbereiten <ArrowUpRight size={19}/></a>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section className="faq-section" id="fragen">
      <div className="container-wide faq-layout">
        <div className="faq-left reveal"><SectionLabel>HÄUFIGE FRAGEN</SectionLabel><h2>Gut zu<br/><em>wissen.</em></h2><p>Noch Fragen zu Ihrer Fahrt? Unser Team hilft Ihnen gerne persönlich weiter.</p><a className="text-link" href={PHONE_HREF}>Jetzt anrufen <ArrowUpRight size={18}/></a></div>
        <div className="faq-list reveal">
          {faqItems.map((item,i)=><details key={item.q} className="faq-item" open={i===0}><summary><span>{item.q}</span><span className="faq-plus"><ChevronDown size={20}/></span></summary><p>{item.a}</p></details>)}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="contact-section" id="kontakt">
      <div className="contact-photo" aria-hidden="true"/>
      <div className="container-wide contact-layout">
        <div className="reveal"><SectionLabel light>WIR SIND FÜR SIE DA</SectionLabel><h2>Ihr Weg.<br/><em>Ein Anruf.</em></h2><p>Sie möchten direkt mit uns sprechen? Wir sind rund um die Uhr für Sie erreichbar.</p></div>
        <div className="contact-actions reveal"><a href={PHONE_HREF} className="contact-number"><span><Phone size={24}/></span>{PHONE_DISPLAY}<ArrowUpRight size={29}/></a><a href={business.whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline"><MessageCircle size={18} aria-hidden="true"/>Über WhatsApp schreiben</a><a href="/kontakt/" className="btn btn-gold">Kontakt & Fahrtanfrage <ArrowUpRight size={18}/></a></div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <>
    <section className="payment-methods" aria-labelledby="payment-methods-heading">
      <div className="container-wide payment-methods-layout">
        <h2 id="payment-methods-heading">Zahlungsarten</h2>
        <ul className="payment-methods-logos" aria-label="Zahlungsarten wie auf unserer bisherigen Website">{paymentMethods.map(method => <li key={method.file}><img src={`/images/payments/${method.file}`} alt={method.name} width={method.width} height={method.height} loading="lazy" decoding="async"/></li>)}</ul>
      </div>
    </section>
    <footer className="footer">
      <div className="container-wide footer-main">
        <div className="footer-about"><Brand footer/><p>Seit {business.yearsOfService} Jahren Ihr Taxiunternehmen in Rastatt. Für alltägliche Wege, wichtige Termine und individuelle Fahrtanfragen.</p><a className="footer-phone" href={PHONE_HREF}><Phone size={17}/>{PHONE_DISPLAY}</a></div>
        <div className="footer-column"><h3>Navigation</h3><a href="/">Startseite</a><a href="/#buchen">Fahrt anfragen</a><a href="/services/">Leistungen</a><a href="/ueber-uns/">Über uns</a><a href="/#bewertungen">Google-Bewertungen</a><a href="/#fragen">Fragen</a><a href="/kontakt/">Kontakt</a></div>
        <div className="footer-column"><h3>Leistungen</h3><a href={airportTransfer.path}>Flughafentransfer FKB</a>{services.map(service => <a key={service.id} href={serviceUrl(service)}>{service.title}</a>)}</div>
        <div className="footer-column"><h3>Kontakt</h3><span className="footer-address"><MapPin size={17}/>{ADDRESS}</span><a href={PHONE_HREF}><Phone size={17}/>{PHONE_DISPLAY}</a><a href={business.whatsappUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} aria-hidden="true"/>WhatsApp: {business.mobile}</a><a href={`mailto:${business.email}`}><Mail size={17}/>{business.email}</a><span className="availability"><span/>24/7 erreichbar</span></div>
      </div>
      <div className="container-wide footer-bottom"><span>© {new Date().getFullYear()} Taxi Adler Rastatt · HTML-Entwurf</span><span><a href="/impressum/">Impressum</a><a href={PRIVACY_URL}>Datenschutz</a></span></div>
    </footer>
    </>
  );
}

function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 850);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive:true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <button type="button" className={`back-to-top ${visible?'shown':''}`} tabIndex={visible?0:-1}
      aria-label="Zurück nach oben" onClick={() => window.scrollTo({ top:0, behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth' })}>
      <ArrowUpRight size={19} aria-hidden="true"/>
      <span>OBEN</span>
    </button>
  );
}

export default function App({ pathname = window.location.pathname, search = window.location.search }) {
  const page = resolvePage(pathname);
  const isAirport = page.type === 'airport';
  const selected = services.find(service => service.id === (isAirport ? 'flughafen' : new URLSearchParams(search).get('leistung')));
  const [form,setForm] = useState(() => ({ ...emptyForm, notes: selected ? `Leistung: ${selected.title}` : '', ...(isAirport ? airportInquiryDefaults(search) : {}) }));
  const selectedService = isAirport ? 'Flughafentransfer Karlsruhe/Baden-Baden (FKB)' : selected?.title || '';

  useEffect(() => {
    if (!isAirport) return;
    const previousTitle = document.title;
    const description = document.querySelector('meta[name="description"]');
    const previousDescription = description?.content;
    document.title = airportTransfer.title;
    if (description) description.content = airportTransfer.description;
    return () => { document.title = previousTitle; if (description) description.content = previousDescription; };
  }, [isAirport]);

  useEffect(() => {
    const anchor = window.location.hash.slice(1);
    if (anchor) document.getElementById(anchor)?.scrollIntoView({ behavior: 'instant' });
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));
      return;
    }
    const observer = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}});
    },{threshold:0.08,rootMargin:'0px 0px -24px 0px'});
    document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
    return ()=>observer.disconnect();
  },[]);

  return (
    <>
      <a className="skip-link" href="#hauptinhalt">Zum Inhalt springen</a>
      <SiteHeader page={page.type}/>
      <main id="hauptinhalt" className={page.type === 'home' ? 'home-page' : 'inner-page'}>
        {page.type === 'home' && <>
        <Hero />
        <BookingForm form={form} setForm={setForm} selectedService={selectedService}/>
        <GoogleReviews/>
        <ServiceCards/>
        <Benefits />
        <Statement />
        <Steps />
        <Faq />
        <Contact />
        </>}
        {page.type === 'services' && <><ServicesPage><ServiceCards/></ServicesPage><Contact/></>}
        {page.type === 'service' && <><ServicePage service={page.service}/><Contact/></>}
        {page.type === 'about' && <><AboutPage><VehicleOptions/></AboutPage><Contact/></>}
        {page.type === 'contact' && <ContactPage><BookingForm form={form} setForm={setForm} selectedService={selectedService}/></ContactPage>}
        {isAirport && <AirportTransferPage><BookingForm form={form} setForm={setForm} selectedService={selectedService}/></AirportTransferPage>}
        {page.type === 'imprint' && <LegalPage/>}
        {page.type === 'privacy' && <LegalPage privacy/>}
        {page.type === 'not-found' && <NotFoundPage/>}
      </main>
      <Footer />
      <BackToTop />
      <div className="mobile-fixed-actions"><a href={PHONE_HREF}><Phone size={17}/> Anrufen</a><a href={business.whatsappUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} aria-hidden="true"/> WhatsApp</a><a href={['contact', 'airport'].includes(page.type) ? '#buchen' : '/#buchen'}><CalendarDays size={17}/> Anfragen</a></div>
    </>
  );
}
