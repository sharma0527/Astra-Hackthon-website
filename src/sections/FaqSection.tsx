import { useState } from 'react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { GlassCard } from '../components/ui/GlassCard';
import { eventConfig, type FaqItem } from '../data/eventConfig';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative py-24 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-4xl mx-auto">
        
        <SectionHeading
          badge="KNOWLEDGE REPOSITORY"
          title="FREQUENTLY ASKED QUESTIONS"
          subtitle="Everything you need to know about registering, teaming up, and hacking at ASTRA 2026."
        />

        <div className="space-y-4">
          {eventConfig.faqs.map((faq: FaqItem, index: number) => {
            const isOpen = openIndex === index;

            return (
              <GlassCard
                key={faq.question}
                glowColor={isOpen ? 'cyan' : 'none'}
                className={`transition-all duration-300 ${isOpen ? 'border-cyan-400/40 shadow-[0_0_20px_rgba(0,240,255,0.15)]' : ''}`}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-space-950 border border-cyan-500/20 flex items-center justify-center shrink-0">
                      <HelpCircle className="w-4 h-4 text-cyan-400" />
                    </div>
                    <span className="text-base sm:text-lg font-bold font-display text-white">
                      {faq.question}
                    </span>
                  </div>
                  <div className="shrink-0 text-cyan-400">
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm text-slate-300 leading-relaxed font-sans border-t border-slate-800/80 animate-fadeIn">
                    <p>{faq.answer}</p>
                    <div className="mt-3 text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                      CATEGORY: {faq.category}
                    </div>
                  </div>
                )}
              </GlassCard>
            );
          })}
        </div>

      </div>
    </section>
  );
};
