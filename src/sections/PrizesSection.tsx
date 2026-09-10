import React from 'react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { GlassCard } from '../components/ui/GlassCard';
import { eventConfig } from '../data/eventConfig';
import { Trophy, Medal, Sparkles, Check, Gift } from 'lucide-react';

export const PrizesSection: React.FC = () => {
  const getPodiumIcon = (tier: string) => {
    switch (tier) {
      case 'WINNER':
        return <Trophy className="w-10 h-10 text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]" />;
      case '1ST RUNNER-UP':
        return <Medal className="w-9 h-9 text-slate-300 drop-shadow-[0_0_15px_rgba(203,213,225,0.5)]" />;
      case '2ND RUNNER-UP':
      default:
        return <Medal className="w-9 h-9 text-amber-600 drop-shadow-[0_0_15px_rgba(180,83,9,0.5)]" />;
    }
  };

  return (
    <section id="prizes" className="relative py-24 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-7xl mx-auto">
        
        <SectionHeading
          badge="REWARDS & RECOGNITION"
          title="BUILD. COMPETE. WIN."
          subtitle="Compete for prestige, cash bounties, trophies, and direct corporate incubation tracks."
        />

        {/* Podium Grid (Winner in Center or Order 1st Runner Up, Winner, 2nd Runner Up) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-16">
          {eventConfig.prizes.podium.map((prize) => {
            const isWinner = prize.tier === 'WINNER';

            return (
              <GlassCard
                key={prize.tier}
                glowColor={isWinner ? 'amber' : 'cyan'}
                className={`p-8 flex flex-col justify-between relative overflow-hidden ${
                  isWinner
                    ? 'border-amber-400/50 md:-translate-y-4 shadow-[0_0_40px_rgba(245,158,11,0.2)] order-first md:order-none'
                    : ''
                }`}
              >
                {/* Winner Ribbon */}
                {isWinner && (
                  <div className="absolute -top-1 -right-1 bg-gradient-to-l from-amber-400 to-amber-600 text-black font-mono font-bold text-[10px] tracking-widest uppercase px-4 py-1 rounded-bl-xl shadow-lg flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    GRAND CHAMPION
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-space-950 border border-slate-700/80 flex items-center justify-center">
                      {getPodiumIcon(prize.tier)}
                    </div>
                    <span className="text-xs font-mono tracking-widest text-slate-400 uppercase">
                      {prize.tier}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold font-display text-white">
                    {prize.title}
                  </h3>

                  <div className="my-6">
                    <span className="text-4xl sm:text-5xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-amber-200">
                      {prize.amount}
                    </span>
                    <span className="block text-xs font-mono text-slate-400 mt-1">
                      CASH GRANT & TROPHIES
                    </span>
                  </div>

                  {/* Perks List */}
                  <div className="space-y-3 pt-4 border-t border-slate-800">
                    <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block font-semibold">
                      INCLUDED BENEFITS:
                    </span>
                    <ul className="space-y-2">
                      {prize.perks.map((perk, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                          <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-800/80 text-center">
                  <span className="text-xs font-mono text-slate-300 tracking-wider">
                    OFFICIAL NRIIT × MTX AWARD
                  </span>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Special Category Awards */}
        <div className="border-t border-slate-800 pt-16">
          <div className="text-center mb-10">
            <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
              SPECIAL EXCELLENCE AWARDS
            </h3>
            <p className="text-xs sm:text-sm font-mono text-cyan-400 mt-1">
              ADDITIONAL ₹30,000 CATEGORY PRIZE POOL
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {eventConfig.prizes.specialAwards.map((special) => (
              <GlassCard
                key={special.category}
                glowColor="violet"
                className="p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Gift className="w-5 h-5 text-purple-400" />
                    <span className="text-base font-bold font-mono text-cyan-300">
                      {special.amount}
                    </span>
                  </div>
                  <h4 className="text-base font-bold font-display text-white mb-2">
                    {special.category}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    {special.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 text-[10px] font-mono text-slate-300">
                  CITATION & BADGE
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
