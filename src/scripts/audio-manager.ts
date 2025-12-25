/**
 * AudioManager - Gère tous les sons du portfolio
 *
 * Gère :
 * - La musique de fond
 * - Les effets sonores (SFX)
 * - Les volumes (master, musique, SFX)
 * - Le chargement et la mise en cache des sons
 */

import { AUDIO_PATHS } from "../utils/audio-paths";

export enum SoundType {
  MUSIC = "music",
  SFX = "sfx",
}

export enum SoundName {
  // Musique
  BACKGROUND_MUSIC = "background-music",

  // SFX
  CARD_CV_CLICK = "card-cv-click",
  MAIN_BUTTON_CLICK = "main-button-click",
  SMALL_BUTTON_CLICK = "small-button-click",
  BOOK_PAGE_TURN = "book-page-turn",
  BOOK_OPEN = "book-open",
  BOOK_CLOSE = "book-close",
  ARROW_CLICK = "arrow-click",
  PROJECT_SELECT = "project-select",
  PROJECT_VIEW = "project-view",
  PROJECT_BACK = "project-back",
  FORM_ANIMATION_SOUND = "form-animation-sound",
}

interface AudioInstance {
  audio: HTMLAudioElement;
  type: SoundType;
  baseVolume: number;
}

interface VolumeSettings {
  master: number;
  music: number;
  sfx: number;
}

export class AudioManager {
  private static instance: AudioManager;
  private audioMap: Map<SoundName, AudioInstance> = new Map();
  private volumes: VolumeSettings = {
    master: 30,
    music: 20,
    sfx: 50,
  };
  private initialized: boolean = false;

  private constructor() {}

  /**
   * Récupère l'instance unique du gestionnaire audio (Singleton)
   */
  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  /**
   * Initialise le gestionnaire audio
   */
  public async init(): Promise<void> {
    if (this.initialized) return;

    // Charger les paramètres sauvegardés
    this.loadSettings();

    // Précharger tous les sons
    const soundsToLoad = [
      // Musique de fond
      {
        name: SoundName.BACKGROUND_MUSIC,
        path: AUDIO_PATHS.BACKGROUND_MUSIC,
        type: SoundType.MUSIC,
        volume: 1.0,
        loop: true,
      },
      // Effets sonores
      {
        name: SoundName.CARD_CV_CLICK,
        path: AUDIO_PATHS.CARD_CV_CLICK,
        type: SoundType.SFX,
        volume: 0.8,
        loop: false,
      },
      {
        name: SoundName.MAIN_BUTTON_CLICK,
        path: AUDIO_PATHS.MAIN_BUTTON_CLICK,
        type: SoundType.SFX,
        volume: 0.7,
        loop: false,
      },
      {
        name: SoundName.SMALL_BUTTON_CLICK,
        path: AUDIO_PATHS.SMALL_BUTTON_CLICK,
        type: SoundType.SFX,
        volume: 0.6,
        loop: false,
      },
      {
        name: SoundName.BOOK_PAGE_TURN,
        path: AUDIO_PATHS.BOOK_PAGE_TURN,
        type: SoundType.SFX,
        volume: 1.0,
        loop: false,
      },
      {
        name: SoundName.BOOK_OPEN,
        path: AUDIO_PATHS.BOOK_OPEN,
        type: SoundType.SFX,
        volume: 0.8,
        loop: false,
      },
      {
        name: SoundName.BOOK_CLOSE,
        path: AUDIO_PATHS.BOOK_CLOSE,
        type: SoundType.SFX,
        volume: 0.8,
        loop: false,
      },
      {
        name: SoundName.ARROW_CLICK,
        path: AUDIO_PATHS.ARROW_CLICK,
        type: SoundType.SFX,
        volume: 0.6,
        loop: false,
      },
      {
        name: SoundName.PROJECT_SELECT,
        path: AUDIO_PATHS.PROJECT_SELECT,
        type: SoundType.SFX,
        volume: 0.7,
        loop: false,
      },
      {
        name: SoundName.PROJECT_VIEW,
        path: AUDIO_PATHS.PROJECT_VIEW,
        type: SoundType.SFX,
        volume: 0.7,
        loop: false,
      },
      {
        name: SoundName.PROJECT_BACK,
        path: AUDIO_PATHS.PROJECT_BACK,
        type: SoundType.SFX,
        volume: 0.7,
        loop: false,
      },
      {
        name: SoundName.FORM_ANIMATION_SOUND,
        path: AUDIO_PATHS.FORM_ANIMATION_SOUND,
        type: SoundType.SFX,
        volume: 0.8,
        loop: false,
      },
    ];

    // Charger tous les sons en parallèle
    const loadPromises = soundsToLoad.map((sound) =>
      this.loadSound(
        sound.name,
        sound.path,
        sound.type,
        sound.volume,
        sound.loop
      ).catch((error) => {
        console.error(`Failed to load ${sound.name}:`, error);
      })
    );

    await Promise.all(loadPromises);

    this.initialized = true;
    console.log("🎵 AudioManager initialized with all sounds");
  }

