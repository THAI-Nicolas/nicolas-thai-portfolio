/**
 * UI Sounds Manager - Gère les sons des interactions UI
 *
 * Attache automatiquement les sons aux éléments de l'interface :
 * - Boutons (MainBouton, SmallBouton, CardCV)
 * - Flèches de navigation (carousel)
 * - Projets (sélection, vue, retour)
 * - Livre (ouverture, fermeture, changement de page)
 */

import { audioManager, SoundName } from "./audio-manager";

export class UISoundsManager {
  private static instance: UISoundsManager;
  private initialized: boolean = false;

  private constructor() {}

  /**
   * Récupère l'instance unique (Singleton)
   */
  public static getInstance(): UISoundsManager {
    if (!UISoundsManager.instance) {
      UISoundsManager.instance = new UISoundsManager();
    }
    return UISoundsManager.instance;
  }

  /**
   * Initialise les sons de l'UI
   */
  public init(): void {
    if (this.initialized) return;

    // Attendre que le DOM soit chargé
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.attachSounds());
    } else {
      this.attachSounds();
    }

    this.initialized = true;
  }

  /**
   * Attache les sons aux éléments de l'UI
   */
  private attachSounds(): void {
    this.attachCardCVSounds();
    this.attachMainButtonSounds();
    this.attachSmallButtonSounds();
    this.attachArrowSounds();
    this.attachProjectSounds();
  }

  /**
   * Attache le son aux cartes CV
   */
  private attachCardCVSounds(): void {
    const cardCVElements = document.querySelectorAll(".card-cv");
    cardCVElements.forEach((element) => {
      element.addEventListener("click", () => {
        audioManager.play(SoundName.CARD_CV_CLICK);
      });
    });
  }

  /**
   * Attache les sons aux MainBouton
   */
  private attachMainButtonSounds(): void {
    // Tous les MainBouton sauf le bouton retour sur la page cover
    const mainButtons = document.querySelectorAll("[data-main-button]");
    mainButtons.forEach((button) => {
      // Ne pas attacher si c'est un bouton de retour projet (géré séparément)
      if (!button.hasAttribute("data-project-back")) {
        button.addEventListener("click", () => {
          audioManager.play(SoundName.MAIN_BUTTON_CLICK);
        });
      }
    });
  }

  /**
   * Attache les sons aux SmallBouton
   */
  private attachSmallButtonSounds(): void {
    const smallButtons = document.querySelectorAll("[data-small-button]");
    smallButtons.forEach((button) => {
      button.addEventListener("click", () => {
        audioManager.play(SoundName.SMALL_BUTTON_CLICK);
      });
    });
  }

  /**
   * Attache les sons aux flèches de navigation
   */
  private attachArrowSounds(): void {
    const arrows = document.querySelectorAll("[data-arrow]");
    arrows.forEach((arrow) => {
      arrow.addEventListener("click", () => {
        audioManager.play(SoundName.ARROW_CLICK);
      });
    });
  }

  /**
   * Attache les sons aux projets
   */
  private attachProjectSounds(): void {
    // Liens vers les projets depuis l'accueil (ChannelProjet)
    const projectLinks = document.querySelectorAll('a[href*="/projets/"]');
    projectLinks.forEach((link) => {
      const href = link.getAttribute("href") || "";

      // Sélection de projet depuis l'accueil
      if (href.match(/\/projets\/[^/]+$/) && window.location.pathname === "/") {
        link.addEventListener("click", () => {
          audioManager.play(SoundName.PROJECT_SELECT);
        });
      }
      // Voir le projet (vers /details)
      else if (href.includes("/details")) {
        link.addEventListener("click", () => {
          audioManager.play(SoundName.PROJECT_VIEW);
        });
      }
    });

    // Bouton retour sur la page cover et page details (avec data-project-back)
    const backButtons = document.querySelectorAll("[data-project-back]");
    backButtons.forEach((button) => {
      button.addEventListener("click", () => {
        audioManager.play(SoundName.PROJECT_BACK);
      });
    });

    // Bouton "Visiter le site" dans la page details (avec data-project-view)
    const viewButtons = document.querySelectorAll("[data-project-view]");
    viewButtons.forEach((button) => {
      button.addEventListener("click", () => {
        audioManager.play(SoundName.PROJECT_VIEW);
      });
    });

    // Flèches dans les pages cover projet (avec data-project-arrow)
    const projectArrows = document.querySelectorAll("[data-project-arrow]");
    projectArrows.forEach((arrow) => {
      arrow.addEventListener("click", () => {
        audioManager.play(SoundName.PROJECT_SELECT);
      });
    });
  }

  /**
   * Joue le son d'ouverture du livre
   */
  public playBookOpen(): void {
    audioManager.play(SoundName.BOOK_OPEN);
  }

  /**
   * Joue le son de fermeture du livre
   */
  public playBookClose(): void {
    audioManager.play(SoundName.BOOK_CLOSE);
  }

  /**
   * Joue le son de changement de page du livre
   */
  public playBookPageTurn(): void {
    audioManager.play(SoundName.BOOK_PAGE_TURN);
  }

  /**
   * Réattache les sons (utile après un changement de page dynamique)
   */
  public reattach(): void {
    this.attachSounds();
  }
}

// Export de l'instance globale
export const uiSoundsManager = UISoundsManager.getInstance();
