/**
 * CarouselManager - Gère le carousel de la page d'accueil
 *
 * Permet de naviguer entre les pages de projets avec les flèches
 * et le clavier (flèches gauche/droite)
 */

import {
  CAROUSEL_IDS,
  ROUTES,
  DOM_EVENTS,
  KEYBOARD_KEYS,
} from "../utils/constants";
import { getById, setStyle, onEvent } from "../utils/dom-helpers";
import { audioManager, SoundName } from "./audio-manager";

export class CarouselManager {
  private currentPage: number = 1;
  private carouselGrid: HTMLElement | null = null;
  private arrowRight: HTMLElement | null = null;
  private arrowLeft: HTMLElement | null = null;

  constructor() {
    this.init();
  }

  /**
   * Initialise le carousel
   */
  private init(): void {
    // Vérifier qu'on est sur la page d'accueil
    if (window.location.pathname !== ROUTES.HOME) return;

    this.carouselGrid = getById(CAROUSEL_IDS.GRID);
    this.arrowRight = getById(CAROUSEL_IDS.ARROW_RIGHT);
    this.arrowLeft = getById(CAROUSEL_IDS.ARROW_LEFT);

    if (!this.carouselGrid || !this.arrowRight || !this.arrowLeft) {
      console.log("Carousel elements not found");
      return;
    }

    console.log("Initialisation du carousel");

    // Initialisation - Page 1 active par défaut
    setStyle(this.arrowLeft, "opacity", "0");

    // Setup des event listeners
    this.setupEventListeners();
  }

  /**
   * Configure les event listeners pour les flèches et le clavier
   */
  private setupEventListeners(): void {
    if (!this.arrowRight || !this.arrowLeft) return;

    // Nettoyer les anciens listeners en clonant les éléments
    const newArrowRight = this.arrowRight.cloneNode(true) as HTMLElement;
    this.arrowRight.parentNode?.replaceChild(newArrowRight, this.arrowRight);
    this.arrowRight = newArrowRight;

    const newArrowLeft = this.arrowLeft.cloneNode(true) as HTMLElement;
    this.arrowLeft.parentNode?.replaceChild(newArrowLeft, this.arrowLeft);
    this.arrowLeft = newArrowLeft;

    // Navigation vers la page 2 (flèche droite)
    onEvent(this.arrowRight, DOM_EVENTS.CLICK, (e) => {
      e.preventDefault();
      console.log("Click sur flèche droite");
      audioManager.play(SoundName.ARROW_CLICK);
      this.switchPage(2);
    });

    // Navigation vers la page 1 (flèche gauche)
    onEvent(this.arrowLeft, DOM_EVENTS.CLICK, (e) => {
      e.preventDefault();
      console.log("Click sur flèche gauche");
      audioManager.play(SoundName.ARROW_CLICK);
      this.switchPage(1);
    });

    // Navigation au clavier
    onEvent(document, DOM_EVENTS.KEYDOWN, (e) => {
      if (e.key === KEYBOARD_KEYS.ARROW_RIGHT && this.currentPage === 1) {
        this.switchPage(2);
      } else if (e.key === KEYBOARD_KEYS.ARROW_LEFT && this.currentPage === 2) {
        this.switchPage(1);
      }
    });
  }

  /**
   * Change de page dans le carousel
   */
  private switchPage(pageNumber: number): void {
    if (!this.carouselGrid || !this.arrowRight || !this.arrowLeft) return;

    console.log("Changement vers la page:", pageNumber);

    // Déterminer le translateX en fonction de la taille d'écran
    // MD: 240px channel + gap = environ 390px par channel visible
    // LG: 300px channel + gap = environ 500px par channel visible
    // XL: 350px channel + 0px gap = 350px par channel visible
    // On décale d'environ 5-6 channels pour passer à la page 2
    const windowWidth = window.innerWidth;
    let translateXPage2 = "-1890px"; // XL par défaut

    if (windowWidth >= 1280) {
      // XL breakpoint
      translateXPage2 = "-1890px"; // 5.4 × 350px
    } else if (windowWidth >= 1024) {
      // LG breakpoint
      translateXPage2 = "-1512px"; // ~5 × 300px + gaps
    } else if (windowWidth >= 768) {
      // MD breakpoint
      translateXPage2 = "-1210px"; // ~5 × 240px + gaps
    }

    if (pageNumber === 1) {
      setStyle(this.carouselGrid, "transform", "translateX(0)");
      setStyle(this.arrowRight, "opacity", "1");
      setStyle(this.arrowLeft, "opacity", "0");
      this.currentPage = 1;
      console.log("Page 1 active");
    } else if (pageNumber === 2) {
      setStyle(
        this.carouselGrid,
        "transform",
        `translateX(${translateXPage2})`
      );
      setStyle(this.arrowRight, "opacity", "0");
      setStyle(this.arrowLeft, "opacity", "1");
      this.currentPage = 2;
      console.log("Page 2 active");
    }
  }

  /**
   * Retourne la page actuelle
   */
  public getCurrentPage(): number {
    return this.currentPage;
  }

  /**
   * Va à une page spécifique
   */
  public goToPage(pageNumber: number): void {
    if (pageNumber === 1 || pageNumber === 2) {
      this.switchPage(pageNumber);
    }
  }
}
