/**
 * ContactFormManager - Gère le formulaire de contact avec ses animations
 *
 * Gère :
 * - L'animation de la pancarte et des chaînes
 * - Le zoom/dézoom de la feuille de papier
 * - La synchronisation entre les deux formulaires (pancarte et feuille)
 * - L'envoi d'emails via EmailJS
 */

import emailjs from '@emailjs/browser';
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
  private contactForm: HTMLFormElement | null = null;
  private paperForm: HTMLFormElement | null = null;

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
    this.contactForm = getById(CONTACT_IDS.CONTACT_FORM) as HTMLFormElement;
    this.paperForm = getById(CONTACT_IDS.PAPER_FORM) as HTMLFormElement;
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
    this.setupFormSubmit();
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
   * Configure la soumission des formulaires avec EmailJS
   */
  private setupFormSubmit(): void {
    // Récupérer les clés depuis les variables d'environnement
    const serviceId = import.meta.env.PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY;

    console.log('📧 EmailJS Config:', {
      serviceId: serviceId ? '✓' : '✗',
      templateId: templateId ? '✓' : '✗',
      publicKey: publicKey ? '✓' : '✗',
      hasContactForm: !!this.contactForm,
      hasPaperForm: !!this.paperForm
    });

    if (!serviceId || !templateId || !publicKey) {
      console.error('❌ EmailJS non configuré. Variables manquantes:', {
        serviceId,
        templateId,
        publicKey
      });
      return;
    }

    // Initialiser EmailJS avec la clé publique
    emailjs.init(publicKey);
    console.log('✅ EmailJS initialisé avec succès');

    // Gérer la soumission du formulaire de la pancarte
    if (this.contactForm) {
      onEvent(this.contactForm, 'submit', async (e) => {
        e.preventDefault();
        console.log('📤 Soumission du formulaire pancarte');
        await this.handleSubmit(this.contactForm!, serviceId, templateId);
      });
    }

    // Gérer la soumission du formulaire de la feuille
    if (this.paperForm) {
      onEvent(this.paperForm, 'submit', async (e) => {
        e.preventDefault();
        console.log('📤 Soumission du formulaire feuille');
        await this.handleSubmit(this.paperForm!, serviceId, templateId);
      });
    }

    console.log("Form submit handlers configured with EmailJS!");
  }

  /**
   * Gère l'envoi du formulaire
   */
  private async handleSubmit(form: HTMLFormElement, serviceId: string, templateId: string): Promise<void> {
    const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    const originalText = submitButton.textContent;

    console.log('🚀 Début envoi email...');

    try {
      // Désactiver le bouton et afficher un loader
      submitButton.disabled = true;
      submitButton.textContent = 'ENVOI EN COURS...';
      submitButton.style.opacity = '0.7';

      // Préparer les données du formulaire
      const formData = new FormData(form);
      const templateParams = {
        from_name: `${formData.get('prenom')} ${formData.get('nom')}`,
        from_email: formData.get('email'),
        subject: formData.get('sujet'),
        message: formData.get('message'),
        prenom: formData.get('prenom'),
        nom: formData.get('nom'),
      };

      console.log('📋 Données du formulaire:', templateParams);

      // Envoyer via EmailJS
      const response = await emailjs.send(serviceId, templateId, templateParams);

      console.log('✅ Email envoyé avec succès!', response);

      // Message de succès
      submitButton.textContent = '✓ MESSAGE ENVOYÉ !';
      submitButton.style.background = '#10b981';
      submitButton.style.borderColor = '#10b981';

      // Réinitialiser le formulaire après 2 secondes
      await delay(() => {
        this.reset();
        submitButton.textContent = originalText || 'ENVOYER';
        submitButton.style.background = '';
        submitButton.style.borderColor = '';
        submitButton.style.opacity = '';
        submitButton.disabled = false;
      }, 2000);

    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi:', error);

      // Message d'erreur
      submitButton.textContent = '✗ ERREUR D\'ENVOI';
      submitButton.style.background = '#ef4444';
      submitButton.style.borderColor = '#ef4444';

      // Réinitialiser après 2 secondes
      await delay(() => {
        submitButton.textContent = originalText || 'ENVOYER';
        submitButton.style.background = '';
        submitButton.style.borderColor = '';
        submitButton.style.opacity = '';
        submitButton.disabled = false;
      }, 2000);
    }
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
