/**
 * IframeHandler - Gère l'interaction avec les iframes
 *
 * Permet d'activer le scroll dans les iframes uniquement après un clic
 * pour éviter les conflits avec le scroll de la page
 */

export class IframeHandler {
  private iframeContainer: HTMLElement | null = null;
  private iframeOverlay: HTMLElement | null = null;

  constructor(
    containerId: string = "iframe-container",
    overlayId: string = "iframe-overlay"
  ) {
    this.init(containerId, overlayId);
  }

  /**
   * Initialise le gestionnaire d'iframe
   */
  private init(containerId: string, overlayId: string): void {
    this.iframeContainer = document.getElementById(containerId);
    this.iframeOverlay = document.getElementById(overlayId);

    if (!this.iframeContainer || !this.iframeOverlay) {
      console.warn(`Iframe elements not found (${containerId}, ${overlayId})`);
      return;
    }

    this.setupEventListeners();
  }

  /**
   * Configure les event listeners
   */
  private setupEventListeners(): void {
    if (!this.iframeOverlay || !this.iframeContainer) return;

    // Activer l'iframe au clic sur l'overlay
    this.iframeOverlay.addEventListener("click", () => {
      this.activate();
    });

    // Réactiver l'overlay si on clique en dehors de l'iframe
    document.addEventListener("click", (e) => {
      if (
        this.iframeContainer?.classList.contains("active") &&
        !this.iframeContainer.contains(e.target as Node)
      ) {
        this.deactivate();
      }
    });
  }

  /**
   * Active l'iframe (permet le scroll)
   */
  public activate(): void {
    this.iframeContainer?.classList.add("active");
  }

  /**
   * Désactive l'iframe (bloque le scroll)
   */
  public deactivate(): void {
    this.iframeContainer?.classList.remove("active");
  }

  /**
   * Vérifie si l'iframe est active
   */
  public isActive(): boolean {
    return this.iframeContainer?.classList.contains("active") ?? false;
  }
}
