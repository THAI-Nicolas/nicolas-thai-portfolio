declare global {
  interface Window {
    portfolioTheme?: {
      current: string;
      setTheme: (theme: "wii") => void;
      getTheme: () => string;
    };
  }
}

export {};
