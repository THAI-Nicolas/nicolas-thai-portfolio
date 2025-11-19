/**
 * ContactFormManager - Gère le formulaire de contact avec ses animations
 *
 * Gère :
 * - L'animation de la pancarte et des chaînes
 * - Le zoom/dézoom de la feuille de papier
 * - La synchronisation entre les deux formulaires (pancarte et feuille)
 */

import {
  CONTACT_IDS,
  CONTACT_SELECTORS,
  OVERLAY_SELECTORS,
  CSS_CLASSES,
  DELAYS,
  MUTATION_OPTIONS,
} from "../utils/constants";
import {
  getById,
  getElement,
  getElements,
  addClass,
  removeClass,
  hasClass,
  onEvent,
  observeMutations,
  delay,
} from "../utils/dom-helpers";

export class ContactFormManager {
  private gamingSign: HTMLElement | null = null;
  private paperSheet: HTMLElement | null = null;
  private zoomButton: HTMLElement | null = null;
  private dezoomButton: HTMLElement | null = null;
  private chains: NodeListOf<Element> | null = null;
  private contactOverlay: HTMLElement | null = null;

  constructor() {
    this.init();
  }

  /**
   * Initialise le gestionnaire de formulaire de contact
   */
  private init(): void {
    this.gamingSign = getById(CONTACT_IDS.GAMING_SIGN);
    this.paperSheet = getById(CONTACT_IDS.PAPER_SHEET);
    this.zoomButton = getById(CONTACT_IDS.ZOOM_BUTTON);
    this.dezoomButton = getById(CONTACT_IDS.DEZOOM_BUTTON);
    this.chains = getElements(CONTACT_SELECTORS.CHAINS);
    this.contactOverlay = getElement(OVERLAY_SELECTORS.CONTACT);

    if (!this.gamingSign || !this.paperSheet || !this.contactOverlay) {
      console.log("Contact form elements not found, retrying...");
      delay(() => this.init(), DELAYS.RETRY_INIT);
      return;
    }

    console.log("Contact form elements found!");

    this.setupObserver();
    this.setupZoomButtons();
    this.syncForms();
  }

  /**
   * Configure l'observer pour détecter l'ouverture de l'overlay
   */
  private setupObserver(): void {
    if (!this.contactOverlay || !this.gamingSign || !this.chains) return;

    observeMutations(
      this.contactOverlay,
      (mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.attributeName === "class" ||
            mutation.attributeName === "style"
          ) {
            const isVisible = !hasClass(
              this.contactOverlay,
              CSS_CLASSES.OVERLAY_HIDDEN[0]
            );

            if (isVisible && !hasClass(this.gamingSign, CSS_CLASSES.SHOW)) {
              console.log("Contact overlay opened, launching animation!");
              addClass(this.gamingSign, CSS_CLASSES.SHOW);
              this.chains?.forEach((chain) =>
                addClass(chain as HTMLElement, CSS_CLASSES.SHOW)
              );
            } else if (
              !isVisible &&
              hasClass(this.gamingSign, CSS_CLASSES.SHOW)
            ) {
              removeClass(this.gamingSign, CSS_CLASSES.SHOW);
              this.chains?.forEach((chain) =>
                removeClass(chain as HTMLElement, CSS_CLASSES.SHOW)
              );
              removeClass(this.paperSheet, CSS_CLASSES.SHOW);
            }
          }
        });
      },
      MUTATION_OPTIONS.ATTRIBUTES
    );
  }

  /**
   * Configure les boutons de zoom/dézoom
   */
  private setupZoomButtons(): void {
    onEvent(document, "click", (e) => {
      const target = e.target as HTMLElement;

      // Ouvrir la feuille de papier
      if (
        target &&
        (target.id === CONTACT_IDS.ZOOM_BUTTON ||
          target.closest(`#${CONTACT_IDS.ZOOM_BUTTON}`))
      ) {
        e.preventDefault();
        e.stopPropagation();
        console.log("Opening paper sheet!");
        addClass(this.paperSheet, CSS_CLASSES.SHOW);
      }

      // Fermer la feuille de papier
      if (
        target &&
        (target.id === CONTACT_IDS.DEZOOM_BUTTON ||
          target.closest(`#${CONTACT_IDS.DEZOOM_BUTTON}`))
      ) {
        e.preventDefault();
        e.stopPropagation();
        console.log("Closing paper sheet!");
        removeClass(this.paperSheet, CSS_CLASSES.SHOW);
      }
    });
  }

  /**
   * Synchronise les deux formulaires (pancarte et feuille)
   */
  private syncForms(): void {
    const allInputs = getElements(CONTACT_SELECTORS.SYNC_INPUTS);

    allInputs.forEach((input) => {
      onEvent(input as HTMLElement, "input", (e) => {
        const target = e.target as HTMLInputElement | HTMLTextAreaElement;
        const syncKey = target.getAttribute("data-sync");
        const value = target.value;

        // Trouver tous les champs avec le même syncKey et mettre à jour leur valeur
        const otherInputs = getElements(`[data-sync="${syncKey}"]`);

        otherInputs.forEach((otherInput) => {
          if (otherInput !== target) {
            (otherInput as HTMLInputElement | HTMLTextAreaElement).value =
              value;
          }
        });
      });
    });

    console.log("Forms synchronized!");
  }

  /**
   * Réinitialise les formulaires
   */
  public reset(): void {
    const allInputs = getElements(CONTACT_SELECTORS.SYNC_INPUTS);
    allInputs.forEach((input) => {
      (input as HTMLInputElement | HTMLTextAreaElement).value = "";
    });
  }

  /**
   * Ferme la feuille de papier
   */
  public closePaperSheet(): void {
    removeClass(this.paperSheet, CSS_CLASSES.SHOW);
  }
}
