/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        // Couleurs du thème Wii (référence aux CSS variables)
        "light-blue": "var(--color-light-blue)",
        "dark-blue": "var(--color-dark-blue)",
        "light-gray": "var(--color-light-gray)",
        "text-gray": "var(--color-text-gray)",
        "dark-gray": "var(--color-dark-gray)",
        background: "var(--color-background)",
        "text-dark": "var(--color-text-dark)",
      },
      fontFamily: {
        rodin: ["fot-rodin-pron", "sans-serif"],
        raleway: ["raleway", "sans-serif"],
        hagrid: ["hagrid", "sans-serif"],
      },
      borderWidth: {
        3: "3px",
      },
    },
  },
  plugins: [],
};
