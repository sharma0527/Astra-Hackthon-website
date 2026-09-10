import React from 'react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { GlassCard } from '../components/ui/GlassCard';
import { eventConfig } from '../data/eventConfig';
import { Globe2, Lightbulb, Users, Share2, Award, Rocket } from 'lucide-react';

export const WhyAstraSection: React.FC = () => {
  const getIcon = (iconName: string) => {
    const props = { className: "w-6 h-6 text-cyan-400" };
    switch (iconName) {
      case 'Globe2': return <Globe2 {...props} />;
      case 'Lightbulb': return <Lightbulb {...props} />;
      case 'Users': return <Users {...props} />;
      case 'Share2': return <Share2 {...props} />;
      case 'Award': return <Award {...props} />;
      case 'Rocket':
      default:
        return <Rocket {...props} />;
    }
  };

  return (
    <section id="why-astra" className="relative py-24 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-7xl mx-auto">
        
        <SectionHeading
          badge="VALUE PROPOSITION"
          title="WHY ASTRA?"
          subtitle="More than a competition — an acceleration springboard designed to propel your engineering career."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventConfig.whyAstra.map((item, index) => (
            <GlassCard
              key={item.id}
              glowColor={index % 2 === 0 ? 'cyan' : 'violet'}
              className="p-8 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Background corner accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 group-hover:bg-cyan-500/15 rounded-bl-full transition-colors duration-300 pointer-events-none" />

              <div>
                <div className="w-12 h-12 rounded-xl bg-space-950 border border-cyan-500/20 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(0,240,255,0.15)] group-hover:border-cyan-400 transition-colors">
                  {getIcon(item.iconName)}
                </div>

                <h3 className="text-lg font-bold font-mono tracking-wider text-white uppercase group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm text-slate-400 leading-relaxed font-sans">
                  {item.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-300">
                <span>PILLAR 0{index + 1}</span>
                <span className="text-cyan-400 opacity-60 group-hover:opacity-100 transition-opacity">
                  VERIFIED
                </span>
              </div>
            </GlassCard>
          ))}
        </div>

      </div>
    </section>
  );
};
