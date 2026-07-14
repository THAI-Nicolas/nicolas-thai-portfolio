import * as THREE from "three";

export class MiiScene {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private model: THREE.Group | null = null;
  private mixer: THREE.AnimationMixer | null = null;
  private clock: THREE.Clock;
  private animationFrameId: number | null = null;
  private isRotating: boolean = false;
  private rotationDirection: "left" | "right" | null = null;
  private rotationSpeed: number = 0.05;
  private boundHandleResize: () => void;
  private boundHandleVisibility?: () => void;
  private resizeObserver: ResizeObserver | null = null;
  private intersectionObserver: IntersectionObserver | null = null;
  private GLTFLoader: any = null; // Chargé dynamiquement
  private isPageVisible: boolean = !document.hidden;
  private isInView: boolean = true;
  private animationStarted: boolean = false;
  private destroyed: boolean = false;

  // Paramètres fixes
  private params = {
    // Caméra
    cameraX: 0,
    cameraY: 1.2,
    cameraZ: 4,
    cameraFOV: 45,
    lookAtY: 0.8,
    // Modèle
    modelX: 0,
    modelY: -0.03,
    modelZ: 0,
    modelScaleX: 0.4,
    modelScaleY: 0.4,
    modelScaleZ: 0.4,
    modelRotationY: 0,
  };

  constructor(container: HTMLElement) {
    this.container = container;
    this.clock = new THREE.Clock();
    this.boundHandleResize = this.handleResize.bind(this);

    // Initialisation de la scène
    this.scene = new THREE.Scene();

    // Configuration de la caméra
    this.camera = new THREE.PerspectiveCamera(
      this.params.cameraFOV,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(
      this.params.cameraX,
      this.params.cameraY,
      this.params.cameraZ
    );
    this.camera.lookAt(0, this.params.lookAtY, 0);

    // Configuration du renderer
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this.renderer.domElement);

    // Ajout des lumières
    this.setupLights();

    // Chargement du modèle
    this.loadModel();

    // Gestion du resize avec ResizeObserver pour détecter les changements de taille du conteneur
    this.resizeObserver = new ResizeObserver((entries) => {
      this.handleResize();
    });
    this.resizeObserver.observe(this.container);

    // Backup avec window resize
    window.addEventListener("resize", this.boundHandleResize);

    // Mettre le rendu en pause quand l'onglet est caché
    this.boundHandleVisibility = () => {
      this.isPageVisible = !document.hidden;
      this.updateAnimationState();
    };
    document.addEventListener("visibilitychange", this.boundHandleVisibility);

    // Mettre le rendu en pause quand la scène sort de l'écran (overlay masqué)
    this.intersectionObserver = new IntersectionObserver((entries) => {
      this.isInView = entries[0]?.isIntersecting ?? true;
      this.updateAnimationState();
    });
    this.intersectionObserver.observe(this.container);
  }

  private shouldAnimate(): boolean {
    return this.isPageVisible && this.isInView && !this.destroyed;
  }

