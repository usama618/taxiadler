import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, MessageSquareQuote, Pause, Play, Star } from 'lucide-react';
import { business } from './content';
import { googleReviews } from './reviews';

function ReviewCarousel({ reviews }) {
  const trackRef = useRef(null);
  const [position, setPosition] = useState(0);
  const [visible, setVisible] = useState(3);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const last = Math.max(0, reviews.length - visible);

  function goTo(index) {
    const track = trackRef.current;
    const card = track?.firstElementChild;
    if (!card) return;
    const step = card.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap);
    track.scrollTo({ left: index * step, behavior: reducedMotion ? 'instant' : 'smooth' });
  }

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    const resize = new ResizeObserver(() => {
      setVisible(Number(getComputedStyle(track).getPropertyValue('--review-columns')) || 3);
    });
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.2 });
    resize.observe(track);
    observer.observe(track);
    return () => { resize.disconnect(); observer.disconnect(); };
  }, []);

  useEffect(() => {
    if (paused || hovered || focused || reducedMotion || !inView || last === 0) return;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      const track = trackRef.current;
      const step = track.firstElementChild.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap);
      const current = Math.round(track.scrollLeft / step);
      track.scrollTo({ left: (current >= last ? 0 : current + 1) * step, behavior: 'smooth' });
    }, 5000);
    return () => window.clearInterval(timer);
  }, [paused, hovered, focused, reducedMotion, inView, last]);

  return <div className="review-carousel" role="region" aria-roledescription="Karussell" aria-label="Google-Bewertungen"
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
    <div className="google-review-cards" id="review-carousel-track" ref={trackRef} tabIndex={0} aria-label="Bewertungen, horizontal scrollbar"
      onScroll={event => {
        const track = event.currentTarget;
        const step = track.firstElementChild.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap);
        setPosition(Math.min(last, Math.max(0, Math.round(track.scrollLeft / step))));
      }} onKeyDown={event => {
        if (event.target !== event.currentTarget || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? last : position + (event.key === 'ArrowRight' ? 1 : -1);
        goTo(Math.min(last, Math.max(0, next)));
      }}>
      {reviews.map((review, index) => <figure className="google-review-card" key={review.author} role="group" aria-roledescription="Bewertung" aria-label={`${index + 1} von ${reviews.length}`}>
        <div className="review-stars" aria-label={`${review.rating} von 5 Sternen`}>{Array.from({ length: review.rating }, (_, star) => <Star size={15} fill="currentColor" key={star} aria-hidden="true"/>)}</div>
        <blockquote><p>„{review.text}“</p></blockquote>
        <figcaption><strong>{review.author}</strong><a href={review.url} target="_blank" rel="noopener noreferrer" aria-label={`Bewertung von ${review.author} auf Google lesen`}>Auf Google lesen <ArrowUpRight size={14} aria-hidden="true"/></a></figcaption>
      </figure>)}
    </div>
    {last > 0 && <div className="review-carousel-controls">
      <div className="review-carousel-arrows">
        <button type="button" aria-label="Vorherige Bewertungen" aria-controls="review-carousel-track" onClick={() => goTo(position <= 0 ? last : position - 1)}><ChevronLeft size={19}/></button>
        <button type="button" aria-label="Nächste Bewertungen" aria-controls="review-carousel-track" onClick={() => goTo(position >= last ? 0 : position + 1)}><ChevronRight size={19}/></button>
      </div>
      <div className="review-carousel-dots" aria-label="Position auswählen">{Array.from({ length: last + 1 }, (_, index) => <button type="button" key={index} aria-label={`Ab Bewertung ${index + 1} anzeigen`} aria-current={position === index ? 'true' : undefined} onClick={() => goTo(index)}><span/></button>)}</div>
      {!reducedMotion && <button type="button" className="review-carousel-pause" aria-label={paused ? 'Automatischen Wechsel starten' : 'Automatischen Wechsel pausieren'} aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? <Play size={15}/> : <Pause size={15}/>}<span>{paused ? 'Abspielen' : 'Pause'}</span></button>}
    </div>}
  </div>;
}

export default function GoogleReviews() {
  const hasSummary = googleReviews.checkedAt && Number.isFinite(googleReviews.rating) && googleReviews.rating >= 1 && googleReviews.rating <= 5 && Number.isInteger(googleReviews.count) && googleReviews.count > 0;
  const excerpts = googleReviews.checkedAt ? googleReviews.excerpts : [];

  return (
    <section className="google-reviews-section" id="bewertungen" aria-labelledby="reviews-heading">
      <div className="container-wide">
        <div className="google-reviews-layout">
          <div className="google-reviews-intro">
            <div className="section-label"><span className="section-label-bar"/>ERFAHRUNGEN UNSERER FAHRGÄSTE</div>
            <h2 id="reviews-heading">{business.yearsOfService} Jahre unterwegs.<br/><em>Ihre Meinung zählt.</em></h2>
            <p>Seit {business.yearsOfService} Jahren ist Taxi Adler in Rastatt und der Region für Sie da. Lesen Sie die Erfahrungen unserer Fahrgäste direkt auf Google.</p>
          </div>
          <div className="google-reviews-source">
            <span className="reviews-source-symbol"><MessageSquareQuote size={27} aria-hidden="true"/></span>
            <div className="reviews-source-copy"><span className="reviews-source-label">GOOGLE REZENSIONEN</span>
              {hasSummary ? <div className="google-rating-summary"><strong>{new Intl.NumberFormat('de-DE', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(googleReviews.rating)}<small> / 5</small></strong><span>aus {googleReviews.count} Bewertungen</span></div> : <><h3>Was Fahrgäste über uns sagen.</h3><p>Die aktuellen Bewertungen und vollständigen Rezensionen finden Sie in unserem Google-Unternehmensprofil.</p></>}
              <a href={business.googleReviewsUrl} target="_blank" rel="noopener noreferrer" className="text-link">Bewertungen auf Google ansehen <ArrowUpRight size={17} aria-hidden="true"/></a>
            </div>
          </div>
        </div>
        {excerpts.length > 0 && <><p className="reviews-selection-label">Ausgewählte Rezensionen · Auszüge aus Google-Bewertungen</p><ReviewCarousel reviews={excerpts}/></>}
      </div>
    </section>
  );
}
