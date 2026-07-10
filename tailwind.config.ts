import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "hsl(var(--bg))",
        fg: "hsl(var(--fg))",
        background: "hsl(var(--bg))",
        foreground: "hsl(var(--fg))",
        card: "hsl(var(--card))",
        "card-fg": "hsl(var(--card-fg))",
        primary: "hsl(var(--primary))",
        "primary-fg": "hsl(var(--primary-fg))",
        muted: "hsl(var(--muted))",
        "muted-fg": "hsl(var(--muted-fg))",
        border: "hsl(var(--border))"
      },
      boxShadow: {
        soft: "0 24px 60px rgba(15, 23, 42, 0.14)"
      },
      backgroundImage: {
        "bank-gradient": "radial-gradient(circle at top left, rgba(59,130,246,.20), transparent 32%), radial-gradient(circle at bottom right, rgba(14,165,233,.12), transparent 30%), linear-gradient(180deg, rgba(2,6,23,.98), rgba(8,15,34,.92))"
      }
    }
  },
  plugins: []
};

export default config;
