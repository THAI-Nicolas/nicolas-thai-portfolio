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
    if (window.location.pathname !== ROUTES.HOME) {
      console.log(
        "CarouselManager: Not on home page, pathname:",
        window.location.pathname
      );
      return;
    }

    console.log("CarouselManager: Initializing...");
    this.carouselGrid = getById(CAROUSEL_IDS.GRID);
    this.arrowRight = getById(CAROUSEL_IDS.ARROW_RIGHT);
    this.arrowLeft = getById(CAROUSEL_IDS.ARROW_LEFT);

    console.log("CarouselManager elements:", {
      grid: this.carouselGrid,
      arrowRight: this.arrowRight,
      arrowLeft: this.arrowLeft,
    });

    if (!this.carouselGrid || !this.arrowRight || !this.arrowLeft) {
      console.error("CarouselManager: Missing elements!");
      return;
    }

    // Initialisation - Page 1 active par défaut
    setStyle(this.arrowLeft, "opacity", "0");

    // Setup des event listeners
    this.setupEventListeners();
    console.log("CarouselManager: Setup complete");
  }

  /**
   * Configure les event listeners pour les flèches et le clavier
   */
  private setupEventListeners(): void {
    if (!this.arrowRight || !this.arrowLeft) return;

    console.log("CarouselManager: Setting up event listeners");

    // Utiliser la délégation d'événements sur les conteneurs
    // Navigation vers la page 2 (flèche droite)
    this.arrowRight.addEventListener("click", (e) => {
      console.log("Arrow right clicked!");
      e.preventDefault();
      e.stopPropagation();
      audioManager.play(SoundName.ARROW_CLICK);
      this.switchPage(2);
    });

    // Navigation vers la page 1 (flèche gauche)
    this.arrowLeft.addEventListener("click", (e) => {
      console.log("Arrow left clicked!");
      e.preventDefault();
      e.stopPropagation();
      audioManager.play(SoundName.ARROW_CLICK);
      this.switchPage(1);
    });

    // Navigation au clavier
    document.addEventListener("keydown", (e) => {
      if (e.key === KEYBOARD_KEYS.ARROW_RIGHT && this.currentPage === 1) {
        console.log("Keyboard arrow right pressed");
        audioManager.play(SoundName.ARROW_CLICK);
        this.switchPage(2);
      } else if (e.key === KEYBOARD_KEYS.ARROW_LEFT && this.currentPage === 2) {
        console.log("Keyboard arrow left pressed");
        audioManager.play(SoundName.ARROW_CLICK);
        this.switchPage(1);
      }
    });

    console.log("CarouselManager: Event listeners attached");
  }

  /**
   * Change de page dans le carousel
   */
  private switchPage(pageNumber: number): void {
    if (!this.carouselGrid || !this.arrowRight || !this.arrowLeft) return;

    // Calculer dynamiquement le translateX en fonction de la largeur réelle des channels
    // On récupère la largeur d'un channel + gap
    const firstChannel = this.carouselGrid.querySelector(".channel-fluid");
    if (!firstChannel) return;

    const channelWidth = firstChannel.getBoundingClientRect().width;
    const gridStyle = window.getComputedStyle(this.carouselGrid);
    const gap = parseFloat(gridStyle.columnGap) || 0;

    // On décale d'environ 5.4 channels pour passer à la page 2
    const translateXPage2 = -(channelWidth + gap) * 5.4;

    if (pageNumber === 1) {
      setStyle(this.carouselGrid, "transform", "translateX(0)");
      setStyle(this.arrowRight, "opacity", "1");
      setStyle(this.arrowLeft, "opacity", "0");
      this.currentPage = 1;
    } else if (pageNumber === 2) {
      setStyle(
        this.carouselGrid,
        "transform",
        `translateX(${translateXPage2}px)`
      );
      setStyle(this.arrowRight, "opacity", "0");
      setStyle(this.arrowLeft, "opacity", "1");
      this.currentPage = 2;
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
