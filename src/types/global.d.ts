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

export {};
