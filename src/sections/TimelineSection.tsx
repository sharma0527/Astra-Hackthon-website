import { useState } from 'react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { GlassCard } from '../components/ui/GlassCard';
import { eventConfig, type TimelineItem } from '../data/eventConfig';
import { Calendar, Clock, CheckCircle2 } from 'lucide-react';

export const TimelineSection: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<TimelineItem>(eventConfig.timeline[1]); // Default to active step

  return (
    <section id="timeline" className="relative py-24 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-7xl mx-auto">
        
        <SectionHeading
          badge="MISSION SCHEDULE"
          title="MISSION TRAJECTORY"
          subtitle="Navigate the sequence from initial registration to the grand valedictory ceremony."
        />

        {/* Selected Milestone Spotlight Banner */}
        <div className="mb-12">
          <GlassCard glowColor="cyan" className="p-6 sm:p-8 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-mono tracking-widest uppercase ${
                    selectedItem.status === 'completed'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                      : selectedItem.status === 'active'
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-400/50 shadow-[0_0_15px_rgba(0,240,255,0.3)] animate-pulse'
                      : 'bg-space-950 text-slate-400 border border-slate-700'
                  }`}>
                    {selectedItem.status.toUpperCase()} STAGE
                  </span>
                  <span className="text-xs font-mono text-cyan-400">
                    STAGE #{eventConfig.timeline.findIndex(t => t.id === selectedItem.id) + 1} OF {eventConfig.timeline.length}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">
                  {selectedItem.title}
                </h3>
                <p className="mt-2 text-sm text-slate-300 max-w-2xl">
                  {selectedItem.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-space-950/80 p-4 rounded-xl border border-slate-800 shrink-0">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span>{selectedItem.date}</span>
                </div>
                <div className="hidden sm:block text-slate-700">|</div>
                <div className="flex items-center gap-2 text-xs font-mono text-purple-300">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span>{selectedItem.time}</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Desktop View: Horizontal Timeline with Milestone Nodes */}
        <div className="hidden lg:block relative py-8">
          {/* Connector Line */}
          <div className="absolute top-1/2 left-4 right-4 h-1 bg-gradient-to-r from-cyan-500/30 via-purple-500/40 to-slate-800 -translate-y-1/2 rounded-full z-0" />

          <div className="relative z-10 flex justify-between items-center">
            {eventConfig.timeline.map((item, index) => {
              const isSelected = selectedItem.id === item.id;
              const isCompleted = item.status === 'completed';
              const isActive = item.status === 'active';

              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="group flex flex-col items-center focus:outline-none"
                  style={{ width: `${100 / eventConfig.timeline.length}%` }}
                >
                  {/* Step Number */}
                  <span className={`text-[10px] font-mono mb-2 transition-colors ${
                    isSelected ? 'text-cyan-300 font-bold' : 'text-slate-300 group-hover:text-cyan-400'
                  }`}>
                    0{index + 1}
                  </span>

                  {/* Node Circle */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isSelected
                      ? 'bg-cyan-400 text-black scale-125 shadow-[0_0_20px_rgba(0,240,255,0.8)]'
                      : isActive
                      ? 'bg-space-950 border-2 border-cyan-400 text-cyan-400 animate-pulse'
                      : isCompleted
                      ? 'bg-emerald-950 border border-emerald-400 text-emerald-400'
                      : 'bg-space-950 border border-slate-700 text-slate-400 group-hover:border-cyan-500/50'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <span className="text-xs font-bold font-mono">{index + 1}</span>
                    )}
                  </div>

                  {/* Title Label */}
                  <span className={`mt-3 text-xs font-mono text-center px-1 line-clamp-2 transition-colors ${
                    isSelected ? 'text-white font-bold' : 'text-slate-400 group-hover:text-slate-200'
                  }`}>
                    {item.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile & Tablet View: Vertical Interactive Timeline */}
        <div className="lg:hidden relative pl-6 sm:pl-8 space-y-6 border-l-2 border-cyan-500/30">
          {eventConfig.timeline.map((item, index) => {
            const isSelected = selectedItem.id === item.id;
            const isCompleted = item.status === 'completed';
            const isActive = item.status === 'active';

            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`relative cursor-pointer transition-all duration-300 ${
                  isSelected ? 'scale-[1.02]' : 'opacity-85 hover:opacity-100'
                }`}
              >
                {/* Node on Vertical Border */}
                <div className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(0,240,255,0.8)]'
                    : isActive
                    ? 'bg-space-950 border-2 border-cyan-400 text-cyan-400'
                    : isCompleted
                    ? 'bg-emerald-950 border border-emerald-400 text-emerald-400'
                    : 'bg-space-950 border border-slate-700 text-slate-300'
                }`}>
                  <span className="text-[10px] font-mono font-bold">{index + 1}</span>
                </div>

                <GlassCard
                  glowColor={isSelected ? 'cyan' : 'none'}
                  className={`p-4 sm:p-5 ${isSelected ? 'border-cyan-400/50' : ''}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-base font-bold font-display text-white">
                      {item.title}
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-space-950 text-cyan-300 border border-cyan-500/20 shrink-0">
                      {item.date}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400 font-sans">
                    {item.description}
                  </p>
                </GlassCard>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
