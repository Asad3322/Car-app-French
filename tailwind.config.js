/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Main action colors
        primary: "#2F93F6",
        primaryDark: "#1F6FD1",
        secondary: "#5C8DF6",
        secondaryDark: "#3E6FE0",
        accent: "#FACC15",
        accentDark: "#EAB308",
        success: "#10B981",
        successDark: "#047857",
        danger: "#EF4444",
        dangerDark: "#B91C1C",

        // Main App Theme - UPDATED TO YOUR NEW LIGHT BLUE SCHEME
        appBg: "#D6E2EC",
        appSurface: "#EEF4F8",
        appBorder: "#B8C9D6",
        appText: "#0B1A2B",
        appTextPrimary: "#0B1A2B",
        appTextSecondary: "#6F8194",

        // Public/Auth Flow - keep same family for consistency
        publicBg: "#D6E2EC",
        publicSurface: "#EEF4F8",
        publicBorder: "#B8C9D6",
        publicText: "#0B1A2B",
        publicTextPrimary: "#0B1A2B",
        publicTextSecondary: "#6F8194",

        // Premium Dark Theme
        charcoal: "#060B14",
        "charcoal-light": "#0A0F1A",
        "silicon-cyan": "#35D7FF",
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
        waze: "0 10px 25px rgba(70,106,140,0.08)",
        "waze-lg": "0 18px 40px rgba(70,106,140,0.12)",
      },
    },
  },
  plugins: [],
};