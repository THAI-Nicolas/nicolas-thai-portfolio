import type PocketBase from "pocketbase";

declare global {
  interface Window {
    portfolioTheme?: {
      current: string;
      setTheme: (theme: "wii") => void;
      getTheme: () => string;
    };
  }

  namespace App {
    interface Locals {
      pb?: PocketBase;
      user?: any;
    }
  }
}

// Déclaration des modules pour les assets audio
declare module "*.mp3" {
  const src: string;
  export default src;
}

declare module "*.wav" {
  const src: string;
  export default src;
}

declare module "*.ogg" {
  const src: string;
  export default src;
}

export {};
