/**
 * DOM HELPERS - Fonctions utilitaires pour manipuler le DOM
 *
 * Simplifie et sécurise les opérations DOM répétitives :
 * - Sélection d'éléments avec vérification null
 * - Manipulation de classes
 * - Gestion d'événements
 * - Retry automatique pour éléments non encore chargés
 */

// ============================================
// ELEMENT SELECTION
// ============================================

/**
 * Sélectionne un élément par ID avec vérification null
 * @param id - L'ID de l'élément à sélectionner
 * @returns L'élément trouvé ou null
 */
export function getById<T extends HTMLElement = HTMLElement>(
  id: string
): T | null {
  return document.getElementById(id) as T | null;
}

/**
 * Sélectionne un élément par sélecteur CSS avec vérification null
 * @param selector - Le sélecteur CSS
 * @returns L'élément trouvé ou null
 */
export function getElement<T extends HTMLElement = HTMLElement>(
  selector: string
): T | null {
  return document.querySelector(selector) as T | null;
}

/**
 * Sélectionne tous les éléments correspondant au sélecteur
 * @param selector - Le sélecteur CSS
 * @returns NodeList des éléments trouvés
 */
export function getElements<T extends Element = Element>(
  selector: string
): NodeListOf<T> {
  return document.querySelectorAll(selector) as NodeListOf<T>;
}

/**
 * Vérifie si un élément existe dans le DOM
 * @param selector - Le sélecteur CSS ou ID (avec #)
 * @returns true si l'élément existe
 */
export function elementExists(selector: string): boolean {
  return document.querySelector(selector) !== null;
}

/**
 * Attend qu'un élément apparaisse dans le DOM avec retry
 * @param selector - Le sélecteur CSS
 * @param maxRetries - Nombre maximum de tentatives (défaut: 10)
 * @param delay - Délai entre chaque tentative en ms (défaut: 100)
 * @returns Promise<HTMLElement | null>
 */
export async function waitForElement<T extends HTMLElement = HTMLElement>(
  selector: string,
  maxRetries: number = 10,
  delay: number = 100
): Promise<T | null> {
  for (let i = 0; i < maxRetries; i++) {
    const element = getElement<T>(selector);
    if (element) return element;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  return null;
}

// ============================================
// CLASS MANIPULATION
// ============================================

/**
 * Ajoute une ou plusieurs classes à un élément
 * @param element - L'élément cible
 * @param classes - Classe(s) à ajouter
 */
export function addClass(
  element: HTMLElement | null,
  ...classes: string[]
): void {
  if (!element) return;
  element.classList.add(...classes);
}

/**
 * Retire une ou plusieurs classes d'un élément
 * @param element - L'élément cible
 * @param classes - Classe(s) à retirer
 */
export function removeClass(
  element: HTMLElement | null,
  ...classes: string[]
): void {
  if (!element) return;
  element.classList.remove(...classes);
}

/**
 * Vérifie si un élément a une classe
 * @param element - L'élément cible
 * @param className - La classe à vérifier
 * @returns true si l'élément a la classe
 */
export function hasClass(
  element: HTMLElement | null,
  className: string
): boolean {
  return element?.classList.contains(className) ?? false;
}

/**
 * Remplace des classes par d'autres
 * @param element - L'élément cible
 * @param oldClasses - Classes à retirer
 * @param newClasses - Classes à ajouter
 */
export function replaceClasses(
  element: HTMLElement | null,
  oldClasses: string[],
  newClasses: string[]
): void {
  if (!element) return;
  removeClass(element, ...oldClasses);
  addClass(element, ...newClasses);
}

// ============================================
// EVENT HANDLING
// ============================================

/**
 * Ajoute un event listener avec vérification null
 * @param element - L'élément cible
 * @param event - Le type d'événement
 * @param handler - Le handler de l'événement
 */
export function onEvent<K extends keyof HTMLElementEventMap>(
  element: HTMLElement | Window | Document | null,
  event: K,
  handler: (e: HTMLElementEventMap[K]) => void
): void {
  if (!element) return;
  element.addEventListener(event, handler as EventListener);
}

/**
 * Ajoute un event listener sur plusieurs éléments
 * @param elements - NodeList ou Array d'éléments
 * @param event - Le type d'événement
 * @param handler - Le handler de l'événement
 */
export function onEventAll<K extends keyof HTMLElementEventMap>(
  elements: NodeListOf<HTMLElement> | HTMLElement[],
  event: K,
  handler: (e: HTMLElementEventMap[K]) => void
): void {
  elements.forEach((el) => onEvent(el, event, handler));
}

// ============================================
// STYLE MANIPULATION
// ============================================

/**
 * Définit le style inline d'un élément
 * @param element - L'élément cible
 * @param property - La propriété CSS
 * @param value - La valeur CSS
 */
export function setStyle(
  element: HTMLElement | null,
  property: string,
  value: string
): void {
  if (!element) return;
  element.style.setProperty(property, value);
}

/**
 * Définit plusieurs styles inline d'un élément
 * @param element - L'élément cible
 * @param styles - Objet de propriétés CSS
 */
export function setStyles(
  element: HTMLElement | null,
  styles: Partial<CSSStyleDeclaration>
): void {
  if (!element) return;
  Object.assign(element.style, styles);
}

/**
 * Récupère la valeur d'une propriété CSS computed
 * @param element - L'élément cible
 * @param property - La propriété CSS
 * @returns La valeur de la propriété
 */
export function getComputedStyle(
  element: HTMLElement | null,
  property: string
): string {
  if (!element) return "";
  return window.getComputedStyle(element).getPropertyValue(property);
}

// ============================================
// ATTRIBUTE MANIPULATION
// ============================================

/**
 * Définit un attribut sur un élément
 * @param element - L'élément cible
 * @param name - Le nom de l'attribut
 * @param value - La valeur de l'attribut
 */
export function setAttribute(
  element: HTMLElement | null,
  name: string,
  value: string
): void {
  if (!element) return;
  element.setAttribute(name, value);
}

/**
 * Récupère la valeur d'un attribut
 * @param element - L'élément cible
 * @param name - Le nom de l'attribut
 * @returns La valeur de l'attribut ou null
 */
export function getAttribute(
  element: HTMLElement | null,
  name: string
): string | null {
  return element?.getAttribute(name) ?? null;
}

/**
 * Retire un attribut d'un élément
 * @param element - L'élément cible
 * @param name - Le nom de l'attribut
 */
export function removeAttribute(
  element: HTMLElement | null,
  name: string
): void {
  if (!element) return;
  element.removeAttribute(name);
}

// ============================================
// MUTATION OBSERVER
// ============================================

/**
 * Crée et démarre un MutationObserver
 * @param element - L'élément à observer
 * @param callback - Fonction appelée lors des mutations
 * @param options - Options du MutationObserver
 * @returns L'instance du MutationObserver
 */
export function observeMutations(
  element: HTMLElement | null,
  callback: MutationCallback,
  options: MutationObserverInit = { attributes: true }
): MutationObserver | null {
  if (!element) return null;
  const observer = new MutationObserver(callback);
  observer.observe(element, options);
  return observer;
}

// ============================================
// UTILITIES
// ============================================

/**
 * Exécute un callback après un délai
 * @param callback - Fonction à exécuter
 * @param delay - Délai en millisecondes
 * @returns Le timeout ID
 */
export function delay(callback: () => void, ms: number): number {
  return window.setTimeout(callback, ms);
}
