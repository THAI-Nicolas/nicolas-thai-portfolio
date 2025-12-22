import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export class MiiButton {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private model: THREE.Group | null = null;
  private mixer: THREE.AnimationMixer | null = null;
  private clock: THREE.Clock;
  private animationFrameId: number | null = null;
  private boundHandleResize?: () => void;
  private resizeObserver: ResizeObserver | null = null;
  private lastSize: number = 0;

  // Paramètres fixes pour le bouton
  private params = {
    // Caméra - vue plus proche pour voir la tête
    cameraX: 0,
    cameraY: 0.85,
    cameraZ: 0.55,
    cameraFOV: 50,
    lookAtY: 0.9,
    // Modèle - échelle plus grande pour remplir le bouton
    modelX: 0,
    modelY: 0.43,
    modelZ: -0.13,
    modelScaleX: 0.18,
    modelScaleY: 0.18,
    modelScaleZ: 0.18,
    modelRotationY: 0,
  };

  constructor(container: HTMLElement) {
    this.container = container;
    this.clock = new THREE.Clock();

    // Initialisation de la scène
    this.scene = new THREE.Scene();

    // Configuration de la caméra
    this.camera = new THREE.PerspectiveCamera(
      this.params.cameraFOV,
      1, // Aspect ratio carré pour le bouton rond
      0.1,
      1000
    );
    this.camera.position.set(
      this.params.cameraX,
      this.params.cameraY,
      this.params.cameraZ
    );
    this.camera.lookAt(0, this.params.lookAtY, 0);

    // Configuration du renderer avec qualité maximale
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    const size = Math.min(container.clientWidth, container.clientHeight);
    this.lastSize = size;
    // Augmenter la résolution pour un rendu plus net (2x la taille)
    this.renderer.setSize(size * 2, size * 2);
    // Utiliser le pixel ratio natif pour la meilleure qualité
    this.renderer.setPixelRatio(window.devicePixelRatio);
    // Activer le tone mapping pour de meilleures couleurs
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    // Style pour que le canvas s'adapte au container
    this.renderer.domElement.style.width = "100%";
    this.renderer.domElement.style.height = "100%";
    container.appendChild(this.renderer.domElement);

    // Ajout des lumières
    this.setupLights();

    // Chargement du modèle
    this.loadModel();

    // Gestion du resize
    this.boundHandleResize = this.handleResize.bind(this);

    // ResizeObserver pour détecter les changements de taille du conteneur (clamp CSS)
    this.resizeObserver = new ResizeObserver(() => {
      this.handleResize();
    });
    this.resizeObserver.observe(this.container);

    // Window resize comme backup
    window.addEventListener("resize", this.boundHandleResize);
  }

  private setupLights(): void {
    // Lumière ambiante forte pour un rendu clair (comme dans l'overlay CV)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    this.scene.add(ambientLight);

    // Lumière directionnelle principale
    const mainLight = new THREE.DirectionalLight(0xffffff, 0.6);
    mainLight.position.set(2, 5, 3);
    this.scene.add(mainLight);

    // Lumière de remplissage
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(-2, 3, -2);
    this.scene.add(fillLight);

    // Lumière arrière pour créer de la profondeur
    const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
    backLight.position.set(0, 2, -3);
    this.scene.add(backLight);
  }

  private loadModel(): void {
    const loader = new GLTFLoader();

    loader.load(
      "/models/mii-character.glb",
      (gltf) => {
        this.model = gltf.scene;

        // Amélioration de la qualité des matériaux
        this.model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (mesh.material) {
              const material = mesh.material as THREE.MeshStandardMaterial;
              // Activer le smooth shading pour un rendu plus lisse
              mesh.geometry.computeVertexNormals();
              // Améliorer les propriétés du matériau
              material.flatShading = false;
              material.metalness = 0.1;
              material.roughness = 0.8;
              material.needsUpdate = true;
            }
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

        // Configuration de l'animation "sitting"
        if (gltf.animations && gltf.animations.length > 0) {
          this.mixer = new THREE.AnimationMixer(this.model);

          // Chercher l'animation "sitting"
          const sittingAnimation = gltf.animations.find(
            (clip) =>
              clip.name.toLowerCase().includes("sitting") ||
              clip.name.toLowerCase().includes("sit")
          );

          if (sittingAnimation) {
            const action = this.mixer.clipAction(sittingAnimation);
            action.play();
          } else {
            // Si pas d'animation "sitting", utiliser la première animation
            const action = this.mixer.clipAction(gltf.animations[0]);
            action.play();
          }
        }

        // Démarrer l'animation
        this.animate();
      },
      undefined,
      (error) => {
        console.error("Error loading Mii model for button:", error);
      }
    );
  }

  private animate(): void {
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
      this.model.rotation.y = this.params.modelRotationY;
    }

    this.renderer.render(this.scene, this.camera);
  }

  private handleResize(): void {
    if (!this.container) return;

    const size = Math.min(
      this.container.clientWidth,
      this.container.clientHeight
    );

    // Ne redimensionner que si la taille a vraiment changé
    if (Math.abs(size - this.lastSize) < 1) return;

    this.lastSize = size;
    // Maintenir la haute résolution lors du resize
    this.renderer.setSize(size * 2, size * 2);
  }

  public destroy(): void {
    // Arrêter l'animation
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    // Nettoyer les événements
    if (this.boundHandleResize) {
      window.removeEventListener("resize", this.boundHandleResize);
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    // Nettoyer le renderer
    if (this.renderer) {
      this.renderer.dispose();
      if (
        this.container &&
        this.renderer.domElement.parentNode === this.container
      ) {
        this.container.removeChild(this.renderer.domElement);
      }
    }

    // Nettoyer la scène
    if (this.scene) {
      this.scene.traverse((object) => {
        if ((object as THREE.Mesh).isMesh) {
          const mesh = object as THREE.Mesh;
          mesh.geometry?.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((material) => material.dispose());
          } else {
            mesh.material?.dispose();
          }
        }
      });
    }
  }
}
