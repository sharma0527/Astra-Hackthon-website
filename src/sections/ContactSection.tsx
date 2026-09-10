import React from 'react';
import { MapPin, School } from 'lucide-react';
import { eventConfig } from '../data/eventConfig';

export const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-16 px-4 sm:px-6 relative border-t border-[#00f2fe]/15 bg-[#080d22]/50 backdrop-blur-md z-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300 mb-3">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            DIRECT COMMUNICATIONS
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
            CONTACT &amp; COORDINATION
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Connect with our organizing desk, faculty leads, or visit our campus coordinates.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="cyber-glass-card hud-brackets p-8 sm:p-10 rounded-2xl border border-[#00f2fe]/30 shadow-[0_0_40px_rgba(0,242,254,0.12)] text-center relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00f2fe]/10 border border-[#00f2fe]/40 text-xs font-bold text-[#00f2fe] mb-4 shadow-[0_0_15px_rgba(0,242,254,0.2)] font-mono">
              <MapPin className="w-4 h-4" />
              <span className="tracking-wider uppercase">CAMPUS VENUE</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
              {eventConfig.venue}
            </h3>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-5 leading-relaxed font-normal">
              Perecharla, Medikondoru Mandal, Guntur, Andhra Pradesh
            </p>

            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#09112a] border border-[#b827fc]/40 text-xs sm:text-sm font-bold text-[#d1bcff] shadow-[0_0_20px_rgba(184,39,252,0.2)]">
              <School className="w-4 h-4 text-[#00f2fe]" />
              <span>Conducted by NRIIT Coding Club</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