  /**
   * Charge un son et l'ajoute à la map
   */
  private async loadSound(
    name: SoundName,
    path: string,
    type: SoundType,
    baseVolume: number = 1.0,
    loop: boolean = false
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio(path);
      audio.loop = loop;
      audio.preload = "auto";

      audio.addEventListener(
        "canplaythrough",
        () => {
          this.audioMap.set(name, {
            audio,
            type,
            baseVolume,
          });
          this.updateVolume(name);
          resolve();
        },
        { once: true }
      );

      audio.addEventListener("error", (e) => {
        console.error(`Failed to load sound: ${name}`, e);
        reject(e);
      });

      // Déclencher le chargement
      audio.load();
    });
  }

  /**
   * Joue un son
   */
  public play(name: SoundName): void {
    const instance = this.audioMap.get(name);
    if (!instance) {
      console.warn(`Sound not loaded: ${name}`);
      return;
    }

    const { audio } = instance;

    // Si le son joue déjà, le redémarrer depuis le début
    if (!audio.paused) {
      audio.currentTime = 0;
    }

    audio.play().catch((error) => {
      console.error(`Error playing sound: ${name}`, error);
    });
  }

  /**
   * Arrête un son
   */
  public stop(name: SoundName): void {
    const instance = this.audioMap.get(name);
    if (!instance) return;

    const { audio } = instance;
    audio.pause();
    audio.currentTime = 0;
  }

  /**
   * Met en pause un son
   */
  public pause(name: SoundName): void {
    const instance = this.audioMap.get(name);
    if (!instance) return;

    instance.audio.pause();
  }

  /**
   * Reprend un son en pause
   */
  public resume(name: SoundName): void {
    const instance = this.audioMap.get(name);
    if (!instance) return;

    instance.audio.play().catch((error) => {
      console.error(`Error resuming sound: ${name}`, error);
    });
  }

  /**
   * Met à jour le volume master
   */
  public setMasterVolume(volume: number): void {
    this.volumes.master = Math.max(0, Math.min(100, volume));
    this.updateAllVolumes();
    this.saveSettings();
  }

  /**
   * Met à jour le volume de la musique
   */
  public setMusicVolume(volume: number): void {
    this.volumes.music = Math.max(0, Math.min(100, volume));
    this.updateVolumesByType(SoundType.MUSIC);
    this.saveSettings();
  }

  /**
   * Met à jour le volume des effets sonores
   */
  public setSfxVolume(volume: number): void {
    this.volumes.sfx = Math.max(0, Math.min(100, volume));
    this.updateVolumesByType(SoundType.SFX);
    this.saveSettings();
  }

  /**
   * Calcule le volume final d'un son
   */
  private calculateVolume(type: SoundType, baseVolume: number): number {
    const masterVolume = this.volumes.master / 100;
    const typeVolume =
      type === SoundType.MUSIC
        ? this.volumes.music / 100
        : this.volumes.sfx / 100;

    return masterVolume * typeVolume * baseVolume;
  }

  /**
   * Met à jour le volume d'un son spécifique
   */
  private updateVolume(name: SoundName): void {
    const instance = this.audioMap.get(name);
    if (!instance) return;

    const { audio, type, baseVolume } = instance;
    audio.volume = this.calculateVolume(type, baseVolume);
  }

  /**
   * Met à jour tous les volumes
   */
  private updateAllVolumes(): void {
    this.audioMap.forEach((_, name) => {
      this.updateVolume(name);
    });
  }

  /**
   * Met à jour les volumes par type
   */
  private updateVolumesByType(type: SoundType): void {
    this.audioMap.forEach((instance, name) => {
      if (instance.type === type) {
        this.updateVolume(name);
      }
    });
  }

  /**
   * Charge les paramètres depuis localStorage
   */
  private loadSettings(): void {
    const saved = localStorage.getItem("portfolio-settings");
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        if (settings.volumes) {
          this.volumes = {
            master: settings.volumes.master ?? 30,
            music: settings.volumes.music ?? 20,
            sfx: settings.volumes.sfx ?? 50,
          };
        }
      } catch (e) {
        console.error("Error loading audio settings:", e);
      }
    }
  }

  /**
   * Sauvegarde les paramètres dans localStorage
   */
  private saveSettings(): void {
    const saved = localStorage.getItem("portfolio-settings");
    let settings: any = {};

    if (saved) {
      try {
        settings = JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing saved settings:", e);
      }
    }

    settings.volumes = this.volumes;
    localStorage.setItem("portfolio-settings", JSON.stringify(settings));
  }

  /**
   * Récupère les volumes actuels
   */
  public getVolumes(): VolumeSettings {
    return { ...this.volumes };
  }

  /**
   * Vérifie si un son est en cours de lecture
   */
  public isPlaying(name: SoundName): boolean {
    const instance = this.audioMap.get(name);
    if (!instance) return false;
    return !instance.audio.paused;
  }

  /**
   * Joue la musique de fond
   */
  public async playBackgroundMusic(): Promise<void> {
    const instance = this.audioMap.get(SoundName.BACKGROUND_MUSIC);
    if (!instance) {
      console.warn("Background music not loaded");
      return;
    }

    // Si la musique est déjà en cours, ne rien faire
    if (!instance.audio.paused) {
      console.log("♫ Musique déjà en cours de lecture");
      return;
    }

    try {
      await instance.audio.play();
      console.log("♫ Musique de fond démarrée");
    } catch (error) {
      // NotAllowedError est normal : les navigateurs bloquent l'autoplay jusqu'à interaction utilisateur
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        console.log("ℹ️ Autoplay bloqué par le navigateur (interaction utilisateur requise)");
      } else {
        console.error("Error playing background music:", error);
      }
      throw error;
    }
  }

  /**
   * Arrête la musique de fond
   */
  public stopBackgroundMusic(): void {
    this.stop(SoundName.BACKGROUND_MUSIC);
  }

  /**
   * Met en pause la musique de fond
   */
  public pauseBackgroundMusic(): void {
    this.pause(SoundName.BACKGROUND_MUSIC);
  }

  /**
   * Reprend la musique de fond
   */
  public resumeBackgroundMusic(): void {
    this.resume(SoundName.BACKGROUND_MUSIC);
  }
}

// Export de l'instance globale
export const audioManager = AudioManager.getInstance();
