import React, { useState } from 'react';
import { ExternalLink, Smartphone, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface RegistrationSectionProps {
  onGoToTrack?: () => void;
}

export const RegistrationSection: React.FC<RegistrationSectionProps> = ({
  onGoToTrack
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const googleFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdqfPCTyw2vOevRxs2qXPbPI_BBqMNuBNu7HrBryhSM_HftGA/viewform?embedded=true";
  const googleFormDirectUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdqfPCTyw2vOevRxs2qXPbPI_BBqMNuBNu7HrBryhSM_HftGA/viewform?usp=sf_link";

  return (
    <section className="py-10 md:py-14 px-4 sm:px-6 relative z-10" id="register">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00f2fe]/10 border border-[#00f2fe]/40 text-xs font-bold text-[#00f2fe] mb-3 shadow-[0_0_15px_rgba(0,242,254,0.2)]">
            <span className="w-2 h-2 rounded-full bg-[#00f2fe] animate-pulse"></span>
            <span className="tracking-wider font-mono">OFFICIAL REGISTRATION PORTAL</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
            Join ASTRA Hackathon
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-2.5 max-w-lg mx-auto font-sans">
            Fill out the form below. Free registration for eligible college student teams (2-4 members).
          </p>
        </div>

        {/* Cyber HUD Form Container */}
        <div className="cyber-glass-card hud-brackets rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,242,254,0.12)]">
          
          {/* Top Status & New Tab Action */}
          <div className="px-4 py-3 bg-[#0a122e]/90 border-b border-[#00f2fe]/25 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-200">
              <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f2fe] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00f2fe] shadow-[0_0_8px_#00f2fe]"></span>
              </span>
              <span className="font-bold text-white tracking-wide text-xs flex items-center gap-1.5 font-mono">
                Official Google Form Intake 
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#00f2fe]/15 text-[#00f2fe] border border-[#00f2fe]/30 font-semibold uppercase tracking-wider">
                  LIVE
                </span>
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                • Scroll inside viewport or launch in full window
              </span>
            </div>

            <div className="flex items-center gap-2">
              {onGoToTrack && (
                <button
                  onClick={onGoToTrack}
                  className="hidden md:inline-flex items-center gap-1 text-[11px] font-mono text-cyan-300 hover:text-white px-2.5 py-1 rounded-full bg-space-950/60 border border-cyan-500/30"
                >
                  <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                  <span>Track Application</span>
                </button>
              )}
              <a
                className="cyber-button-primary inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(0,242,254,0.3)] font-mono"
                href={googleFormDirectUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span>OPEN IN NEW TAB</span>
                <ExternalLink className="w-3 h-3 text-black" />
              </a>
            </div>
          </div>

          {/* Centered Embedded Google Form Container */}
          <div className="w-full bg-[#050914] p-2 sm:p-5 flex justify-center overflow-x-hidden">
            {!isLoaded && (
              <div className="w-full h-96 flex flex-col items-center justify-center gap-3 text-center bg-[#0a122e]/40 rounded-xl border border-dashed border-[#00f2fe]/30">
                <div className="w-8 h-8 border-2 border-[#00f2fe] border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-mono text-[#00f2fe] tracking-wider">
                  INITIALIZING SECURE GOOGLE FORMS INTAKE...
                </span>
              </div>
            )}

            <iframe
              src={googleFormUrl}
              width="640"
              height="5870"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
              onLoad={() => setIsLoaded(true)}
              title="ASTRA Hackathon Registration Form"
              className={`w-full max-w-[640px] block bg-white rounded-xl shadow-2xl border-0 ${isLoaded ? 'opacity-100' : 'hidden'}`}
              style={{
                width: '100%',
                maxWidth: '640px',
                height: '5870px',
                border: '0'
              }}
            >
              Loading…
            </iframe>
          </div>

          {/* Bottom Trouble Viewing Callout */}
          <div className="px-4 py-3 bg-[#0a122e]/90 border-t border-[#00f2fe]/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[#00f2fe]" />
              <span>Trouble viewing the form on mobile?</span>
            </div>
            <div className="flex items-center gap-4">
              <a
                className="text-[#00f2fe] font-bold hover:underline inline-flex items-center gap-1 font-mono"
                href={googleFormDirectUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span>Launch Direct Google Form</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span className="hidden sm:inline text-slate-600">|</span>
              <div className="hidden sm:flex items-center gap-1 text-slate-400 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>SSL Encrypted</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
