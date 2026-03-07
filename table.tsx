@import 'tailwindcss';
@import 'tw-animate-css';

@custom-variant dark (&:is(.dark *));

:root {
  --navy: #0a1628;
  --navy2: #111f3a;
  --navy3: #1a2f52;
  --yellow: #f5c518;
  --green: #22c55e;
  --red: #ef4444;
  --orange: #f97316;
  --blue: #3b82f6;
  --gray: #94a3b8;
  --light: #e2e8f0;
  --card-bg: #162035;
  --border-color: #1e3050;

  --background: #0a1628;
  --foreground: #e2e8f0;
  --card: #162035;
  --card-foreground: #e2e8f0;
  --popover: #111f3a;
  --popover-foreground: #e2e8f0;
  --primary: #f5c518;
  --primary-foreground: #0a1628;
  --secondary: #1a2f52;
  --secondary-foreground: #e2e8f0;
  --muted: #1a2f52;
  --muted-foreground: #94a3b8;
  --accent: #3b82f6;
  --accent-foreground: #ffffff;
  --destructive: #ef4444;
  --destructive-foreground: #ffffff;
  --border: #1e3050;
  --input: #1a2f52;
  --ring: #f5c518;
  --radius: 0.75rem;
}

@theme inline {
  --font-sans: 'Geist', 'Geist Fallback', system-ui, -apple-system, sans-serif;
  --font-mono: 'Geist Mono', 'Geist Mono Fallback', monospace;
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

@layer base {
  * {
    @apply border-border;
    -webkit-tap-highlight-color: transparent;
  }
  body {
    @apply bg-background text-foreground;
  }
}

/* PWA standalone overrides */
@media all and (display-mode: standalone) {
  body {
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
  }
}

/* Prevent pull-to-refresh and overscroll */
html, body {
  overscroll-behavior: none;
}

/* Smooth scrolling for iOS */
.scroll-touch {
  -webkit-overflow-scrolling: touch;
}

/* Hide scrollbar but keep scrolling */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