  /**
   * Démarre ou arrête la boucle de rendu selon la visibilité
   */
  private updateAnimationState(): void {
    if (this.shouldAnimate()) {
      if (this.animationStarted && this.animationFrameId === null) {
        // Réinitialiser le delta pour éviter un saut d'animation après la pause
        this.clock.getDelta();
        this.animate();
      }
    } else if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private setupLights(): void {
    // Lumière ambiante plus forte
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    this.scene.add(ambientLight);

    // Lumière directionnelle principale
    const mainLight = new THREE.DirectionalLight(0xffffff, 0.6);
    mainLight.position.set(5, 10, 5);
    this.scene.add(mainLight);

    // Lumière de remplissage
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(-5, 5, -5);
    this.scene.add(fillLight);

    // Lumière arrière (rim light)
    const backLight = new THREE.DirectionalLight(0x34beed, 0.3);
    backLight.position.set(0, 3, -5);
    this.scene.add(backLight);
  }

  private async loadModel(): Promise<void> {
    // Lazy load du GLTFLoader uniquement quand nécessaire
    if (!this.GLTFLoader) {
      const { GLTFLoader } = await import(
        "three/examples/jsm/loaders/GLTFLoader.js"
      );
      this.GLTFLoader = GLTFLoader;
    }

    const loader = new this.GLTFLoader();

    loader.load(
      "/models/mii-character.glb",
      (gltf) => {
        this.model = gltf.scene;

        // Configuration du modèle
        this.model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            // Désactiver les ombres pour un rendu plus clair
          }
        });

        // Positionnement et échelle du modèle
        this.model.position.set(
          this.params.modelX,
          this.params.modelY,
          this.params.modelZ
        );
        this.model.scale.set(
          this.params.modelScaleX,
          this.params.modelScaleY,
          this.params.modelScaleZ
        );
        this.model.rotation.y = this.params.modelRotationY;

        this.scene.add(this.model);

        // Configuration de l'animation
        if (gltf.animations && gltf.animations.length > 0) {
          this.mixer = new THREE.AnimationMixer(this.model);
          // Chercher l'animation idle
          const idleAnimation =
            gltf.animations.find((clip) =>
              clip.name.toLowerCase().includes("idle")
            ) || gltf.animations[0];

          const action = this.mixer.clipAction(idleAnimation);
          action.play();
        }

        // Démarrer l'animation
        this.animationStarted = true;
        this.animate();
      },
      (progress) => {
        // Silent loading
      },
      (error) => {
        console.error("Error loading model:", error);
      }
    );
  }

  private animate(): void {
    if (!this.shouldAnimate()) {
      this.animationFrameId = null;
      return;
    }

    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));

    const delta = this.clock.getDelta();

    // Mise à jour de l'animation
    if (this.mixer) {
      this.mixer.update(delta);
    }

    // Mise à jour de la caméra
    this.camera.position.set(
      this.params.cameraX,
      this.params.cameraY,
      this.params.cameraZ
    );
    this.camera.fov = this.params.cameraFOV;
    this.camera.lookAt(0, this.params.lookAtY, 0);
    this.camera.updateProjectionMatrix();

    // Mise à jour du modèle
    if (this.model) {
      this.model.position.set(
        this.params.modelX,
        this.params.modelY,
        this.params.modelZ
      );
      this.model.scale.set(
        this.params.modelScaleX,
        this.params.modelScaleY,
        this.params.modelScaleZ
      );

      // Appliquer la rotation manuelle si active
      if (this.isRotating && this.rotationDirection) {
        const rotationDelta =
          this.rotationDirection === "left"
            ? this.rotationSpeed
            : -this.rotationSpeed;
        this.params.modelRotationY += rotationDelta;
        // Normaliser l'angle entre 0 et 2*PI
        if (this.params.modelRotationY > Math.PI * 2) {
          this.params.modelRotationY -= Math.PI * 2;
        } else if (this.params.modelRotationY < 0) {
          this.params.modelRotationY += Math.PI * 2;
        }
      }

      this.model.rotation.y = this.params.modelRotationY;
    }

    this.renderer.render(this.scene, this.camera);
  }

  private handleResize(): void {
    if (!this.container) return;

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Force un rendu immédiat
    this.renderer.render(this.scene, this.camera);
  }

  public startRotation(direction: "left" | "right"): void {
    this.isRotating = true;
    this.rotationDirection = direction;
  }

  public stopRotation(): void {
    this.isRotating = false;
    this.rotationDirection = null;
  }

  public destroy(): void {
    this.destroyed = true;

    // Arrêter l'animation
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // Arrêter les actions d'animation en cours
    if (this.mixer) {
      this.mixer.stopAllAction();
      if (this.model) {
        this.mixer.uncacheRoot(this.model);
      }
      this.mixer = null;
    }

    // Nettoyer le ResizeObserver
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = null;
    }

    // Nettoyer les événements
    window.removeEventListener("resize", this.boundHandleResize);
    if (this.boundHandleVisibility) {
      document.removeEventListener(
        "visibilitychange",
        this.boundHandleVisibility
      );
    }

    // Nettoyer la scène (géométries, matériaux et leurs textures)
    if (this.scene) {
      const disposeMaterial = (material: THREE.Material) => {
        for (const value of Object.values(material)) {
          if (value && typeof value === "object" && "isTexture" in value) {
            (value as THREE.Texture).dispose();
          }
        }
        material.dispose();
      };

      this.scene.traverse((object) => {
        if ((object as THREE.Mesh).isMesh) {
          const mesh = object as THREE.Mesh;
          mesh.geometry?.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(disposeMaterial);
          } else if (mesh.material) {
            disposeMaterial(mesh.material);
          }
        }
      });
    }

    // Nettoyer le renderer et libérer le contexte WebGL de façon déterministe
    if (this.renderer) {
      this.renderer.dispose();
      try {
        this.renderer.forceContextLoss();
      } catch {
        // Certains navigateurs peuvent refuser : le GC s'en chargera
      }
      if (
        this.container &&
        this.renderer.domElement.parentNode === this.container
      ) {
        this.container.removeChild(this.renderer.domElement);
      }
    }
  }
}
