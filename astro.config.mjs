// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import node from "@astrojs/node";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://portfolio.nicolas-thai.fr", // URL de production pour génération des URLs canoniques
  integrations: [
    sitemap({
      // Configuration du sitemap
      filter: (page) => !page.includes("/backend/") && !page.includes("/api/"),
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ["pocketbase"],
    },
    build: {
      sourcemap: true, // Génère les source maps pour tous les fichiers JS
    },
  },
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
});
