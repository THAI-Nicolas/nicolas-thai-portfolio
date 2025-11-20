/**
 * ParametresManager - Gère l'overlay des paramètres
 *
 * Gère :
 * - L'effet 3D au mouvement de la souris
 * - Les sliders de volume (général, musique, effets sonores)
 * - Les toggles d'options
 * - Les boutons de langue
 * - Les boutons Enregistrer et Réinitialiser
 */

import {
  PARAMETRES_IDS,
  PARAMETRES_SELECTORS,
  CSS_CLASSES,
  DELAYS,
  DOM_EVENTS,
} from "../utils/constants";
import {
  getById,
  getElement,
  getElements,
  addClass,
  removeClass,
  onEvent,
  onEventAll,
  setStyle,
  delay,
} from "../utils/dom-helpers";
import { audioManager } from "./audio-manager";

interface VolumeSettings {
  master: number;
  music: number;
  sfx: number;
}

interface ParametresSettings {
  volumes: VolumeSettings;
  options: { [key: string]: boolean };
  language: string;
}

const DEFAULT_SETTINGS: ParametresSettings = {
  volumes: {
    master: 30,
    music: 20,
    sfx: 50,
  },
  options: {},
  language: "fr",
};

export class ParametresManager {
  private parametresContent: HTMLElement | null = null;
  private parametresContainer: HTMLElement | null = null;
  private rect: DOMRect | null = null;
  private currentSettings: ParametresSettings;

  constructor() {
    this.currentSettings = { ...DEFAULT_SETTINGS };
    this.init();
  }

  /**
   * Initialise le gestionnaire de paramètres
   */
  private init(): void {
    this.parametresContent = getElement(PARAMETRES_SELECTORS.CONTENT);
    this.parametresContainer = getElement(PARAMETRES_SELECTORS.CONTAINER);

    if (!this.parametresContent || !this.parametresContainer) {
      console.log("Parametres elements not found, retrying...");
      delay(() => this.init(), DELAYS.RETRY_INIT);
      return;
    }

    this.setup3DEffect();
    this.setupSliders();
    this.setupToggles();
    this.setupLanguageButtons();
    this.setupActionButtons();
    this.loadSettings();

    console.log("Parametres manager initialized!");
  }

  /**
   * Configure l'effet 3D au mouvement de la souris
   */
  private setup3DEffect(): void {
    if (!this.parametresContainer || !this.parametresContent) return;

    // Ne pas appliquer sur mobile
    if (window.innerWidth < 768) return;

    this.rect = this.parametresContainer.getBoundingClientRect();

    // Recalculer le rect au resize de la fenêtre
    onEvent(window, DOM_EVENTS.RESIZE, () => {
      if (this.parametresContainer && window.innerWidth >= 768) {
        this.rect = this.parametresContainer.getBoundingClientRect();
      }
    });

    onEvent(this.parametresContainer, DOM_EVENTS.MOUSEMOVE, (e: MouseEvent) => {
      if (!this.rect || !this.parametresContent || window.innerWidth < 768)
        return;

      const x = e.clientX - this.rect.left;
      const y = e.clientY - this.rect.top;
      const centerX = this.rect.width / 2;
      const centerY = this.rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * 1.5;
      const rotateY = ((x - centerX) / centerX) * 1.5;

      requestAnimationFrame(() => {
        if (this.parametresContent) {
          this.parametresContent.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
        }
      });
    });

    onEvent(this.parametresContainer, DOM_EVENTS.MOUSELEAVE, () => {
      if (this.parametresContent && window.innerWidth >= 768) {
        requestAnimationFrame(() => {
          if (this.parametresContent) {
            this.parametresContent.style.transform =
              "rotateX(0deg) rotateY(0deg)";
          }
        });
      }
    });
  }

  /**
   * Configure les sliders de volume
   */
  private setupSliders(): void {
    const sliders = getElements(
      ".gaming-slider"
    ) as NodeListOf<HTMLInputElement>;

    sliders.forEach((slider) => {
      onEvent(slider, DOM_EVENTS.INPUT, (e) => {
        const target = e.target as HTMLInputElement;
        const value = parseInt(target.value);
        const card = target.closest(".gaming-card");
        const valueDisplay = card?.querySelector(
          PARAMETRES_SELECTORS.VALUE_DISPLAY
        ) as HTMLElement;

        if (valueDisplay) {
          valueDisplay.textContent = `${value}%`;
        }

        // Mettre à jour les paramètres internes
        if (target.id === PARAMETRES_IDS.MASTER_VOLUME) {
          this.currentSettings.volumes.master = value;
          audioManager.setMasterVolume(value);
        } else if (target.id === PARAMETRES_IDS.MUSIC_VOLUME) {
          this.currentSettings.volumes.music = value;
          audioManager.setMusicVolume(value);
        } else if (target.id === PARAMETRES_IDS.SFX_VOLUME) {
          this.currentSettings.volumes.sfx = value;
          audioManager.setSfxVolume(value);
        }
      });
    });
  }

