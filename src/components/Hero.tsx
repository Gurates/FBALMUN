import React, { useState, useEffect } from 'react';
import { FlameLogo } from './FlameLogo';
import { EmbersCanvas } from './EmbersCanvas';
import { CONFERENCE_INFO } from '../data/conferenceData';

interface HeroProps {
  onRegisterClick?: () => void;
}

export const Hero: React.FC<HeroProps> = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 30,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30);
    const targetTime = targetDate.getTime();

    const interval = setInterval(() => {
      const difference = targetTime - new Date().getTime();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const daysDigits = String(timeLeft.days).padStart(2, '0').split('');
  const hoursDigits = String(timeLeft.hours).padStart(2, '0').split('');
  const minutesDigits = String(timeLeft.minutes).padStart(2, '0').split('');
  const secondsDigits = String(timeLeft.seconds).padStart(2, '0').split('');

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center pt-28 sm:pt-36 pb-16 sm:pb-20 overflow-hidden cinematic-grid"
      data-scroll-section="hero"
    >
      <EmbersCanvas />

      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(74, 14, 20, 0.38) 0%, rgba(200, 104, 104, 0.14) 45%, transparent 70%)',
          filter: 'blur(50px)',
          zIndex: 0
        }}
      />

      <div className="absolute inset-0 hero-vignette pointer-events-none z-[2]" />

      <div className="relative z-10 section-container flex flex-col items-center text-center">

        <div
          className="mb-8 relative transition-transform duration-700 hover:scale-105"
        >
          <FlameLogo size="hero" showText={true} glow={true} />
        </div>

        <div className="max-w-4xl mx-auto mb-6 px-2">
          <p className="text-[11px] sm:text-xs md:text-sm font-semibold tracking-[0.2em] sm:tracking-[0.35em] text-amber-500/90 uppercase font-sans mb-3 flex items-center justify-center gap-2 sm:gap-3">
            <span className="w-6 sm:w-8 h-[1px] bg-gradient-to-r from-transparent to-amber-500/60" />
            THE FLAME OF RESOLUTION
            <span className="w-6 sm:w-8 h-[1px] bg-gradient-to-l from-transparent to-amber-500/60" />
          </p>
          <h1 className="font-serif text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.08] text-white">
            IGNITING GLOBAL <br />
            <span className="flame-gradient-text">DIPLOMACY</span>
          </h1>
        </div>

        <p
          className="max-w-2xl mx-auto text-sm sm:text-lg text-slate-300 leading-relaxed font-sans mb-8 font-normal px-2"
        >
          {CONFERENCE_INFO.subheading}
        </p>

        <div className="countdown-container">

          <div className="countdown-block">
            <div className="digit-group">
              <div className="digit-box">{daysDigits[0]}</div>
              <div className="digit-box">{daysDigits[1]}</div>
            </div>
            <span className="countdown-label">DAYS</span>
          </div>

          <span className="countdown-separator">:</span>

          <div className="countdown-block">
            <div className="digit-group">
              <div className="digit-box">{hoursDigits[0]}</div>
              <div className="digit-box">{hoursDigits[1]}</div>
            </div>
            <span className="countdown-label">HOURS</span>
          </div>

          <span className="countdown-separator">:</span>

          <div className="countdown-block">
            <div className="digit-group">
              <div className="digit-box">{minutesDigits[0]}</div>
              <div className="digit-box">{minutesDigits[1]}</div>
            </div>
            <span className="countdown-label">MINUTES</span>
          </div>

          <span className="countdown-separator">:</span>

          <div className="countdown-block">
            <div className="digit-group">
              <div className="digit-box" style={{ color: '#C86868' }}>{secondsDigits[0]}</div>
              <div className="digit-box" style={{ color: '#C86868' }}>{secondsDigits[1]}</div>
            </div>
            <span className="countdown-label" style={{ color: '#C86868' }}>SECONDS</span>
          </div>

        </div>

      </div>
    </section>
  );
};
