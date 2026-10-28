import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowDown, Compass, Landmark, Flame, MapPin, ExternalLink } from 'lucide-react';
import { PageView } from './Navbar';
import { CONFERENCE_LETTERS } from '../data/conferenceData';

export const DEFAULT_TARGET_DATE = '2026-12-04T09:00:00+03:00';
interface HomePageProps { onNavigate: (page: PageView) => void; targetDate?: string; }
const calculateTimeLeft = (target: string) => {
  const diff = Math.max(0, new Date(target).getTime() - Date.now()) || 0;
  return [Math.floor(diff / 86400000), Math.floor(diff / 3600000) % 24, Math.floor(diff / 60000) % 60, Math.floor(diff / 1000) % 60];
};
export const HomePage: React.FC<HomePageProps> = ({ onNavigate, targetDate = DEFAULT_TARGET_DATE }) => {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDate));
  const curtainRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<HTMLElement>(null);
  useEffect(() => {
    setTimeLeft(calculateTimeLeft(targetDate));
    const interval = window.setInterval(() => setTimeLeft(calculateTimeLeft(targetDate)), 1000);
    return () => window.clearInterval(interval);
  }, [targetDate]);
  useEffect(() => {
    let frame = 0;
    let position = 0;
    let velocity = 0;
    let target = 0;
    let lastTime = 0;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const draw = (time: number) => {
      const dt = Math.min((time - (lastTime || time - 16)) / 1000, 0.032);
      lastTime = time;
      // A damped spring gives the fabric weight without tying its movement
      // directly to individual wheel events. Integrate at small, stable steps.
      const steps = Math.ceil(dt / 0.008);
      const step = dt / steps;
      for (let i = 0; i < steps; i++) {
        velocity += ((target - position) * 95 - velocity * 19) * step;
        position += velocity * step;
      }
      const p = reducedMotion.matches ? 1 : Math.min(1, Math.max(0, position));
      const eased = p * p * (3 - 2 * p);
      const style = curtainRef.current?.style;
      if (style) {
        style.setProperty('--curtain-progress', String(eased));
        style.setProperty('--curtain-sway', `${Math.max(-1.2, Math.min(1.2, velocity * 0.7))}deg`);
        style.setProperty('--letter-opacity', String(Math.min(1, Math.max(0, (p - 0.2) / 0.8))));
        // The curved inner edge gathers at the side while the hem hangs freely.
        const top = 1 - eased * 0.12;
        const waist = 1 - eased * 0.73;
        const hem = 1 - eased * 0.54;
        const path = `M0 0 H${top} C${top} .22, ${waist} .36, ${waist} .62 C${waist} .8, ${hem} .92, ${hem} .98 Q${hem * 0.5} 1.015, 0 .985 Z`;
        curtainRef.current?.querySelector('#curtain-fabric-shape')?.setAttribute('d', path);
      }
      if (Math.abs(target - position) > 0.0001 || Math.abs(velocity) > 0.0001) {
        frame = window.requestAnimationFrame(draw);
      } else {
        frame = 0;
        lastTime = 0;
      }
    };
    const handleScroll = () => {
      target = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.85)));
      if (!frame) frame = window.requestAnimationFrame(draw);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    reducedMotion.addEventListener('change', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      reducedMotion.removeEventListener('change', handleScroll);
      window.cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <div ref={curtainRef} className="theatre-home">
      <div className="theatre-backdrop" aria-hidden="true">
        <svg className="curtain-definitions" width="0" height="0" focusable="false">
          <defs>
            <clipPath id="curtain-fabric-clip" clipPathUnits="objectBoundingBox">
              <path id="curtain-fabric-shape" d="M0 0 H1 V.98 Q.5 1.015 0 .985 Z" />
            </clipPath>
            <clipPath id="curtain-fabric-clip-right" clipPathUnits="objectBoundingBox">
              <use href="#curtain-fabric-shape" transform="translate(1 0) scale(-1 1)" />
            </clipPath>
          </defs>
        </svg>
        <div className="theatre-spotlight" />
        <div className="theatre-curtain theatre-curtain-left" />
        <div className="theatre-curtain theatre-curtain-right" />
        <div className="theatre-valance" />
      </div>
      <section className="theatre-hero" aria-labelledby="home-title">
        <p className="theatre-eyebrow">İZMİR · 04 — 06 DECEMBER 2026</p>
        <h1 id="home-title">FBALMUN<span>2026</span></h1>
        <p className="theatre-tagline">The Grand Stage of Diplomacy</p>
        <div className="countdown-container theatre-countdown" aria-label="Countdown to the conference">
          {timeLeft.map((value, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span className="countdown-separator" aria-hidden="true">:</span>}
              <div className="countdown-block">
                <div className="digit-group">{String(value).padStart(2, '0').split('').map((digit, i) => <div className="digit-box" key={i}>{digit}</div>)}</div>
                <span className="countdown-label">{['DAYS', 'HOURS', 'MINUTES', 'SECONDS'][index]}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
        <div className="theatre-actions">
          <button className="btn-primary" onClick={() => onNavigate('apply')}>APPLY NOW <ArrowRight size={17} /></button>
          <button className="btn-secondary" onClick={() => onNavigate('committees')}><Compass size={17} /> EXPLORE COMMITTEES</button>
        </div>
        <button className="theatre-scroll" onClick={() => lettersRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })}>
          <span>SCROLL TO OPEN THE STAGE</span><ArrowDown size={19} />
        </button>
      </section>
      <section ref={lettersRef} className="conference-letters" aria-labelledby="letters-title">
        <div className="letters-reveal">
          <p className="theatre-eyebrow">FROM OUR CONFERENCE HOSTS</p>
          <h2 id="letters-title">Letters of Welcome</h2>
          <div className="conference-letter-grid">
            {CONFERENCE_LETTERS.map((letter, index) => (
              <article className="conference-letter" key={letter.name}>
                <span className="letter-number">0{index + 1} / WELCOME LETTER</span>
                <h3>{letter.title}</h3>
                {letter.paragraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
                <div className="letter-signature">{letter.name}<span>{letter.role}</span></div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="home-highlights" aria-label="Conference highlights">
        <button className="home-highlight" onClick={() => onNavigate('committees')}><Landmark size={24} /><h3>9 Elite Chambers</h3><p>Discover our General Assembly and specialized bodies.</p><ArrowRight size={18} /></button>
        <button className="home-highlight" onClick={() => onNavigate('committees')}><Flame size={24} /><h3>Crisis Simulation</h3><p>Step into history and shape the course of international debate.</p><ArrowRight size={18} /></button>
        <div className="home-highlight"><MapPin size={24} /><h3>İzmir 2026</h3><p>Three days of diplomacy, dialogue, and new perspectives. December 4–6, 2026.</p></div>
      </section>
      <section className="home-location" aria-labelledby="location-title">
        <p className="theatre-eyebrow">MEET US IN İZMİR</p>
        <h2 id="location-title">A meeting point for new perspectives.</h2>
        <a className="home-map-link" href="https://www.google.com/maps/search/?api=1&query=Konak%2C%20Izmir%2C%20Turkey" target="_blank" rel="noopener noreferrer" aria-label="Open Konak, İzmir in Google Maps (new tab)">
          <div className="home-map-art" aria-hidden="true"><span className="map-pin-halo"><MapPin size={36} /></span></div>
          <div className="home-map-caption"><div><span>CONFERENCE LOCATION</span><h3>Konak, İzmir</h3><p>İzmir, Türkiye</p></div><span className="map-open">OPEN IN MAPS <ExternalLink size={18} /></span></div>
        </a>
      </section>
      <footer className="home-footer">© {new Date().getFullYear()} FBALMUN · MODEL UNITED NATIONS · ALL RIGHTS RESERVED</footer>
    </div>
  );
};
export default HomePage;
