/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core Waze-like Palette
        primary: "#2563EB",
        primaryDark: "#1E40AF",
        secondary: "#6366F1",
        secondaryDark: "#4338CA",
        accent: "#FACC15",
        accentDark: "#EAB308",
        success: "#10B981",
        successDark: "#047857",
        danger: "#EF4444",
        dangerDark: "#B91C1C",

        // Main App Theme
        appBg: "#F5F5F5",
        appSurface: "#FAFAFA",
        appBorder: "#E5E7EB",
        appText: "#111827",
        appTextPrimary: "#111827",
        appTextSecondary: "#6B7280",

        // Public/Auth Flow
        publicBg: "#F5F5F5",
        publicSurface: "#FAFAFA",
        publicBorder: "#E5E7EB",
        publicText: "#111827",
        publicTextPrimary: "#111827",
        publicTextSecondary: "#6B7280",
      },
      borderRadius: {
        "3xl": "24px",
        "4xl": "32px",
        "5xl": "40px",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "apple-system", "sans-serif"],
      },
      boxShadow: {
        waze: "0 4px 14px rgba(0,0,0,0.04)",
        "waze-lg": "0 10px 24px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};