import React, { useState, useEffect } from 'react';
import { Menu, X, Rocket, Search, ChevronRight } from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'track' | 'register';
  setActiveTab: (tab: 'home' | 'track' | 'register') => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onNavigateSection
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'HOME', href: '#hero', action: () => { setActiveTab('home'); onNavigateSection?.('hero'); } },
    { label: 'ABOUT', href: '#about', action: () => { setActiveTab('home'); onNavigateSection?.('about'); } },
    { label: 'CHALLENGES', href: '#challenges', action: () => { setActiveTab('home'); onNavigateSection?.('challenges'); } },
    { label: 'TIMELINE', href: '#timeline', action: () => { setActiveTab('home'); onNavigateSection?.('timeline'); } },
    { label: 'PRIZES', href: '#prizes', action: () => { setActiveTab('home'); onNavigateSection?.('prizes'); } },
    { label: 'FAQ', href: '#faq', action: () => { setActiveTab('home'); onNavigateSection?.('faq'); } },
    { label: 'TRACK APPLICATION', href: '#track', isSpecial: true, action: () => { setActiveTab('track'); } }
  ];

  const handleRegisterClick = () => {
    setActiveTab('home');
    onNavigateSection?.('register');
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-space-950/80 backdrop-blur-xl border-b border-cyan-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.6)] py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Left: NRIIT Logo Lockup */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => { setActiveTab('home'); onNavigateSection?.('hero'); }}>
          <div className="relative p-1 rounded-xl bg-gradient-to-b from-[#00f2fe]/30 to-[#7928ca]/30 border border-[#00f2fe]/40 shadow-[0_0_15px_rgba(0,242,254,0.2)]">
            <img
              src="https://lh3.googleusercontent.com/aida/AEtjO1XGyUPtTHl-T3328I-NeDykDoTTx9cx2MdjYE26uTt1ySrCvcp87w7w1EIXlwWVzv_k5Gx_lO3WEQlULUgWaUJ5XUc3W1DulrZBUzugJeFb35Qoq4IND1LXZJMSTWcH28SsZ7SCTsOTKVd_k8A-IOgGcrZUcWPC54Dz-s2qwnMqEtZBc7-uYMLnmAfkFYgs4P-aIP38OVMfySkevipFPU3c12FzlFx72RR7S7ebMQ8KizDcQQpofKFWr1_O"
              alt="NRI Institute of Technology"
              className="h-9 w-9 object-contain rounded-lg"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#00f2fe] animate-pulse"></span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-cyan-300 tracking-widest uppercase font-mono">
              <span>NRIIT</span>
              <span className="text-xs text-[#00f2fe]">×</span>
              <span>MTX</span>
              <span className="text-xs text-[#b827fc]">×</span>
              <span className="hidden sm:inline text-purple-300">CODING CLUB</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-[#00f2fe] transition-colors flex items-center gap-1.5 font-display">
              ASTRA 2026
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00f2fe]"></span>
            </span>
          </div>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 px-4 py-1.5 rounded-full bg-space-900/40 backdrop-blur-md border border-cyan-500/15">
          {navLinks.map((link) => {
            const isTrackActive = activeTab === 'track' && link.label === 'TRACK APPLICATION';

            return (
              <button
                key={link.label}
                onClick={() => {
                  link.action();
                }}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wider transition-all duration-200 font-mono ${
                  isTrackActive
                    ? 'text-cyan-300 bg-cyan-950/80 border border-cyan-400/50 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                    : 'text-slate-300 hover:text-cyan-300 hover:bg-white/5'
                }`}
              >
                {link.label === 'TRACK APPLICATION' ? (
                  <span className="flex items-center gap-1.5">
                    <Search className="w-3 h-3 text-cyan-400" />
                    {link.label}
                  </span>
                ) : (
                  link.label
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Register Now CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={handleRegisterClick}
            className="cyber-button-primary group inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-xs font-extrabold uppercase tracking-wider text-black shadow-[0_0_20px_rgba(0,240,255,0.45)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Rocket className="w-4 h-4 text-black group-hover:rotate-12 transition-transform duration-300" />
            <span>REGISTER NOW</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="p-2 rounded-lg bg-space-900/80 border border-cyan-500/30 text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Animated Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-space-950/95 backdrop-blur-2xl border-b border-cyan-500/20 px-6 py-6 transition-all animate-fadeIn">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  link.action();
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between px-4 py-3 rounded-xl font-mono text-sm tracking-wider text-left transition-colors ${
                  activeTab === 'track' && link.label === 'TRACK APPLICATION'
                    ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-300 hover:bg-white/5 hover:text-cyan-300'
                }`}
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-cyan-400 opacity-60" />
              </button>
            ))}

            <div className="pt-4 border-t border-slate-800 mt-2">
              <button
                onClick={handleRegisterClick}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-mono text-sm font-bold uppercase tracking-wider text-black bg-gradient-to-r from-cyan-400 to-purple-400 shadow-[0_0_20px_rgba(0,240,255,0.4)]"
              >
                <Rocket className="w-4 h-4 text-black" />
                REGISTER NOW
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
