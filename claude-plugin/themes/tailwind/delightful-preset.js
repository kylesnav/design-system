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
        'text-on-gold': 'var(--text-on-gold)',

        'border-default': 'var(--border-default)',
        'border-strong': 'var(--border-strong)',
        'border-subtle': 'var(--border-subtle)',

        primary: {
          DEFAULT: 'var(--accent-primary)',
          hover: 'var(--accent-primary-hover)',
          subtle: 'var(--accent-primary-subtle)',
          text: 'var(--accent-primary-text)',
        },
        danger: {
          DEFAULT: 'var(--accent-danger)',
          hover: 'var(--accent-danger-hover)',
          subtle: 'var(--accent-danger-subtle)',
          text: 'var(--accent-danger-text)',
        },
        gold: {
          DEFAULT: 'var(--accent-gold)',
          hover: 'var(--accent-gold-hover)',
          subtle: 'var(--accent-gold-subtle)',
          text: 'var(--accent-gold-text)',
        },
        cyan: {
          DEFAULT: 'var(--accent-cyan)',
          hover: 'var(--accent-cyan-hover)',
          subtle: 'var(--accent-cyan-subtle)',
          text: 'var(--accent-cyan-text)',
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
        'ui-2xs': 'var(--ui-text-2xs)',
        'ui-xs': 'var(--ui-text-xs)',
        'ui-sm': 'var(--ui-text-sm)',
        'ui-md': 'var(--ui-text-md)',
        'ui-lg': 'var(--ui-text-lg)',
        'ui-xl': 'var(--ui-text-xl)',
      },

      height: {
        'control-sm': 'var(--control-sm)',
        'control-md': 'var(--control-md)',
        'control-lg': 'var(--control-lg)',
        'control-xl': 'var(--control-xl)',
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
        '1-5': 'var(--space-1-5)',
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
        'btn-gap': 'var(--btn-gap)',
        'badge-y': 'var(--badge-py)',
        'badge-x': 'var(--badge-px)',
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
        pink: 'var(--shadow-pink)',
        danger: 'var(--shadow-danger)',
        gold: 'var(--shadow-gold)',
        cyan: 'var(--shadow-cyan)',
        green: 'var(--shadow-green)',
      },

      transitionDuration: {
        instant: 'var(--motion-instant)',
        fast: 'var(--motion-fast)',
        base: 'var(--motion-base)',
        slow: 'var(--motion-slow)',
        deliberate: 'var(--motion-deliberate)',
      },

      transitionTimingFunction: {
        out: 'var(--ease-out)',
        bounce: 'var(--ease-bounce)',
        smooth: 'var(--ease-smooth)',
        slam: 'var(--ease-slam)',
        elastic: 'var(--ease-elastic)',
      },

      zIndex: {
        base: 'var(--z-base)',
        sticky: 'var(--z-sticky)',
        fixed: 'var(--z-fixed)',
        overlay: 'var(--z-overlay)',
        modal: 'var(--z-modal)',
        toast: 'var(--z-toast)',
        tooltip: 'var(--z-tooltip)',
      },

      maxWidth: {
        'container-sm': 'var(--container-sm)',
        'container-md': 'var(--container-md)',
        'container-lg': 'var(--container-lg)',
      },
    },
  },
}
