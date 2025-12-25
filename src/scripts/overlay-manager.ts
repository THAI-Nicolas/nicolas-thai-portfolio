/**
 * OverlayManager - Gère l'ouverture et la fermeture de tous les overlays du portfolio
 *
 * Permet de centraliser la logique d'affichage/masquage des overlays
 * et d'éviter les duplications de code
 */

import {
  OVERLAY_SELECTORS,
  OVERLAY_BUTTON_SELECTORS,
  CSS_CLASSES,
} from "../utils/constants";
import {
  getElement,
  addClass,
  removeClass,
  replaceClasses,
} from "../utils/dom-helpers";

export type OverlayType = "cv" | "contact" | "presentation" | "parametres";

interface OverlayConfig {
  overlaySelector: string;
  openButtonSelector?: string;
  closeButtonSelector?: string;
  onOpen?: () => void;
  onClose?: () => void;
}

export class OverlayManager {
  private static instance: OverlayManager;
  private overlays: Map<OverlayType, OverlayConfig> = new Map();
  private currentOverlay: OverlayType | null = null;

  private constructor() {
    this.initializeOverlays();
  }

  public static getInstance(): OverlayManager {
    if (!OverlayManager.instance) {
      OverlayManager.instance = new OverlayManager();
    }
    return OverlayManager.instance;
  }

  /**
   * Initialise la configuration de tous les overlays
   */
  private initializeOverlays(): void {
    this.overlays.set("cv", {
      overlaySelector: OVERLAY_SELECTORS.CV,
      openButtonSelector: OVERLAY_BUTTON_SELECTORS.CV_OPEN,
      closeButtonSelector: OVERLAY_BUTTON_SELECTORS.CV_CLOSE,
    });

    this.overlays.set("contact", {
      overlaySelector: OVERLAY_SELECTORS.CONTACT,
      openButtonSelector: OVERLAY_BUTTON_SELECTORS.CONTACT_OPEN,
      closeButtonSelector: OVERLAY_BUTTON_SELECTORS.CONTACT_CLOSE,
    });

    this.overlays.set("presentation", {
      overlaySelector: OVERLAY_SELECTORS.PRESENTATION,
      openButtonSelector: OVERLAY_BUTTON_SELECTORS.PRESENTATION_OPEN,
      closeButtonSelector: OVERLAY_BUTTON_SELECTORS.PRESENTATION_CLOSE,
    });

    this.overlays.set("parametres", {
      overlaySelector: OVERLAY_SELECTORS.PARAMETRES,
      openButtonSelector: OVERLAY_BUTTON_SELECTORS.PARAMETRES_OPEN,
      closeButtonSelector: OVERLAY_BUTTON_SELECTORS.PARAMETRES_CLOSE,
    });
  }

  /**
   * Configure les event listeners pour un overlay spécifique
   */
  public setupOverlay(
    type: OverlayType,
    config?: Partial<OverlayConfig>
  ): void {
    const overlayConfig = this.overlays.get(type);
    if (!overlayConfig) {
      logger.error(`Overlay type "${type}" not found`);
      return;
    }

    // Merger la config personnalisée avec la config par défaut
    if (config) {
      Object.assign(overlayConfig, config);
    }

    const overlay = getElement(overlayConfig.overlaySelector);
    if (!overlay) {
      // Silencieux - normal sur certaines pages
      return;
    }

    // Setup bouton d'ouverture
    if (overlayConfig.openButtonSelector) {
      const openButtons = document.querySelectorAll(
        overlayConfig.openButtonSelector
      );
      openButtons.forEach((openButton) => {
        if (openButton) {
          openButton.addEventListener("click", (e) => {
            e.preventDefault();
            this.open(type);
          });
        }
      });
    }

    // Setup bouton de fermeture
    if (overlayConfig.closeButtonSelector) {
      const closeButtons = document.querySelectorAll(
        overlayConfig.closeButtonSelector
      );
      closeButtons.forEach((closeButton) => {
        if (closeButton) {
          closeButton.addEventListener("click", () => {
            this.close(type);
          });
        }
      });
    }
  }

  /**
   * Ouvre un overlay spécifique
   */
  public open(type: OverlayType): void {
    const config = this.overlays.get(type);
    if (!config) {
      logger.error(`Overlay type "${type}" not found`);
      return;
    }

    const overlay = getElement(config.overlaySelector);
    if (!overlay) {
      return; // Silencieux
    }

    // Fermer l'overlay actuel s'il y en a un
    if (this.currentOverlay && this.currentOverlay !== type) {
      this.close(this.currentOverlay);
    }

    // Ouvrir le nouvel overlay
    replaceClasses(
      overlay,
      CSS_CLASSES.OVERLAY_HIDDEN,
      CSS_CLASSES.OVERLAY_VISIBLE
    );
    this.currentOverlay = type;

    // Callback personnalisé
    if (config.onOpen) {
      config.onOpen();
    }
  }

  /**
   * Ferme un overlay spécifique
   */
  public close(type: OverlayType): void {
    const config = this.overlays.get(type);
    if (!config) {
      logger.error(`Overlay type "${type}" not found`);
      return;
    }

    const overlay = getElement(config.overlaySelector);
    if (!overlay) {
      return; // Silencieux
    }

    // Fermer l'overlay
    replaceClasses(
      overlay,
      CSS_CLASSES.OVERLAY_VISIBLE,
      CSS_CLASSES.OVERLAY_HIDDEN
    );

    if (this.currentOverlay === type) {
      this.currentOverlay = null;
    }

    // Callback personnalisé
    if (config.onClose) {
      config.onClose();
    }
  }

  /**
   * Ferme tous les overlays
   */
  public closeAll(): void {
    this.overlays.forEach((_, type) => {
      this.close(type);
    });
  }

  /**
   * Retourne l'overlay actuellement ouvert
   */
  public getCurrentOverlay(): OverlayType | null {
    return this.currentOverlay;
  }

  /**
   * Vérifie si un overlay est ouvert
   */
  public isOpen(type: OverlayType): boolean {
    return this.currentOverlay === type;
  }
}

// Initialisation globale pour utilisation dans les scripts inline ou modules
if (typeof window !== "undefined") {
  (window as any).overlayManager = OverlayManager.getInstance();
}
