export type Theme = "wii";

const THEME_KEY = "portfolio-theme";

export class ThemeManager {
  private static instance: ThemeManager;
  private currentTheme: Theme;

  private constructor() {
    this.currentTheme = this.getStoredTheme() || "wii";
    this.applyTheme(this.currentTheme);
  }

  public static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager();
    }
    return ThemeManager.instance;
  }

  private getStoredTheme(): Theme | null {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(THEME_KEY);
    return stored === "wii" ? stored : null;
  }

  private applyTheme(theme: Theme): void {
    if (typeof document === "undefined") return;

    document.documentElement.setAttribute("data-theme", theme);
    this.currentTheme = theme;
    localStorage.setItem(THEME_KEY, theme);

    window.dispatchEvent(new CustomEvent("themeChange", { detail: { theme } }));
  }

  public setTheme(theme: Theme): void {
    this.applyTheme(theme);
  }

  public getTheme(): Theme {
    return this.currentTheme;
  }

  public toggleTheme(): void {
    // Fonction désactivée pour l'instant
    console.log("Toggle theme désactivé");
  }
}

if (typeof window !== "undefined") {
  const themeManager = ThemeManager.getInstance();
  (window as any).themeManager = themeManager;
}
