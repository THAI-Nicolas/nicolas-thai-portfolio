/**
 * BookManager - Gère l'animation du livre de présentation
 *
 * Gère :
 * - L'ouverture et le feuilletage du livre
 * - L'affichage des overlays de contenu pour chaque page
 * - La réinitialisation du livre lors de la fermeture
 */

export class BookManager {
  private overlay: HTMLElement | null = null;
  private bookCard: HTMLElement | null = null;
  private pages: NodeListOf<Element> | null = null;
  private presentationContainer: HTMLElement | null = null;
  private page2BackOverlay: HTMLElement | null = null;
  private page2BackOverlayRight: HTMLElement | null = null;
  private page3BackOverlay: HTMLElement | null = null;
  private page3BackOverlayRight: HTMLElement | null = null;

  private currentPage: number = 0;
  private totalPages: number = 0;
  private isOpened: boolean = false;

  constructor() {
    this.init();
  }

  /**
   * Initialise le gestionnaire de livre
   */
  private init(): void {
    this.overlay = document.querySelector(".presentation-overlay");
    this.bookCard = document.getElementById("book-card");
    this.pages = document.querySelectorAll(".book-page");
    this.presentationContainer = document.querySelector(
      ".presentation-card-container"
    );
    this.page2BackOverlay = document.getElementById("page-2-back-overlay");
    this.page2BackOverlayRight = document.getElementById(
      "page-2-back-overlay-right"
    );
    this.page3BackOverlay = document.getElementById("page-3-back-overlay");
    this.page3BackOverlayRight = document.getElementById(
      "page-3-back-overlay-right"
    );

    if (!this.overlay || !this.bookCard) {
      console.log("Book elements not found, retrying...");
      setTimeout(() => this.init(), 100);
      return;
    }

    this.totalPages = this.pages?.length || 0;

    this.setupEventListeners();
    this.setupObserver();

    console.log("Book manager initialized!");
  }

  /**
   * Configure les event listeners
   */
  private setupEventListeners(): void {
    // Clic sur la carte pour tourner les pages
    this.bookCard?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.nextPage();
    });
  }

  /**
   * Configure l'observer pour réinitialiser le livre à la fermeture
   */
  private setupObserver(): void {
    if (!this.overlay) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.attributeName === "class" ||
          mutation.attributeName === "style"
        ) {
          const isVisible = !this.overlay?.classList.contains("opacity-0");

          if (!isVisible && this.currentPage > 0) {
            this.reset();
          }
        }
      });
    });

    observer.observe(this.overlay, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });
  }

  /**
   * Passe à la page suivante
   */
  private nextPage(): void {
    if (!this.bookCard || !this.pages) return;

    if (this.currentPage < this.totalPages) {
      // Au premier clic, centrer le livre ET tourner la première page
      if (this.currentPage === 0) {
        this.bookCard.classList.add("opened");
        this.isOpened = true;
        this.pages[0].classList.add("flipped");
        this.currentPage++;

        if (this.presentationContainer) {
          this.presentationContainer.classList.remove("hidden");
        }

        console.log(
          `Page actuelle: ${this.currentPage}/${this.totalPages} (ouverture + première page)`
        );
      } else {
        // Cacher le contenu avant de tourner la page
        if (this.presentationContainer && this.currentPage === 1) {
          this.presentationContainer.classList.add("hidden");
        }

        // Pour les pages suivantes
        const pageToFlip = this.pages[this.currentPage];
        pageToFlip.classList.add("flipped");
        this.currentPage++;

        this.updateOverlays();

        console.log(`Page actuelle: ${this.currentPage}/${this.totalPages}`);
      }
    } else {
      // Retour au début
      this.reset();
      console.log("Retour à la couverture");
    }
  }

  /**
   * Met à jour l'affichage des overlays en fonction de la page actuelle
   */
  private updateOverlays(): void {
    // Afficher l'overlay page 2 UNIQUEMENT après le flip de la page 2
    if (this.currentPage === 2 && this.page2BackOverlay) {
      setTimeout(() => {
        this.page2BackOverlay?.classList.add("visible");
        console.log("Overlay page 2 back (gauche) affiché");
      }, 600);
    } else if (this.currentPage !== 2 && this.page2BackOverlay) {
      this.page2BackOverlay.classList.remove("visible");
      console.log("Overlay page 2 back (gauche) caché");
    }

    // Afficher l'overlay Design en même temps
    if (this.currentPage === 2 && this.page2BackOverlayRight) {
      setTimeout(() => {
        this.page2BackOverlayRight?.classList.add("visible");
        console.log("Overlay Design (droite) affiché");
      }, 200);
    } else if (this.currentPage !== 2 && this.page2BackOverlayRight) {
      this.page2BackOverlayRight.classList.remove("visible");
      console.log("Overlay Design (droite) caché");
    }

    // Afficher l'overlay Gestion de projet
    if (this.currentPage === 3 && this.page3BackOverlay) {
      setTimeout(() => {
        this.page3BackOverlay?.classList.add("visible");
        console.log("Overlay Gestion de projet (gauche) affiché");
      }, 600);
    } else if (this.currentPage !== 3 && this.page3BackOverlay) {
      this.page3BackOverlay.classList.remove("visible");
      console.log("Overlay Gestion de projet (gauche) caché");
    }

    // Afficher l'overlay Audiovisuel en même temps
    if (this.currentPage === 3 && this.page3BackOverlayRight) {
      setTimeout(() => {
        this.page3BackOverlayRight?.classList.add("visible");
        console.log("Overlay Audiovisuel (droite) affiché");
      }, 200);
    } else if (this.currentPage !== 3 && this.page3BackOverlayRight) {
      this.page3BackOverlayRight.classList.remove("visible");
      console.log("Overlay Audiovisuel (droite) caché");
    }
  }

  /**
   * Réinitialise le livre à son état initial
   */
  private reset(): void {
    this.pages?.forEach((page) => page.classList.remove("flipped"));
    this.bookCard?.classList.remove("opened");
    this.currentPage = 0;
    this.isOpened = false;

    if (this.presentationContainer) {
      this.presentationContainer.classList.add("hidden");
    }

    if (this.page2BackOverlay) {
      this.page2BackOverlay.classList.remove("visible");
    }

    if (this.page2BackOverlayRight) {
      this.page2BackOverlayRight.classList.remove("visible");
    }

    if (this.page3BackOverlay) {
      this.page3BackOverlay.classList.remove("visible");
    }

    if (this.page3BackOverlayRight) {
      this.page3BackOverlayRight.classList.remove("visible");
    }
  }

  /**
   * Retourne la page actuelle
   */
  public getCurrentPage(): number {
    return this.currentPage;
  }

  /**
   * Vérifie si le livre est ouvert
   */
  public isBookOpened(): boolean {
    return this.isOpened;
  }
}
