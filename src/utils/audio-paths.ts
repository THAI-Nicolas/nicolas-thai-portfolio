/**
 * Chemins des assets audio
 * Utilisation d'imports statiques pour que Vite/Astro puisse les traiter correctement
 */

import backgroundMusic from "../assets/sounds/music-portfolio.mp3";
import cardCvClick from "../assets/sounds/card-cv-click.MP3";
import mainButtonClick from "../assets/sounds/main-button-click.MP3";
import smallButtonClick from "../assets/sounds/small-button-click.MP3";
import bookPageTurn from "../assets/sounds/book-page-turn.MP3";
import bookOpen from "../assets/sounds/book-open.MP3";
import bookClose from "../assets/sounds/book-close.MP3";
import arrowClick from "../assets/sounds/arrow-click.MP3";
import projectSelect from "../assets/sounds/project-select.MP3";
import projectView from "../assets/sounds/project-view.MP3";
import projectBack from "../assets/sounds/project-back.MP3";
import formAnimationSound from "../assets/sounds/form-animation-sound.MP3";

export const AUDIO_PATHS = {
  BACKGROUND_MUSIC: backgroundMusic,
  CARD_CV_CLICK: cardCvClick,
  MAIN_BUTTON_CLICK: mainButtonClick,
  SMALL_BUTTON_CLICK: smallButtonClick,
  BOOK_PAGE_TURN: bookPageTurn,
  BOOK_OPEN: bookOpen,
  BOOK_CLOSE: bookClose,
  ARROW_CLICK: arrowClick,
  PROJECT_SELECT: projectSelect,
  PROJECT_VIEW: projectView,
  PROJECT_BACK: projectBack,
  FORM_ANIMATION_SOUND: formAnimationSound,
} as const;
