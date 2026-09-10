import { useState } from 'react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { GlassCard } from '../components/ui/GlassCard';
import { eventConfig, type ChallengeTheme } from '../data/eventConfig';
import {
  BrainCircuit,
  Coins,
  Activity,
  GraduationCap,
  ShieldAlert,
  Leaf,
  Cpu,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Tag
} from 'lucide-react';

export const ChallengesSection: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getThemeIcon = (iconName: string) => {
    const props = { className: "w-6 h-6 text-cyan-400" };
    switch (iconName) {
      case 'BrainCircuit': return <BrainCircuit {...props} />;
      case 'Coins': return <Coins {...props} />;
      case 'Activity': return <Activity {...props} />;
      case 'GraduationCap': return <GraduationCap {...props} />;
      case 'ShieldAlert': return <ShieldAlert {...props} />;
      case 'Leaf': return <Leaf {...props} />;
      case 'Cpu': return <Cpu {...props} />;
      case 'Sparkles':
      default:
        return <Sparkles {...props} />;
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="challenges" className="relative py-24 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-7xl mx-auto">
        
        <SectionHeading
          badge="HACKATHON TRACKS"
          title="EXPLORE THE FRONTIER"
          subtitle="Choose from 8 cutting-edge challenge domains or engineer your own breakthrough in Open Innovation."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {eventConfig.themes.map((theme: ChallengeTheme) => {
            const isExpanded = expandedId === theme.id;

            return (
              <GlassCard
                key={theme.id}
                glowColor="cyan"
                className={`p-6 flex flex-col justify-between transition-all duration-300 ${
                  isExpanded ? 'lg:col-span-2 border-cyan-400/60 shadow-[0_0_35px_rgba(0,240,255,0.25)]' : ''
                }`}
              >
                <div>
                  {/* Top Bar: Icon and Badges */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-space-950 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                      {getThemeIcon(theme.iconName)}
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-300 px-2.5 py-1 rounded-md bg-space-950/80 border border-slate-700">
                      TRACK #{theme.id.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold font-display text-white mb-2">
                    {theme.title}
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed font-sans mb-4">
                    {theme.shortDesc}
                  </p>

                  {/* Expandable Details Area */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-800 space-y-4 animate-fadeIn">
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {theme.fullDesc}
                      </p>

                      <div>
                        <div className="text-[11px] font-mono tracking-wider text-cyan-400 uppercase font-semibold mb-2">
                          Sample Problem Focus:
                        </div>
                        <ul className="space-y-1.5 text-xs text-slate-300">
                          {theme.sampleProblems.map((prob, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-cyan-400 font-mono mt-0.5">•</span>
                              <span>{prob}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {theme.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-space-950 text-cyan-300 border border-cyan-500/20"
                          >
                            <Tag className="w-2.5 h-2.5 text-cyan-400" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card footer / expand toggle */}
                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <button
                    onClick={() => toggleExpand(theme.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors focus:outline-none"
                  >
                    <span>{isExpanded ? 'COLLAPSE DETAILS' : 'EXPLORE PROBLEM BRIEF'}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>

      </div>
    </section>
  );
};
