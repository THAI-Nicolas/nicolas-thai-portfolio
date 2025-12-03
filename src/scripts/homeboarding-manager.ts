/**
 * HomeboardingManager - Gère l'affichage du homeboarding style Wii
 *
 * Responsabilités :
 * - Détecte si c'est la première visite (via localStorage)
 * - Affiche/masque le homeboarding avec animation
 * - Gère les événements de fermeture (clic, clavier)
 * - Sauvegarde l'état de visite
 */

import { getElement, addClass, removeClass } from "../utils/dom-helpers";

const HOMEBOARDING_KEY = "portfolio-homeboarding-seen";
const HOMEBOARDING_SELECTOR = "#homeboarding-overlay";
const CONTINUE_BUTTON_SELECTOR = "#homeboarding-continue-btn";

export class HomeboardingManager {
  private static instance: HomeboardingManager;
  private overlay: HTMLElement | null = null;
  private continueButton: HTMLElement | null = null;
  private isClosing = false;
  private autoCloseTimeout: number | null = null;

  private constructor() {
    this.init();
  }

  public static getInstance(): HomeboardingManager {
    if (!HomeboardingManager.instance) {
      HomeboardingManager.instance = new HomeboardingManager();
    }
    return HomeboardingManager.instance;
  }

  /**
   * Initialise le homeboarding
   */
  private init(): void {
    // Récupérer les éléments DOM
    this.overlay = getElement(HOMEBOARDING_SELECTOR);
    this.continueButton = getElement(CONTINUE_BUTTON_SELECTOR);

    if (!this.overlay) {
      console.warn("Homeboarding overlay not found");
      return;
    }

    // Vérifier si c'est la première visite
    if (this.isFirstVisit()) {
      this.show();
      this.setupEventListeners();
    } else {
      // Masquer complètement l'overlay si déjà vu
      addClass(this.overlay, "opacity-0", "pointer-events-none");
      removeClass(this.overlay, "opacity-100");
    }
  }

  /**
   * Vérifie si c'est la première visite de l'utilisateur
   */
  private isFirstVisit(): boolean {
    try {
      const seen = localStorage.getItem(HOMEBOARDING_KEY);
      return seen !== "true";
    } catch (error) {
      console.error("Error checking localStorage:", error);
      return false;
    }
  }

  /**
   * Marque le homeboarding comme vu
   */
  private markAsSeen(): void {
    try {
      localStorage.setItem(HOMEBOARDING_KEY, "true");
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }

  /**
   * Affiche le homeboarding avec animation du contenu
   */
  private show(): void {
    if (!this.overlay) return;

    // Afficher le fond noir immédiatement
    removeClass(this.overlay, "opacity-0", "pointer-events-none");
    addClass(this.overlay, "opacity-100", "pointer-events-auto");

    // Animer le contenu après un court délai
    setTimeout(() => {
      const content = this.overlay?.querySelector(".homeboarding-content");
      if (content) {
        addClass(content as HTMLElement, "show");
      }
    }, 100);

    // Fermeture automatique après 6 secondes
    this.autoCloseTimeout = window.setTimeout(() => {
      this.handleContinue();
    }, 6000);

    console.log("Homeboarding displayed - first visit");
  }

  /**
   * Masque le homeboarding avec animation fade-out
   */
  private hide(): void {
    if (!this.overlay || this.isClosing) return;

    this.isClosing = true;

    // Ajouter la transition uniquement pour la fermeture
    this.overlay.style.transition = "opacity 500ms ease-in-out";

    // Animation de fade-out de tout l'overlay
    removeClass(this.overlay, "opacity-100");
    addClass(this.overlay, "opacity-0");

    // Retirer pointer-events après l'animation
    setTimeout(() => {
      if (this.overlay) {
        addClass(this.overlay, "pointer-events-none");
        // Retirer la transition après l'animation
        this.overlay.style.transition = "";
      }
      this.isClosing = false;

      // Rendre le body visible avec transition après la fermeture du homeboarding
      document.documentElement.style.setProperty("--body-opacity", "1");
      document.documentElement.style.setProperty(
        "--body-pointer-events",
        "auto"
      );
    }, 100); // Durée de la transition

    // Marquer comme vu
    this.markAsSeen();

    console.log("Homeboarding hidden");
  }

  /**
   * Configure tous les événements de fermeture
   */
  private setupEventListeners(): void {
    // Clic n'importe où sur l'overlay
    if (this.overlay) {
      this.overlay.addEventListener("click", () => {
        this.handleContinue();
      });
    }

    // Touches clavier (Entrée, Espace, A)
    document.addEventListener("keydown", (e) => {
      if (this.isVisible() && !this.isClosing) {
        if (
          e.key === "Enter" ||
          e.key === " " ||
          e.key === "a" ||
          e.key === "A"
        ) {
          e.preventDefault();
          this.handleContinue();
        }
      }
    });
  }

  /**
   * Gère l'action de continuer
   */
  private handleContinue(): void {
    if (this.isClosing) return;

    // Annuler le timeout de fermeture automatique
    if (this.autoCloseTimeout !== null) {
      window.clearTimeout(this.autoCloseTimeout);
      this.autoCloseTimeout = null;
    }

    // TODO: Jouer un son Wii si disponible
    // AudioManager.getInstance().playSfx('wii-click');

    this.hide();
  }

  /**
   * Vérifie si le homeboarding est actuellement visible
   */
  private isVisible(): boolean {
    if (!this.overlay) return false;
    return this.overlay.classList.contains("opacity-100");
  }

  /**
   * Force l'affichage du homeboarding (pour debug ou paramètres)
   */
  public forceShow(): void {
    if (!this.overlay) {
      console.warn("Homeboarding overlay not found");
      return;
    }

    this.show();
    this.setupEventListeners();
  }

  /**
   * Reset le localStorage pour revoir le homeboarding
   */
  public reset(): void {
    try {
      localStorage.removeItem(HOMEBOARDING_KEY);
      console.log("Homeboarding reset - will show on next visit");
    } catch (error) {
      console.error("Error resetting homeboarding:", error);
    }
  }
}

// Initialisation automatique au chargement de la page
if (typeof window !== "undefined") {
  // Attendre que le DOM soit complètement chargé
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      HomeboardingManager.getInstance();
    });
  } else {
    // DOM déjà chargé
    HomeboardingManager.getInstance();
  }

  // Exposer globalement pour debug/paramètres
  (window as any).homeboardingManager = HomeboardingManager.getInstance();
}
