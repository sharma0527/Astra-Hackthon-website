import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'violet' | 'amber' | 'none';
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  glowColor = 'cyan',
  hoverEffect = true,
  ...props
}) => {
  const glowStyles = {
    cyan: 'border-cyan-500/20 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(0,240,255,0.2)]',
    violet: 'border-purple-500/20 hover:border-purple-400/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]',
    amber: 'border-amber-500/20 hover:border-amber-400/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]',
    none: 'border-slate-800'
  };

  return (
    <div
      className={`relative rounded-2xl bg-space-900/60 backdrop-blur-xl border transition-all duration-300 ${
        glowStyles[glowColor]
      } ${hoverEffect ? 'hover:-translate-y-1' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
