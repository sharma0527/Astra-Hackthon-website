/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#02040a',
          900: '#060b18',
          850: '#0a1026',
          800: '#0f1738',
          700: '#18244e',
          600: '#23336d',
        },
        cyan: {
          neon: '#00F0FF',
          glow: '#38BDF8',
        },
        violet: {
          neon: '#8B5CF6',
          glow: '#A855F7',
          deep: '#6D28D9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        mono: ['Space Grotesk', 'monospace'],
      },
      backgroundImage: {
        'cosmic-gradient': 'radial-gradient(ellipse at top, #101c44 0%, #060b18 50%, #02040a 100%)',
        'cyber-gradient': 'linear-gradient(135deg, rgba(0,240,255,0.15) 0%, rgba(139,92,246,0.15) 100%)',
        'nebula-gradient': 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.18) 0%, rgba(0, 240, 255, 0.08) 45%, transparent 70%)',
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(0, 240, 255, 0.35)',
        'neon-cyan-lg': '0 0 35px rgba(0, 240, 255, 0.55)',
        'neon-violet': '0 0 20px rgba(139, 92, 246, 0.35)',
        'neon-violet-lg': '0 0 35px rgba(139, 92, 246, 0.55)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        }
      }
    },
  },
  plugins: [],
}
