import { useEffect, useState, useRef } from 'react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { GlassCard } from '../components/ui/GlassCard';
import { eventConfig } from '../data/eventConfig';
import { Compass, Flame, ShieldCheck, Zap, Bolt, CheckCircle2, Users } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const statIcons = [
    <Flame key="flame" className="w-5 h-5 text-amber-400" />,
    <Compass key="compass" className="w-5 h-5 text-cyan-400" />,
    <Zap key="zap" className="w-5 h-5 text-purple-400" />,
    <ShieldCheck key="shield" className="w-5 h-5 text-emerald-400" />
  ];

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-20 px-4 sm:px-6 lg:px-8 z-10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Streamlined 3 Pillars Highlight matching user design */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-center">
            {/* Card 1 */}
            <div className="cyber-glass-card hud-brackets p-6 rounded-2xl flex flex-col items-center group cursor-pointer hover:border-[#00f2fe]/50">
              <div className="w-12 h-12 rounded-full bg-[#00f2fe]/10 border border-[#00f2fe]/30 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-[#00f2fe]/20 transition-all duration-300">
                <Bolt className="text-[#00f2fe] w-6 h-6" />
              </div>
              <span className="text-3xl sm:text-4xl font-extrabold text-[#00f2fe] mb-1 tracking-tight drop-shadow-[0_0_15px_rgba(0,242,254,0.4)] font-mono">
                24H
              </span>
              <span className="text-sm font-bold text-white tracking-wide group-hover:text-cyan-300 transition-colors">
                Continuous Sprint
              </span>
              <span className="text-xs text-slate-400 mt-2 leading-relaxed">
                Non-stop power, lab facilities &amp; high-speed WiFi
              </span>
            </div>

            {/* Card 2 */}
            <div className="cyber-glass-card hud-brackets p-6 rounded-2xl flex flex-col items-center group cursor-pointer hover:border-[#b827fc]/50">
              <div className="w-12 h-12 rounded-full bg-[#b827fc]/10 border border-[#b827fc]/30 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-[#b827fc]/20 transition-all duration-300">
                <CheckCircle2 className="text-[#d1bcff] w-6 h-6" />
              </div>
              <span className="text-3xl sm:text-4xl font-extrabold text-[#d1bcff] mb-1 tracking-tight drop-shadow-[0_0_15px_rgba(209,188,255,0.4)] font-mono">
                ₹0
              </span>
              <span className="text-sm font-bold text-white tracking-wide group-hover:text-purple-300 transition-colors">
                Free Registration
              </span>
              <span className="text-xs text-slate-400 mt-2 leading-relaxed">
                Open to collegiate teams of 2 to 4 students
              </span>
            </div>

            {/* Card 3 */}
            <div className="cyber-glass-card hud-brackets p-6 rounded-2xl flex flex-col items-center group cursor-pointer hover:border-[#4facfe]/50">
              <div className="w-12 h-12 rounded-full bg-[#4facfe]/10 border border-[#4facfe]/30 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-[#4facfe]/20 transition-all duration-300">
                <Users className="text-[#99deff] w-6 h-6" />
              </div>
              <span className="text-3xl sm:text-4xl font-extrabold text-[#99deff] mb-1 tracking-tight drop-shadow-[0_0_15px_rgba(153,222,255,0.4)] font-mono">
                MTX
              </span>
              <span className="text-sm font-bold text-white tracking-wide group-hover:text-cyan-300 transition-colors">
                Industry Mentorship
              </span>
              <span className="text-xs text-slate-400 mt-2 leading-relaxed">
                Direct feedback, engineering jury &amp; network
              </span>
            </div>
          </div>
        </div>

        <SectionHeading
          badge="MISSION & PHILOSOPHY"
          title="REACH BEYOND THE ORDINARY"
          subtitle="A cosmic proving ground designed for visionary coders, designers, and problem solvers."
        />

        {/* Narrative Banner */}
        <div className="max-w-4xl mx-auto mb-16">
          <GlassCard glowColor="cyan" className="p-8 sm:p-10 text-center relative overflow-hidden">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <p className="text-lg sm:text-2xl text-slate-200 font-sans font-medium leading-relaxed">
              &ldquo;{eventConfig.aboutText}&rdquo;
            </p>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs font-mono text-cyan-400 tracking-wider">
              <span>ASTRA PROTOCOL</span>
              <span>•</span>
              <span>EST. 2026</span>
            </div>
          </GlassCard>
        </div>

        {/* Animated Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {eventConfig.statistics.map((stat, idx) => {
            return (
              <GlassCard
                key={stat.label}
                glowColor={idx % 2 === 0 ? 'cyan' : 'violet'}
                className="p-6 sm:p-8 flex flex-col justify-between text-center relative group"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-xl bg-space-950 border border-slate-700/80 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.1)] group-hover:border-cyan-400/50 transition-colors">
                    {statIcons[idx]}
                  </div>
                </div>

                <div>
                  <div className="text-4xl sm:text-5xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-purple-200">
                    {hasAnimated ? stat.value : 0}
                    <span className="text-cyan-400">{stat.suffix}</span>
                  </div>
                  
                  <div className="mt-3 text-sm font-bold font-mono tracking-wider text-slate-200 uppercase">
                    {stat.label}
                  </div>
                  
                  <p className="mt-1 text-xs text-slate-400">
                    {stat.sublabel}
                  </p>
                </div>
              </GlassCard>
            );
          })}
        </div>

      </div>
    </section>
  );
};
