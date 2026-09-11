import React from 'react';
import { ArrowUp, Sparkles, MapPin, Mail, Calendar } from 'lucide-react';
import { eventConfig } from '../../data/eventConfig';

interface FooterProps {
  setActiveTab: (tab: 'home' | 'track' | 'register') => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onNavigateSection }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Home', action: () => { setActiveTab('home'); onNavigateSection?.('hero'); } },
    { label: 'About', action: () => { setActiveTab('home'); onNavigateSection?.('about'); } },
    { label: 'Challenges', action: () => { setActiveTab('home'); onNavigateSection?.('challenges'); } },
    { label: 'Timeline', action: () => { setActiveTab('home'); onNavigateSection?.('timeline'); } },
    { label: 'Prizes', action: () => { setActiveTab('home'); onNavigateSection?.('prizes'); } },
    { label: 'FAQ', action: () => { setActiveTab('home'); onNavigateSection?.('faq'); } },
    { label: 'Register', action: () => { setActiveTab('home'); onNavigateSection?.('register'); } },
    { label: 'Track Application', action: () => { setActiveTab('track'); } }
  ];

  return (
    <footer className="relative z-10 bg-space-950 border-t border-cyan-500/20 pt-16 pb-12 overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-cyan-500/10 to-transparent blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand & Collaborations */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/coding-club-logo.png"
                alt="Coding Club"
                className="h-10 w-auto max-w-[60px] object-contain rounded-lg bg-white/95 p-1 border border-[#00f2fe]/30"
              />
              <div>
                <h3 className="text-xl font-bold font-display tracking-wider text-white">ASTRA HACKATHON 2026</h3>
                <p className="text-xs text-cyan-400 font-mono">NATIONAL HACKATHON</p>
              </div>
            </div>

            <div className="pt-2 text-xs font-mono text-slate-300 space-y-1">
              <p className="font-semibold text-white">NRI INSTITUTE OF TECHNOLOGY</p>
              <p className="text-cyan-400">×</p>
              <p className="font-semibold text-white">MTX</p>
              <p className="text-cyan-400">×</p>
              <p className="font-semibold text-white">NRIIT CODING CLUB</p>
            </div>

            <p className="text-xs tracking-widest uppercase font-mono text-purple-400 flex items-center gap-2 pt-2">
              <Sparkles className="w-3.5 h-3.5" />
              INNOVATE • COLLABORATE • BUILD • BEYOND
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-4 font-semibold">
              NAVIGATION
            </h4>
            <ul className="grid grid-cols-2 gap-2 text-sm text-slate-400">
              {navLinks.map((item) => (
                <li key={item.label}>
                  <button
                    onClick={item.action}
                    className="hover:text-cyan-400 transition-colors py-1 text-left"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Event Coordinates */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-4 font-semibold">
              COORDINATES
            </h4>
            <div className="flex items-start gap-2.5 text-xs text-slate-400">
              <Calendar className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>{eventConfig.dates} • National Hackathon</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-slate-400">
              <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>{eventConfig.venue}, {eventConfig.location}</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-slate-400">
              <Mail className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>astra.hackathon@nriit.edu.in</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-300">
          <div className="flex flex-wrap items-center gap-3">
            <span>© 2026 ASTRA • NRI Institute of Technology × MTX</span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#00f2fe]/20 via-[#7928ca]/25 to-[#00f2fe]/20 border border-[#00f2fe]/60 shadow-[0_0_20px_rgba(0,242,254,0.35)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f2fe] animate-pulse"></span>
              <span className="text-[11px] text-slate-300 font-mono">Created by</span>
              <span className="text-xs font-bold font-mono tracking-wider bg-gradient-to-r from-[#00f2fe] to-[#d1bcff] bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(0,242,254,0.6)]">
                ch.ch.sharma
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <span>NRIIT × MTX Official Collaboration</span>
            <button
              onClick={scrollToTop}
              aria-label="Scroll to top"
              className="p-2 rounded-lg bg-space-900 border border-slate-800 text-cyan-400 hover:border-cyan-400 transition-colors flex items-center gap-1.5"
            >
              <span>TOP</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