  /**
   * Configure les toggles d'options
   */
  private setupToggles(): void {
    const toggles = getElements(
      ".toggle-input"
    ) as NodeListOf<HTMLInputElement>;

    toggles.forEach((toggle) => {
      onEvent(toggle, DOM_EVENTS.CHANGE, (e) => {
        const target = e.target as HTMLInputElement;
        this.currentSettings.options[target.id] = target.checked;
        console.log(`${target.id} changed to:`, target.checked);
      });
    });
  }

  /**
   * Configure les boutons de sélection de langue
   */
  private setupLanguageButtons(): void {
    const allButtons = getElements(
      CSS_CLASSES.GAMING_BTN
    ) as NodeListOf<HTMLButtonElement>;

    allButtons.forEach((button) => {
      onEvent(button, DOM_EVENTS.CLICK, (e) => {
        const target = e.target as HTMLButtonElement;
        const card = target.closest(".gaming-card");

        if (card) {
          card
            .querySelectorAll(`.${CSS_CLASSES.GAMING_BTN}`)
            .forEach((btn) =>
              removeClass(btn as HTMLElement, CSS_CLASSES.ACTIVE)
            );
          addClass(target, CSS_CLASSES.ACTIVE);
        }

        const lang = target.dataset.lang;
        if (lang) {
          this.currentSettings.language = lang;
          console.log("Language:", lang);
        }
      });
    });
  }

  /**
   * Configure les boutons d'action (Enregistrer et Réinitialiser)
   */
  private setupActionButtons(): void {
    // Bouton Enregistrer
    const applyButton = getById(
      PARAMETRES_IDS.APPLY_BUTTON
    ) as HTMLButtonElement;

    if (applyButton) {
      onEvent(applyButton, DOM_EVENTS.CLICK, () => {
        this.saveSettings();

        const originalHTML = applyButton.innerHTML;
        applyButton.innerHTML = `
          <span class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Enregistré !
          </span>
        `;

        setTimeout(() => {
          applyButton.innerHTML = originalHTML;
        }, 2000);
      });
    }

    // Bouton Réinitialiser
    const resetButton = getById(
      PARAMETRES_IDS.RESET_BUTTON
    ) as HTMLButtonElement;

    if (resetButton) {
      onEvent(resetButton, DOM_EVENTS.CLICK, () => {
        this.resetToDefaults();
      });
    }
  }

  /**
   * Enregistre les paramètres
   */
  private saveSettings(): void {
    console.log("Paramètres enregistrés:", this.currentSettings);
    // TODO: Sauvegarder dans localStorage ou envoyer au serveur
    localStorage.setItem(
      "portfolio-settings",
      JSON.stringify(this.currentSettings)
    );
  }

