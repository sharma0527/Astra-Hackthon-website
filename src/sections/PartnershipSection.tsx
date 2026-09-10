import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { SectionHeading } from '../components/ui/SectionHeading';
import { eventConfig } from '../data/eventConfig';
import { ExternalLink, Award, Code2, Building2 } from 'lucide-react';

export const PartnershipSection: React.FC = () => {
  const getPartnerIcon = (short: string) => {
    switch (short) {
      case 'NRIIT':
        return <Building2 className="w-8 h-8 text-cyan-400" />;
      case 'MTX':
        return <Award className="w-8 h-8 text-purple-400" />;
      case 'NCC':
      default:
        return <Code2 className="w-8 h-8 text-emerald-400" />;
    }
  };

  return (
    <section id="partners" className="relative py-20 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-7xl mx-auto">
        
        <SectionHeading
          badge="STRATEGIC ALLIANCE"
          title="POWERED BY COLLABORATION"
          subtitle="An official high-impact tripartite partnership bringing academia, global enterprise, and elite developer talent together."
        />

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {eventConfig.partners.map((partner, index) => (
            <GlassCard
              key={partner.name}
              glowColor={index === 1 ? 'violet' : 'cyan'}
              className="p-8 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Background ambient badge glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 group-hover:bg-cyan-500/10 rounded-full blur-2xl transition-all duration-300 pointer-events-none" />

              <div>
                {/* Logo & Symbol Representation */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-space-950/80 border border-cyan-500/30 flex items-center justify-center p-3 shadow-[0_0_20px_rgba(0,240,255,0.15)] group-hover:border-cyan-400 transition-colors">
                    {getPartnerIcon(partner.short)}
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono tracking-wider bg-space-950 border border-slate-700 text-slate-300">
                    {partner.role}
                  </span>
                </div>

                <h3 className="text-xl font-bold font-display text-white group-hover:text-cyan-300 transition-colors">
                  {partner.name}
                </h3>
                
                <p className="mt-3 text-sm text-slate-400 leading-relaxed font-sans">
                  {partner.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-cyan-400">
                <span>OFFICIAL PARTNER</span>
                {partner.link !== '#' && (
                  <a
                    href={partner.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-white transition-colors"
                  >
                    <span>VISIT</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Partnership Bridge Notation */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-space-900/60 border border-cyan-500/20 text-xs font-mono text-slate-300 shadow-glass">
            <span className="text-white font-semibold">NRI INSTITUTE OF TECHNOLOGY</span>
            <span className="text-cyan-400 font-bold">×</span>
            <span className="text-white font-semibold">MTX</span>
            <span className="text-cyan-400 font-bold">×</span>
            <span className="text-white font-semibold">NRIIT CODING CLUB</span>
          </div>
        </div>

      </div>
    </section>
  );
};
