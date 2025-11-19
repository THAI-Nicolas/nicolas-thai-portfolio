/**
 * CONSTANTS - Centralisation de toutes les constantes du projet
 *
 * Contient :
 * - IDs des éléments DOM
 * - Sélecteurs CSS
 * - Délais d'animation
 * - Classes CSS réutilisées
 * - Routes/URLs
 */

// ============================================
// OVERLAY IDS & SELECTORS
// ============================================

export const OVERLAY_SELECTORS = {
  CV: ".cv-overlay",
  CONTACT: ".contact-overlay",
  PRESENTATION: ".presentation-overlay",
  PARAMETRES: ".parametres-overlay",
} as const;

export const OVERLAY_BUTTON_SELECTORS = {
  CV_OPEN: "a.card-cv",
  CV_CLOSE: "#cv-return-button",
  CONTACT_OPEN: "#contact-button",
  CONTACT_CLOSE: "#contact-return-button",
  PRESENTATION_OPEN: 'button[data-type="presentation"]',
  PRESENTATION_CLOSE: "#presentation-return-button",
  PARAMETRES_OPEN: "#parametres-button",
  PARAMETRES_CLOSE: "#parametres-return-button",
} as const;

// ============================================
// CONTACT FORM IDS
// ============================================

export const CONTACT_IDS = {
  GAMING_SIGN: "gaming-sign",
  PAPER_SHEET: "paper-sheet",
  ZOOM_BUTTON: "zoom-button",
  DEZOOM_BUTTON: "dezoom-button",
  CONTACT_FORM: "contact-form",
  PAPER_FORM: "paper-form",
} as const;

export const CONTACT_SELECTORS = {
  CHAINS: ".chain",
  SYNC_INPUTS: "[data-sync]",
} as const;

// ============================================
// CAROUSEL IDS
// ============================================

export const CAROUSEL_IDS = {
  GRID: "carousel-grid",
  ARROW_RIGHT: "arrow-right",
  ARROW_LEFT: "arrow-left",
} as const;

// ============================================
// CV OVERLAY IDS
// ============================================

export const CV_IDS = {
  FLECHE_GAUCHE: "fleche-gauche",
  FLECHE_DROITE: "fleche-droite",
  MII_CONTAINER: "mii-container",
} as const;

// ============================================
// PARAMETRES IDS
// ============================================

export const PARAMETRES_IDS = {
  APPLY_BUTTON: "parametres-apply-button",
  RESET_BUTTON: "parametres-reset-button",
  MASTER_VOLUME: "master-volume-slider",
  MUSIC_VOLUME: "music-volume-slider",
} as const;

export const PARAMETRES_SELECTORS = {
  CONTENT: ".parametres-content",
  CONTAINER: ".parametres-container",
  SLIDERS: ".parametres-slider",
  TOGGLES: '.toggle-switch input[type="checkbox"]',
  BUTTONS: ".gaming-btn",
  VALUE_DISPLAY: ".slider-value",
} as const;

// ============================================
// FOOTER IDS
// ============================================

export const FOOTER_IDS = {
  CLOCK: "clock",
  DATE: "date",
  CLOCK_MOBILE: "clock-mobile",
  DATE_MOBILE: "date-mobile",
} as const;

// ============================================
// CSS CLASSES
// ============================================

export const CSS_CLASSES = {
  // Overlay states
  OVERLAY_VISIBLE: ["opacity-100", "pointer-events-auto"] as string[],
  OVERLAY_HIDDEN: ["opacity-0", "pointer-events-none"] as string[],

  // Animation states
  SHOW: "show",
  ACTIVE: "active",

  // Gaming button
  GAMING_BTN: "gaming-btn",
} as const;

// ============================================
// DELAYS (en millisecondes)
// ============================================

export const DELAYS = {
  RETRY_INIT: 100,
  ANIMATION_SHORT: 300,
  ANIMATION_MEDIUM: 500,
  ANIMATION_LONG: 1000,
} as const;

// ============================================
// ROUTES
// ============================================

export const ROUTES = {
  HOME: "/",
  PROJECT: "/projets",
} as const;

// ============================================
// ASTRO EVENTS
// ============================================

export const ASTRO_EVENTS = {
  DOM_LOADED: "DOMContentLoaded",
  PAGE_LOAD: "astro:page-load",
  BEFORE_PREPARATION: "astro:before-preparation",
  AFTER_SWAP: "astro:after-swap",
} as const;

// ============================================
// DOM EVENTS
// ============================================

export const DOM_EVENTS = {
  CLICK: "click",
  INPUT: "input",
  CHANGE: "change",
  KEYDOWN: "keydown",
  MOUSEDOWN: "mousedown",
  MOUSEUP: "mouseup",
  MOUSEMOVE: "mousemove",
  MOUSELEAVE: "mouseleave",
  RESIZE: "resize",
} as const;

// ============================================
// KEYBOARD KEYS
// ============================================

export const KEYBOARD_KEYS = {
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
  ESCAPE: "Escape",
  ENTER: "Enter",
} as const;

// ============================================
// MUTATION OBSERVER OPTIONS
// ============================================

export const MUTATION_OPTIONS = {
  ATTRIBUTES: {
    attributes: true,
    attributeFilter: ["class", "style"] as string[],
  },
} as const;
