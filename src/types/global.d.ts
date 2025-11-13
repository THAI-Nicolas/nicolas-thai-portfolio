declare global {
  interface Window {
    portfolioTheme?: {
      current: string;
      setTheme: (theme: "wii" | "dark") => void;
      getTheme: () => string;
    };
  }
}

export {};
