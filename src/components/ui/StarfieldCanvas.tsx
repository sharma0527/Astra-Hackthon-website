import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleDirection: number;
  color: string;
}

export const StarfieldCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Color palette for cosmic stars
    const starColors = ['#FFFFFF', '#00F0FF', '#8B5CF6', '#38BDF8', '#E2E8F0'];
    const numStars = Math.min(Math.floor((width * height) / 4500), 220);

    const stars: Star[] = Array.from({ length: numStars }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.4,
      speed: Math.random() * 0.25 + 0.05,
      opacity: Math.random() * 0.7 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinkleDirection: Math.random() > 0.5 ? 1 : -1,
      color: starColors[Math.floor(Math.random() * starColors.length)]
    }));

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const shouldAnimate = !mediaQuery.matches;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle cosmic dust nebula gradient
      const grad = ctx.createRadialGradient(
        width * 0.65,
        height * 0.25,
        50,
        width * 0.65,
        height * 0.25,
        width * 0.7
      );
      grad.addColorStop(0, 'rgba(139, 92, 246, 0.08)');
      grad.addColorStop(0.5, 'rgba(0, 240, 255, 0.04)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Render Stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        if (shouldAnimate) {
          star.y -= star.speed;
          if (star.y < 0) {
            star.y = height;
            star.x = Math.random() * width;
          }

          star.opacity += star.twinkleSpeed * star.twinkleDirection;
          if (star.opacity > 0.9) {
            star.opacity = 0.9;
            star.twinkleDirection = -1;
          } else if (star.opacity < 0.2) {
            star.opacity = 0.2;
            star.twinkleDirection = 1;
          }
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.opacity;
        ctx.shadowBlur = star.size > 1.2 ? 6 : 0;
        ctx.shadowColor = star.color;
        ctx.fill();
      }

      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;

      if (shouldAnimate) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
    />
  );
};