  /**
   * Réinitialise les paramètres par défaut
   */
  private resetToDefaults(): void {
    console.log("resetToDefaults appelé!");

    // Réinitialiser les paramètres internes
    this.currentSettings = { ...DEFAULT_SETTINGS };

    // Réinitialiser les volumes
    const masterVolume = getById(
      PARAMETRES_IDS.MASTER_VOLUME
    ) as HTMLInputElement;
    const musicVolume = getById(
      PARAMETRES_IDS.MUSIC_VOLUME
    ) as HTMLInputElement;
    const sfxVolume = getById(PARAMETRES_IDS.SFX_VOLUME) as HTMLInputElement;

    if (masterVolume) {
      masterVolume.value = String(DEFAULT_SETTINGS.volumes.master);
      const valueDisplay = masterVolume
        .closest(".gaming-card")
        ?.querySelector(PARAMETRES_SELECTORS.VALUE_DISPLAY) as HTMLElement;
      if (valueDisplay)
        valueDisplay.textContent = `${DEFAULT_SETTINGS.volumes.master}%`;
      audioManager.setMasterVolume(DEFAULT_SETTINGS.volumes.master);
    }

    if (musicVolume) {
      musicVolume.value = String(DEFAULT_SETTINGS.volumes.music);
      const valueDisplay = musicVolume
        .closest(".gaming-card")
        ?.querySelector(PARAMETRES_SELECTORS.VALUE_DISPLAY) as HTMLElement;
      if (valueDisplay)
        valueDisplay.textContent = `${DEFAULT_SETTINGS.volumes.music}%`;
      audioManager.setMusicVolume(DEFAULT_SETTINGS.volumes.music);
    }

    if (sfxVolume) {
      sfxVolume.value = String(DEFAULT_SETTINGS.volumes.sfx);
      const valueDisplay = sfxVolume
        .closest(".gaming-card")
        ?.querySelector(PARAMETRES_SELECTORS.VALUE_DISPLAY) as HTMLElement;
      if (valueDisplay)
        valueDisplay.textContent = `${DEFAULT_SETTINGS.volumes.sfx}%`;
      audioManager.setSfxVolume(DEFAULT_SETTINGS.volumes.sfx);
    }

    // Réinitialiser les toggles
    const toggles = getElements(
      ".toggle-input"
    ) as NodeListOf<HTMLInputElement>;
    toggles.forEach((toggle) => {
      toggle.checked = true;
    });

    // Réinitialiser la langue
    const frLang = getElement('[data-lang="fr"]') as HTMLButtonElement;
    const langButtons = getElements("[data-lang]");
    langButtons.forEach((btn) =>
      removeClass(btn as HTMLElement, CSS_CLASSES.ACTIVE)
    );
    if (frLang) addClass(frLang, CSS_CLASSES.ACTIVE);

    // Sauvegarder les paramètres par défaut
    this.saveSettings();

    console.log("Paramètres réinitialisés");
  }

  /**
   * Retourne les paramètres actuels
   */
  public getSettings(): ParametresSettings {
    return this.currentSettings;
  }

  /**
   * Charge les paramètres depuis localStorage
   */
  public loadSettings(): void {
    const saved = localStorage.getItem("portfolio-settings");
    if (saved) {
      try {
        this.currentSettings = JSON.parse(saved);
        this.applySettingsToUI();
        console.log("Paramètres chargés:", this.currentSettings);
      } catch (e) {
        console.error("Error loading settings:", e);
      }
    }
  }

  /**
   * Applique les paramètres actuels à l'interface
   */
  private applySettingsToUI(): void {
    // Appliquer les volumes
    const masterVolume = getById(
      PARAMETRES_IDS.MASTER_VOLUME
    ) as HTMLInputElement;
    const musicVolume = getById(
      PARAMETRES_IDS.MUSIC_VOLUME
    ) as HTMLInputElement;
    const sfxVolume = getById(PARAMETRES_IDS.SFX_VOLUME) as HTMLInputElement;

    if (masterVolume) {
      masterVolume.value = String(this.currentSettings.volumes.master);
      const valueDisplay = masterVolume
        .closest(".gaming-card")
        ?.querySelector(PARAMETRES_SELECTORS.VALUE_DISPLAY) as HTMLElement;
      if (valueDisplay)
        valueDisplay.textContent = `${this.currentSettings.volumes.master}%`;
      audioManager.setMasterVolume(this.currentSettings.volumes.master);
    }

    if (musicVolume) {
      musicVolume.value = String(this.currentSettings.volumes.music);
      const valueDisplay = musicVolume
        .closest(".gaming-card")
        ?.querySelector(PARAMETRES_SELECTORS.VALUE_DISPLAY) as HTMLElement;
      if (valueDisplay)
        valueDisplay.textContent = `${this.currentSettings.volumes.music}%`;
      audioManager.setMusicVolume(this.currentSettings.volumes.music);
    }

    if (sfxVolume) {
      sfxVolume.value = String(this.currentSettings.volumes.sfx);
      const valueDisplay = sfxVolume
        .closest(".gaming-card")
        ?.querySelector(PARAMETRES_SELECTORS.VALUE_DISPLAY) as HTMLElement;
      if (valueDisplay)
        valueDisplay.textContent = `${this.currentSettings.volumes.sfx}%`;
      audioManager.setSfxVolume(this.currentSettings.volumes.sfx);
    }

    // Appliquer les toggles
    Object.keys(this.currentSettings.options).forEach((key) => {
      const toggle = getById(key) as HTMLInputElement;
      if (toggle) {
        toggle.checked = this.currentSettings.options[key];
      }
    });

    // Appliquer la langue
    const langButtons = getElements("[data-lang]");
    langButtons.forEach((btn) => {
      const button = btn as HTMLButtonElement;
      if (button.dataset.lang === this.currentSettings.language) {
        addClass(button, CSS_CLASSES.ACTIVE);
      } else {
        removeClass(button, CSS_CLASSES.ACTIVE);
      }
    });
  }
}
