/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#F7F4EC',
          subtle: '#EFECE3',
          card: '#FFFFFF',
          border: '#E7E1D3'
        },
        ink: {
          DEFAULT: '#101828',
          muted: '#5B6472',
          light: '#8590A2'
        },
        cobalt: {
          DEFAULT: '#2340F5',
          hover: '#1A31C4',
          subtle: 'rgba(35, 64, 245, 0.08)',
          light: '#EBEFFF'
        },
        highlight: {
          lemon: '#F4E04D',
          peach: '#FFD9C2',
          mint: '#BFEBD7',
          sky: '#CFE0FF'
        },
        risk: {
          low: '#16A34A',
          lowBg: '#DCFCE7',
          medium: '#F59E0B',
          mediumBg: '#FEF3C7',
          high: '#E5484D',
          highBg: '#FEE2E2'
        }
      },
      fontFamily: {
        sans: ['Manrope', 'Inter', 'sans-serif'],
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      boxShadow: {
        'hard': '4px 4px 0px #101828',
        'hard-sm': '2px 2px 0px #101828',
        'hard-lg': '6px 6px 0px #101828',
        'hard-cobalt': '4px 4px 0px #1A31C4',
        'hard-risk-low': '4px 4px 0px #16A34A',
        'hard-risk-high': '4px 4px 0px #E5484D',
        'soft': '0 4px 20px -2px rgba(16, 24, 40, 0.05)',
        'glass': '0 8px 32px 0 rgba(16, 24, 40, 0.06)'
      }
    },
  },
  plugins: [],
}
