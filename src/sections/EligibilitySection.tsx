import React from 'react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { GlassCard } from '../components/ui/GlassCard';
import { eventConfig } from '../data/eventConfig';
import { Users2, AlertTriangle, CheckCircle, Shield } from 'lucide-react';

export const EligibilitySection: React.FC = () => {
  const { eligibility } = eventConfig;

  return (
    <section id="eligibility" className="relative py-24 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-7xl mx-auto">
        
        <SectionHeading
          badge="PARTICIPATION GUIDELINES"
          title={eligibility.title}
          subtitle="Review the protocol criteria, team sizing parameters, and venue integrity rules."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Team Size Card */}
          <GlassCard glowColor="cyan" className="p-8 flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-space-950 border border-cyan-500/30 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                <Users2 className="w-7 h-7 text-cyan-400" />
              </div>

              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
                SQUAD SPECIFICATION
              </span>

              <h3 className="text-2xl font-bold font-display text-white mt-1 mb-4">
                TEAM FORMATION
              </h3>

              <div className="p-4 rounded-xl bg-space-950/80 border border-cyan-500/20 text-center my-4">
                <div className="text-4xl font-extrabold font-mono text-cyan-300">
                  {eligibility.teamSize.min} – {eligibility.teamSize.max}
                </div>
                <div className="text-xs font-mono text-slate-300 uppercase mt-1">
                  MEMBERS PER TEAM
                </div>
              </div>

              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                {eligibility.teamSize.note}
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800 text-[11px] font-mono text-slate-300">
              SOLO PARTICIPATION NOT PERMITTED
            </div>
          </GlassCard>

          {/* Academic & Disciplinary Qualifications */}
          <GlassCard glowColor="violet" className="p-8 flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-space-950 border border-purple-500/30 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                <Shield className="w-7 h-7 text-purple-400" />
              </div>

              <span className="text-xs font-mono uppercase tracking-widest text-purple-400 font-semibold">
                ACADEMIC CLEARANCE
              </span>

              <h3 className="text-2xl font-bold font-display text-white mt-1 mb-4">
                ELIGIBLE COHORTS
              </h3>

              <ul className="space-y-3">
                {eligibility.qualifications.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <CheckCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800 text-[11px] font-mono text-slate-300">
              GOVERNMENT & AICTE AFFILIATED INSTITUTES
            </div>
          </GlassCard>

          {/* Important Instructions & Integrity */}
          <GlassCard glowColor="amber" className="p-8 flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-space-950 border border-amber-500/30 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <AlertTriangle className="w-7 h-7 text-amber-400" />
              </div>

              <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold">
                REGULATORY MANDATE
              </span>

              <h3 className="text-2xl font-bold font-display text-white mt-1 mb-4">
                IMPORTANT INSTRUCTIONS
              </h3>

              <ul className="space-y-3">
                {eligibility.rules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800 text-[11px] font-mono text-amber-400/80">
              STRICT FAIR-PLAY COMPLIANCE
            </div>
          </GlassCard>

        </div>

      </div>
    </section>
  );
};
