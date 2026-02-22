/** @type {import('tailwindcss').Config} — Tailwind v3 preset format */
export default {
  theme: {
    extend: {
      colors: {
        page: 'var(--bg-page)',
        surface: 'var(--bg-surface)',
        elevated: 'var(--bg-elevated)',
        subtle: 'var(--bg-subtle)',
        muted: 'var(--bg-muted)',

        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'text-on-accent': 'var(--text-on-accent)',
        'text-on-yellow': 'var(--text-on-yellow)',

        'border-default': 'var(--border-default)',
        'border-strong': 'var(--border-strong)',
        'border-subtle': 'var(--border-subtle)',

        blue: {
          DEFAULT: 'var(--accent-blue)',
          hover: 'var(--accent-blue-hover)',
          subtle: 'var(--accent-blue-subtle)',
          text: 'var(--accent-blue-text)',
        },
        red: {
          DEFAULT: 'var(--accent-red)',
          hover: 'var(--accent-red-hover)',
          subtle: 'var(--accent-red-subtle)',
          text: 'var(--accent-red-text)',
        },
        yellow: {
          DEFAULT: 'var(--accent-yellow)',
          hover: 'var(--accent-yellow-hover)',
          subtle: 'var(--accent-yellow-subtle)',
          text: 'var(--accent-yellow-text)',
        },
        green: {
          DEFAULT: 'var(--accent-green)',
          hover: 'var(--accent-green-hover)',
          subtle: 'var(--accent-green-subtle)',
          text: 'var(--accent-green-text)',
        },

        'status-info': 'var(--status-info)',
        'status-error': 'var(--status-error)',
        'status-warning': 'var(--status-warning)',
        'status-success': 'var(--status-success)',

        'focus-ring': 'var(--focus-ring)',
        overlay: 'var(--overlay-bg)',
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'Cascadia Code', 'monospace'],
      },

      fontSize: {
        'step--2': 'var(--step--2)',
        'step--1': 'var(--step--1)',
        'step-0': 'var(--step-0)',
        'step-1': 'var(--step-1)',
        'step-2': 'var(--step-2)',
        'step-3': 'var(--step-3)',
        'step-4': 'var(--step-4)',
        'step-5': 'var(--step-5)',
      },

      letterSpacing: {
        tight: 'var(--tracking-tight)',
        tighter: 'var(--tracking-tighter)',
        tightest: 'var(--tracking-tightest)',
      },

      lineHeight: {
        none: 'var(--leading-none)',
        tight: 'var(--leading-tight)',
        snug: 'var(--leading-snug)',
        normal: 'var(--leading-normal)',
        relaxed: 'var(--leading-relaxed)',
      },

      spacing: {
        '1': 'var(--space-1)',
        '2': 'var(--space-2)',
        '3': 'var(--space-3)',
        '4': 'var(--space-4)',
        '5': 'var(--space-5)',
        '6': 'var(--space-6)',
        '8': 'var(--space-8)',
        '10': 'var(--space-10)',
        '12': 'var(--space-12)',
        '16': 'var(--space-16)',
        '20': 'var(--space-20)',
      },

      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        full: 'var(--radius-full)',
      },

      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        blue: 'var(--shadow-blue)',
        red: 'var(--shadow-red)',
        yellow: 'var(--shadow-yellow)',
      },

      transitionDuration: {
        instant: 'var(--motion-instant)',
        fast: 'var(--motion-fast)',
        base: 'var(--motion-base)',
        slow: 'var(--motion-slow)',
      },

      transitionTimingFunction: {
        out: 'var(--ease-out)',
        bounce: 'var(--ease-bounce)',
        smooth: 'var(--ease-smooth)',
      },
    },
  },
}
