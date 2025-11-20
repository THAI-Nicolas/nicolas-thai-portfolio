# 🎵 Liste des Sons du Portfolio

## État d'implémentation

### ✅ Implémentés et Fonctionnels

1. **Musique de fond** (`background-music`) ✅
   - Lecture automatique après première interaction utilisateur
   - Volume contrôlé par les paramètres
2. **Animation pancarte de contact** (`form-animation-sound`) ✅

   - Joué automatiquement à l'ouverture de l'overlay contact

3. **Flèches de navigation carousel** (`arrow-click`) ✅

   - Joué lors du clic sur les flèches gauche/droite

4. **Livre de présentation** ✅
   - **Ouverture** (`book-open`) : Premier clic sur le livre
   - **Changement de page** (`book-page-turn`) : Pages suivantes
   - **Fermeture** (`book-close`) : Retour à la couverture

### 📋 Sons disponibles (gérés automatiquement via UISoundsManager)

5. **Click card CV** (`card-cv-click`) ✅

   - Détecté automatiquement sur `.card-cv`

6. **Click MainBouton** (`main-button-click`) ✅

   - Détecté automatiquement sur `[data-main-button]`

7. **Click SmallBouton** (`small-button-click`) ✅

   - Détecté automatiquement sur `[data-small-button]`

8. **Projets** ✅
   - **Sélection depuis l'accueil** (`project-select`) : Liens vers `/projets/[id]` depuis `/`
   - **Voir le projet** (`project-view`) : Liens vers `/projets/[id]/details`
   - **Retour (page cover)** (`project-back`) : Boutons avec `[data-project-back]`

## Architecture du Système Audio

### 📁 Fichiers Principaux

- **`src/scripts/audio-manager.ts`** : Gestionnaire centralisé des sons
  - Chargement et mise en cache
  - Contrôle des volumes (master, music, SFX)
  - Synchronisation localStorage
- **`src/scripts/ui-sounds-manager.ts`** : Attache automatique des sons à l'UI
  - Détection automatique des éléments
  - Réattachement après navigation
- **`src/utils/audio-paths.ts`** : Import statique des fichiers audio
  - Optimisé pour Vite/Astro
- **`src/scripts/parametres-manager.ts`** : Contrôles de volume
  - Sliders connectés à l'AudioManager

### 🎚️ Système de Volumes

```
Volume Final = Master × Type (Music/SFX) × Base Volume

Défauts:
- Master: 50%
- Music: 40%
- SFX: 70%
```

### 🔄 Cycle de Vie

1. **Chargement** (`Layout.astro`)

   ```typescript
   await audioManager.init(); // Charge tous les sons
   uiSoundsManager.init(); // Attache les listeners
   ```

2. **Navigation** (View Transitions)

   ```typescript
   document.addEventListener("astro:after-swap", () => {
     uiSoundsManager.reattach(); // Ré-attache les listeners
   });
   ```

3. **Musique** (après interaction utilisateur)
   ```typescript
   audioManager.playBackgroundMusic();
   ```

## 🎯 Utilisation

### Sons Automatiques (via data-attributes)

Les sons sont joués automatiquement si les éléments ont les bons attributs :

```html
<!-- CardCV : automatique via .card-cv -->
<a class="card-cv" href="/cv">...</a>

<!-- MainBouton : ajouter data-main-button -->
<button data-main-button>...</button>

<!-- SmallBouton : ajouter data-small-button -->
<button data-small-button>...</button>

<!-- Retour projet : ajouter data-project-back -->
<button data-project-back>...</button>
```

### Sons Manuels

Pour les sons spécifiques (livre, carousel, etc.) :

```typescript
import { audioManager, SoundName } from "../scripts/audio-manager";

audioManager.play(SoundName.BOOK_OPEN);
audioManager.play(SoundName.ARROW_CLICK);
```

## 📝 Notes Techniques

- ✅ Tous les sons préchargés en parallèle au démarrage
- ✅ Format MP3 supporté (avec déclarations TypeScript)
- ✅ Politique autoplay respectée (musique après interaction)
- ✅ Volumes persistés dans localStorage
- ✅ Système extensible pour nouveaux sons
- ✅ Compatible View Transitions d'Astro

## 🎨 Fichiers Audio

Tous dans `src/assets/sounds/` :

- `music-portfolio.mp3`
- `card-cv-click.MP3`
- `main-button-click.MP3`
- `small-button-click.MP3`
- `book-page-turn.MP3`
- `book-open.MP3`
- `book-close.MP3`
- `arrow-click.MP3`
- `project-select.MP3`
- `project-view.MP3`
- `project-back.MP3`
- `form-animation-sound.MP3`
