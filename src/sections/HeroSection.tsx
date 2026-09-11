import React, { useState, useEffect } from 'react';
import { Rocket, Sparkles, Calendar, MapPin, Clock, ArrowDown } from 'lucide-react';
import { eventConfig } from '../data/eventConfig';

interface HeroSectionProps {
  onRegisterClick: () => void;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onRegisterClick,
  onExploreClick
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date(eventConfig.eventDateISO).getTime();

    const calculateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Cosmic Nebula Backdrops */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[400px] sm:h-[600px] bg-gradient-to-tr from-cyan-600/15 via-purple-600/15 to-transparent blur-[120px] rounded-full pointer-events-none" />
      
      {/* Orbital Rings Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[1100px] h-[700px] sm:h-[1100px] border border-cyan-500/10 rounded-full pointer-events-none animate-spin-slow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[850px] h-[500px] sm:h-[850px] border border-purple-500/10 rounded-full pointer-events-none [animation-direction:reverse] animate-spin-slow" />

      {/* Planetary Horizon Glow at Bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[140%] h-48 bg-gradient-to-t from-cyan-950/40 via-cyan-500/5 to-transparent rounded-[100%] blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        
        {/* Collaboration Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-space-900/80 border border-cyan-500/30 text-xs font-mono tracking-wider text-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.2)] mb-8">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>NRIIT × MTX × NRIIT CODING CLUB</span>
        </div>

        {/* Main Title: ASTRA */}
        <div className="relative">
          <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-extrabold tracking-tight font-display leading-none select-none">
            <span className="chrome-title-gradient">{eventConfig.name}</span>
            <span className="text-[#00f2fe] font-light mx-2">—</span>
            <span className="text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.35)]">2026</span>
          </h1>
          <div className="absolute -inset-x-6 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-[#00f2fe]/40 to-transparent -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Subtitle */}
        <div className="mt-3 sm:mt-4 text-base sm:text-xl md:text-2xl font-bold font-mono tracking-[0.25em] text-[#00f2fe] uppercase drop-shadow-[0_0_12px_rgba(0,242,254,0.3)]">
          NATIONAL HACKATHON
        </div>

        {/* Supporting Line */}
        <div className="mt-3 inline-flex items-center gap-2 text-sm sm:text-base font-mono tracking-[0.2em] text-[#d1bcff] italic font-medium">
          <Sparkles className="w-4 h-4 text-[#00f2fe]" />
          <span>&ldquo;{eventConfig.supportingLine}&rdquo;</span>
          <Sparkles className="w-4 h-4 text-[#00f2fe]" />
        </div>

        {/* Main Description */}
        <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl font-sans font-normal leading-relaxed">
          &ldquo;{eventConfig.mainDescription}&rdquo; Turn ambitious ideas into functional prototypes in a high-octane national engineering marathon hosted at NRI Institute of Technology.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
          <button
            onClick={onRegisterClick}
            className="cyber-button-primary group w-full sm:w-auto px-9 py-4 rounded-full font-mono text-sm sm:text-base font-extrabold uppercase tracking-wider text-black shadow-[0_0_25px_rgba(0,242,254,0.45)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <Rocket className="w-5 h-5 text-black group-hover:rotate-12 transition-transform duration-300" />
            <span>GO TO REGISTRATION</span>
          </button>

          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto px-8 py-4 rounded-full font-mono text-sm font-semibold tracking-wider text-[#99deff] bg-space-900/80 hover:bg-space-850 border border-[#00f2fe]/30 hover:border-[#00f2fe]/60 shadow-[0_0_15px_rgba(0,242,254,0.1)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>EXPLORE ASTRA</span>
            <ArrowDown className="w-4 h-4 text-[#00f2fe]" />
          </button>
        </div>

        {/* Countdown Timer */}
        <div className="mt-14 w-full max-w-2xl bg-space-900/60 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <div className="text-[11px] font-mono tracking-widest text-slate-300 uppercase mb-4 flex items-center justify-center gap-2">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>COUNTDOWN TO IGNITION</span>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
            {[
              { label: 'DAYS', value: timeLeft.days },
              { label: 'HOURS', value: timeLeft.hours },
              { label: 'MINUTES', value: timeLeft.minutes },
              { label: 'SECONDS', value: timeLeft.seconds }
            ].map((unit) => (
              <div key={unit.label} className="bg-space-950/80 rounded-xl p-3 sm:p-4 border border-cyan-500/15">
                <div className="text-2xl sm:text-4xl font-extrabold font-mono text-cyan-300 tracking-tight">
                  {String(unit.value).padStart(2, '0')}
                </div>
                <div className="text-[10px] sm:text-xs font-mono font-medium text-slate-300 tracking-wider mt-1">
                  {unit.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Event Information Bar */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-mono text-slate-300">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span>{eventConfig.dates}</span>
          </div>
          <span className="hidden sm:inline text-slate-600">•</span>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>{eventConfig.duration.toUpperCase()}</span>
          </div>
          <span className="hidden sm:inline text-slate-600">•</span>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span>{eventConfig.venue}, {eventConfig.location}</span>
          </div>
        </div>

      </div>
    </section>
  );
};
