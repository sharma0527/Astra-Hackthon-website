import { useState, useEffect, useRef } from 'react';
import { TrackPage } from './pages/TrackPage';

export function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'track'>('home');
  const [submissionRedirectNotice, setSubmissionRedirectNotice] = useState(false);
  const iframeLoadCountRef = useRef(0);

  useEffect(() => {
    document.title = "Astra hackthon 2026";

    const syncRouteFromLocation = () => {
      const path = window.location.pathname.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (path.includes('track') || search.includes('applicationid') || search.includes('id=')) {
        setActiveTab('track');
      } else {
        setActiveTab('home');
      }
    };

    syncRouteFromLocation();
    window.addEventListener('popstate', syncRouteFromLocation);
    return () => window.removeEventListener('popstate', syncRouteFromLocation);
  }, []);

  const navigateToTrack = () => {
    setActiveTab('track');
    if (!window.location.pathname.toLowerCase().includes('track')) {
      window.history.pushState(null, '', '/track-application');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = (hash?: string) => {
    setActiveTab('home');
    const targetUrl = hash ? `/#${hash}` : '/';
    if (window.location.pathname.toLowerCase().includes('track')) {
      window.history.pushState(null, '', targetUrl);
    }
    if (hash) {
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Direct Google Form link
  const googleFormDirectUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdqfPCTyw2vOevRxs2qXPbPI_BBqMNuBNu7HrBryhSM_HftGA/viewform?usp=sf_link";
  const googleFormEmbedUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdqfPCTyw2vOevRxs2qXPbPI_BBqMNuBNu7HrBryhSM_HftGA/viewform?embedded=true";

  return (
    <div className="cosmic-canvas text-[#e0e7ff] antialiased selection:bg-[#00f2fe] selection:text-black min-h-screen flex flex-col relative font-sans">
      
      {/* Multi-layer Celestial Glows / Auroral Atmospheric Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-[#00f2fe]/15 via-[#7928ca]/12 to-transparent rounded-full blur-[130px]"></div>
        <div className="absolute top-[38%] -left-36 w-[520px] h-[520px] bg-gradient-to-tr from-[#7928ca]/14 via-[#00f2fe]/10 to-transparent rounded-full blur-[140px]"></div>
        <div className="absolute top-[65%] -right-36 w-[560px] h-[560px] bg-gradient-to-bl from-[#00c8ff]/12 via-[#a855f7]/15 to-transparent rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 left-1/3 w-[650px] h-[350px] bg-gradient-to-t from-[#4facfe]/10 via-[#7928ca]/10 to-transparent rounded-full blur-[130px]"></div>
        <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20%" cy="18%" fill="none" r="140" stroke="rgba(0, 242, 254, 0.18)" strokeDasharray="4 8" strokeWidth="1"></circle>
          <circle cx="20%" cy="18%" fill="none" r="220" stroke="rgba(168, 85, 247, 0.12)" strokeWidth="1"></circle>
          <line stroke="rgba(0, 242, 254, 0.2)" strokeDasharray="3 6" strokeWidth="1" x1="20%" x2="45%" y1="18%" y2="28%"></line>
          <line stroke="rgba(209, 188, 255, 0.18)" strokeWidth="1" x1="45%" x2="80%" y1="28%" y2="15%"></line>
          <circle className="animate-pulse" cx="45%" cy="28%" fill="#00f2fe" r="3.5"></circle>
          <circle cx="80%" cy="15%" fill="#d1bcff" r="2.5"></circle>
          <circle cx="85%" cy="65%" fill="none" r="180" stroke="rgba(0, 242, 254, 0.15)" strokeDasharray="6 6" strokeWidth="1"></circle>
          <line stroke="rgba(168, 85, 247, 0.18)" strokeWidth="1" x1="85%" x2="60%" y1="65%" y2="78%"></line>
          <circle cx="60%" cy="78%" fill="#b827fc" r="3"></circle>
          <circle className="animate-pulse" cx="85%" cy="65%" fill="#00f2fe" r="4"></circle>
        </svg>
      </div>

      {/* Header / Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#060913]/80 backdrop-blur-xl border-b border-[#00f2fe]/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-18 py-3 flex items-center justify-between">
          <a
            className="flex items-center gap-3 group cursor-pointer"
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              navigateToHome('hero');
            }}
          >
            <div className="relative p-1 rounded-xl bg-white/95 border border-[#00f2fe]/40 shadow-[0_0_15px_rgba(0,242,254,0.2)] flex items-center justify-center">
              <img
                alt="Coding Club"
                className="h-9 w-auto max-w-[56px] object-contain rounded"
                src="/coding-club-logo.png"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#00f2fe] animate-pulse"></span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-[#99deff] tracking-widest uppercase font-mono">
                <span>NRIIT</span>
                <span className="text-xs text-[#00f2fe]">×</span>
                <span>MTX</span>
                <span className="text-xs text-[#b827fc]">×</span>
                <span className="hidden sm:inline text-[#d1bcff]">CODING CLUB</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-[#00f2fe] transition-colors flex items-center gap-1.5">
                Astra hackthon 2026
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00f2fe]"></span>
              </span>
            </div>
          </a>

          {/* Streamlined Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide text-[#9cb1cc]">
            <a
              className="hover:text-[#00f2fe] transition-colors flex items-center gap-1.5 py-1"
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                navigateToHome('about');
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f2fe]/60"></span>
              About
            </a>
            <a
              className="hover:text-[#00f2fe] transition-colors flex items-center gap-1.5 py-1"
              href="#register"
              onClick={(e) => {
                e.preventDefault();
                navigateToHome('register');
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f2fe]/60"></span>
              Register
            </a>
            <a
              className="hover:text-[#00f2fe] transition-colors flex items-center gap-1.5 py-1"
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                navigateToHome('contact');
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f2fe]/60"></span>
              Contact
            </a>
            <button
              className={`hover:text-[#00f2fe] transition-colors flex items-center gap-1.5 py-1 cursor-pointer ${
                activeTab === 'track' ? 'text-[#00f2fe] font-bold' : ''
              }`}
              onClick={navigateToTrack}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f2fe]"></span>
              Track Application
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <a
              className="cyber-button-primary inline-flex items-center gap-2 px-4 py-2 rounded-full text-black font-extrabold text-xs sm:text-sm tracking-wider uppercase"
              href="#register"
              onClick={(e) => {
                e.preventDefault();
                navigateToHome('register');
              }}
            >
              <span>Register Now</span>
              <span className="material-symbols-outlined text-[16px] font-bold">bolt</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full pt-20 flex-1 relative z-10">
        {activeTab === 'track' ? (
          <TrackPage
            onBackToHome={() => navigateToHome()}
            onGoToRegister={() => navigateToHome('register')}
          />
        ) : (
          <>
            {/* 1. HERO SECTION */}
            <section className="relative pt-16 pb-16 md:pt-24 md:pb-24 px-4 sm:px-6 overflow-hidden" id="hero">
              <div className="relative max-w-4xl mx-auto text-center flex flex-col items-center">
                {/* Tagline pill with holographic rim */}
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0d1734]/80 border border-[#00f2fe]/40 text-xs font-bold text-[#99deff] mb-8 shadow-[0_0_20px_rgba(0,242,254,0.15)] backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-[#00f2fe] shadow-[0_0_8px_#00f2fe] animate-ping"></span>
                  <span className="tracking-wider uppercase font-mono">NRIIT × MTX × NRIIT CODING CLUB PRESENTS</span>
                </div>

                {/* Title with metallic titanium & cyan chrome gradient */}
                <h1 className="text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-tight mb-4 select-none">
                  <span className="chrome-title-gradient">ASTRA</span>
                  <span className="text-[#00f2fe] font-light mx-1 sm:mx-2">—</span>
                  <span className="text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.35)]">2026</span>
                </h1>

                {/* High-energy Subtitles */}
                <p className="text-base sm:text-xl font-bold tracking-[0.25em] text-[#00f2fe] uppercase mb-3 drop-shadow-[0_0_12px_rgba(0,242,254,0.3)] font-mono">
                  A 12-HOUR NATIONAL HACKATHON
                </p>
                <p className="text-[#d1bcff] italic text-base sm:text-lg mb-6 font-medium tracking-wide">
                  “Code • Create • Collaborate • Change”
                </p>
                <p className="text-[#9cb1cc] max-w-2xl text-sm sm:text-base leading-relaxed mb-10 font-normal">
                  Turn ambitious ideas into functional prototypes in a 12-hour high-octane engineering marathon hosted at NRI Institute of Technology.
                </p>

                {/* Cyber HUD Quick Fact Badges with hover lift */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full max-w-2xl mb-10 text-xs sm:text-sm">
                  <div className="cyber-glass-card hud-brackets flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl cursor-default transition-all duration-300 hover:scale-105">
                    <span className="material-symbols-outlined text-[#00f2fe] text-xl drop-shadow-[0_0_8px_#00f2fe]">calendar_month</span>
                    <span className="font-bold text-white tracking-wide">21-09-2026</span>
                  </div>
                  <div className="cyber-glass-card hud-brackets flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl cursor-default transition-all duration-300 hover:scale-105">
                    <span className="material-symbols-outlined text-[#7928ca] text-xl drop-shadow-[0_0_8px_#b827fc]">timelapse</span>
                    <span className="font-bold text-white tracking-wide">12 Hours Non-Stop</span>
                  </div>
                  <div className="cyber-glass-card hud-brackets flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl cursor-default transition-all duration-300 hover:scale-105">
                    <span className="material-symbols-outlined text-[#d1bcff] text-xl drop-shadow-[0_0_8px_#d1bcff]">location_on</span>
                    <span className="font-bold text-white tracking-wide">NRIIT, Perecharla, Guntur</span>
                  </div>
                </div>

                {/* Primary CTA with shimmer & magnetic lift */}
                <div className="flex items-center justify-center">
                  <a
                    className="cyber-button-primary group inline-flex items-center gap-3 px-9 py-4 rounded-full text-black text-sm sm:text-base font-extrabold uppercase tracking-wider shadow-[0_0_25px_rgba(0,242,254,0.45)]"
                    href="#register"
                  >
                    <span>Go to Registration</span>
                    <span className="material-symbols-outlined text-xl group-hover:translate-y-1 transition-transform">arrow_downward</span>
                  </a>
                </div>
              </div>
            </section>

            {/* 2. STREAMLINED OVERVIEW / ABOUT */}
            <section className="py-14 px-4 sm:px-6 relative border-y border-[#00f2fe]/15 bg-[#080d22]/60 backdrop-blur-md" id="about">
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-center">
                  {/* Card 1 */}
                  <div className="cyber-glass-card hud-brackets p-6 rounded-2xl flex flex-col items-center group cursor-pointer hover:border-[#00f2fe]/50">
                    <div className="w-12 h-12 rounded-full bg-[#00f2fe]/10 border border-[#00f2fe]/30 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-[#00f2fe]/20 transition-all duration-300">
                      <span className="material-symbols-outlined text-[#00f2fe] text-2xl">bolt</span>
                    </div>
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#00f2fe] mb-1 tracking-tight drop-shadow-[0_0_15px_rgba(0,242,254,0.4)] font-mono">
                      12H
                    </span>
                    <span className="text-sm font-bold text-white tracking-wide group-hover:text-primary transition-colors">
                      Continuous Sprint
                    </span>
                    <span className="text-xs text-[#9cb1cc] mt-2 leading-relaxed">
                      Non-stop power, lab facilities &amp; high-speed WiFi
                    </span>
                  </div>

                  {/* Card 2 */}
                  <div className="cyber-glass-card hud-brackets p-6 rounded-2xl flex flex-col items-center group cursor-pointer hover:border-[#b827fc]/50">
                    <div className="w-12 h-12 rounded-full bg-[#b827fc]/10 border border-[#b827fc]/30 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-[#b827fc]/20 transition-all duration-300">
                      <span className="material-symbols-outlined text-[#d1bcff] text-2xl">check_circle</span>
                    </div>
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#d1bcff] mb-1 tracking-tight drop-shadow-[0_0_15px_rgba(209,188,255,0.4)] font-mono">
                      ₹0
                    </span>
                    <span className="text-sm font-bold text-white tracking-wide group-hover:text-secondary transition-colors">
                      Free Registration
                    </span>
                    <span className="text-xs text-[#9cb1cc] mt-2 leading-relaxed">
                      Open to collegiate teams of 4 to 5 students
                    </span>
                  </div>

                  {/* Card 3 */}
                  <div className="cyber-glass-card hud-brackets p-6 rounded-2xl flex flex-col items-center group cursor-pointer hover:border-[#4facfe]/50">
                    <div className="w-12 h-12 rounded-full bg-[#4facfe]/10 border border-[#4facfe]/30 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-[#4facfe]/20 transition-all duration-300">
                      <span className="material-symbols-outlined text-[#99deff] text-2xl">groups</span>
                    </div>
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#99deff] mb-1 tracking-tight drop-shadow-[0_0_15px_rgba(153,222,255,0.4)] font-mono">
                      MTX
                    </span>
                    <span className="text-sm font-bold text-white tracking-wide group-hover:text-primary transition-colors">
                      Industry Mentorship
                    </span>
                    <span className="text-xs text-[#9cb1cc] mt-2 leading-relaxed">
                      Direct feedback, engineering jury &amp; network
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. OFFICIAL REGISTRATION SECTION (CYBER HUD FORM FRAME) */}
            <section className="py-10 md:py-14 px-4 sm:px-6 relative" id="register">
              <div className="mx-auto transition-all duration-300 max-w-[656px]">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00f2fe]/10 border border-[#00f2fe]/40 text-xs font-bold text-[#00f2fe] mb-3 shadow-[0_0_15px_rgba(0,242,254,0.2)]">
                    <span className="w-2 h-2 rounded-full bg-[#00f2fe] animate-pulse"></span>
                    <span className="tracking-wider uppercase font-mono">OFFICIAL REGISTRATION PORTAL</span>
                  </div>
                  <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                    Join ASTRA Hackathon
                  </h2>
                  <p className="text-sm sm:text-base text-[#9cb1cc] mt-2.5 max-w-lg mx-auto">
                    Fill out the form below. Free registration for eligible college student teams (min 4 and max 5 members).
                  </p>
                </div>

                <div className="cyber-glass-card hud-brackets rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,242,254,0.15)] border border-[#00f2fe]/30">
                  {/* Top Cyber Status Bar */}
                  <div className="px-3 sm:px-4 py-3 bg-[#0a122e]/95 border-b border-[#00f2fe]/25 flex items-center justify-between gap-2 text-xs flex-wrap">
                    <div className="flex items-center gap-2 text-white">
                      <span className="relative flex h-2.5 w-2.5 items-center justify-center shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f2fe] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00f2fe] shadow-[0_0_8px_#00f2fe]"></span>
                      </span>
                      <span className="font-bold text-white tracking-wide text-xs sm:text-sm font-mono">
                        Official Google Form Intake
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#00f2fe]/15 text-[#00f2fe] border border-[#00f2fe]/30 font-semibold uppercase tracking-wider">
                        LIVE
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        className="cyber-button-primary inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-black font-extrabold text-[11px] sm:text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-transform hover:scale-105 shrink-0"
                        href={googleFormDirectUrl}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <span>OPEN IN NEW TAB</span>
                        <span className="material-symbols-outlined text-[14px] font-bold group-hover:rotate-45 transition-transform">
                          open_in_new
                        </span>
                      </a>
                    </div>
                  </div>

                  {/* Form Container - Zero Side Margins & Full Scrollable Questions */}
                  <div className="w-full bg-[#050914] flex justify-center items-center overflow-hidden p-0">
                    <iframe
                      src={googleFormEmbedUrl}
                      title="ASTRA Hackathon Registration Form"
                      className="w-full max-w-[640px] h-[850px] border-0 bg-[#050914]"
                      frameBorder="0"
                      marginHeight={0}
                      marginWidth={0}
                      scrolling="auto"
                      onLoad={() => {
                        iframeLoadCountRef.current += 1;
                        // On initial iframe mount, loadCount is 1. If user submits the form, iframe reloads with confirmation (loadCount >= 2)
                        if (iframeLoadCountRef.current > 1) {
                          setSubmissionRedirectNotice(true);
                          setTimeout(() => {
                            setActiveTab('track');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            setSubmissionRedirectNotice(false);
                          }, 1500);
                        }
                      }}
                    >
                      Loading…
                    </iframe>
                  </div>

                  {/* Footer Mobile Help Callout */}
                  <div className="px-4 py-3 bg-[#0a122e]/90 border-t border-[#00f2fe]/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#9cb1cc]">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-[#00f2fe]">smartphone</span>
                      <span>Trouble viewing the form on mobile?</span>
                    </div>
                    <a
                      className="text-[#00f2fe] font-bold hover:underline inline-flex items-center gap-1 font-mono"
                      href={googleFormDirectUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <span>Launch Direct Google Form</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. OFFICIAL VENUE & CONDUCTED BY CODING CLUB */}
            <section className="py-16 px-4 sm:px-6 relative border-t border-[#00f2fe]/15 bg-[#080d22]/50 backdrop-blur-md" id="contact">
              <div className="max-w-3xl mx-auto">
                <div className="cyber-glass-card hud-brackets p-8 sm:p-10 rounded-2xl border border-[#00f2fe]/30 shadow-[0_0_40px_rgba(0,242,254,0.12)] text-center relative overflow-hidden">
                  {/* Ambient Cyber Light */}
                  <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-32 bg-gradient-to-b from-[#00f2fe]/20 to-transparent blur-3xl pointer-events-none" />

                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00f2fe]/10 border border-[#00f2fe]/40 text-xs font-bold text-[#00f2fe] mb-4 shadow-[0_0_15px_rgba(0,242,254,0.2)] font-mono">
                    <span className="material-symbols-outlined text-base">pin_drop</span>
                    <span className="tracking-wider uppercase">CAMPUS VENUE</span>
                  </div>

                  <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
                    NRI Institute of Technology
                  </h3>

                  <p className="text-sm sm:text-base text-[#9cb1cc] max-w-xl mx-auto mb-5 leading-relaxed font-normal">
                    Perecharla, Medikondoru Mandal, Guntur, Andhra Pradesh
                  </p>

                  <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#09112a] border border-[#b827fc]/40 text-xs sm:text-sm font-bold text-[#d1bcff] shadow-[0_0_20px_rgba(184,39,252,0.2)]">
                    <span className="material-symbols-outlined text-lg text-[#00f2fe]">terminal</span>
                    <span>Conducted by NRIIT Coding Club</span>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Clean Cyber Minimal Footer */}
      <footer className="w-full bg-[#050914] border-t border-[#00f2fe]/20 py-8 px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9cb1cc]">
          <div className="flex items-center gap-3">
            <img
              alt="Coding Club"
              className="h-7 w-auto max-w-[45px] object-contain rounded bg-white/95 p-0.5"
              src="/coding-club-logo.png"
            />
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="font-medium text-slate-300">
                © 2026 Astra hackthon • NRI Institute of Technology × MTX
              </span>
              <span className="hidden sm:inline text-slate-600">•</span>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#00f2fe]/20 via-[#7928ca]/25 to-[#00f2fe]/20 border border-[#00f2fe]/60 shadow-[0_0_20px_rgba(0,242,254,0.35)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f2fe] animate-pulse"></span>
                <span className="text-[11px] text-slate-300 font-mono">Created by</span>
                <span className="text-xs font-bold font-mono tracking-wider bg-gradient-to-r from-[#00f2fe] to-[#d1bcff] bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(0,242,254,0.6)]">
                  ch.ch.sharma
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6 font-semibold">
            <a
              className="hover:text-[#00f2fe] transition-colors"
              href="#about"
              onClick={() => setActiveTab('home')}
            >
              About
            </a>
            <a
              className="text-[#00f2fe] hover:underline"
              href="#register"
              onClick={() => setActiveTab('home')}
            >
              Register
            </a>
            <a
              className="hover:text-[#00f2fe] transition-colors"
              href="#contact"
              onClick={() => setActiveTab('home')}
            >
              Contact
            </a>
            <button
              className="hover:text-[#00f2fe] transition-colors"
              onClick={() => {
                setActiveTab('track');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Track Application
            </button>
          </div>
        </div>
      </footer>

      {/* Google Form Submission Redirect Notice Banner */}
      {submissionRedirectNotice && (
        <div className="fixed bottom-6 right-6 z-[100] max-w-sm sm:max-w-md p-4 rounded-2xl bg-[#080d22]/95 border-2 border-[#00f2fe] shadow-[0_0_40px_rgba(0,242,254,0.4)] backdrop-blur-xl flex items-center gap-3.5 transition-all">
          <div className="w-10 h-10 rounded-full bg-emerald-950 border border-emerald-400 text-emerald-300 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <span className="material-symbols-outlined text-xl">check_circle</span>
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-white font-mono flex items-center gap-2">
              <span>REGISTRATION SUBMITTED</span>
              <span className="inline-block w-2 h-2 rounded-full bg-[#00f2fe] animate-ping" />
            </div>
            <div className="text-[11px] sm:text-xs text-[#9cb1cc] mt-0.5">
              Redirecting you to Track Application page to verify your live status...
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
