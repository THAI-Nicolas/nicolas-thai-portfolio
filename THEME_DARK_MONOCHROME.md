# Mode Dark Monochrome - Résumé des Modifications

## Palette de Couleurs - Thème Dark

Le thème Dark utilise maintenant **uniquement des nuances de noir, gris et blanc** :

```css
[data-theme="dark"] {
  --color-light-blue: #d1d5db; /* Gris clair (remplace le bleu clair) */
  --color-dark-blue: #9ca3af; /* Gris moyen (remplace le bleu foncé) */
  --color-light-gray: #374151; /* Gris foncé */
  --color-text-gray: #f3f4f6; /* Presque blanc pour le texte */
  --color-dark-gray: #6b7280; /* Gris sombre */
  --color-background: #1a1a1a; /* Noir profond */
}
```

## Fichiers Modifiés

### 1. `src/styles/global.css`

- Remplacement de toutes les couleurs bleues du thème Dark par des gris
- Conservation des couleurs bleues uniquement pour le thème Wii

### 2. `src/pages/index.astro`

- `bg-gray-100` → `bg-background` pour s'adapter au thème

### 3. `src/pages/projets/[id].astro`

- Gradient du footer de la cover : utilise maintenant `var(--color-background)` et `var(--color-light-gray)`

### 4. `src/components/layout/FooterAccueil.astro`

- Horloge : `text-[#727272]` → `text-dark-gray`
- Filtres CSS appliqués aux SVG du footer en mode dark :
  ```css
  [data-theme="dark"] .footer-svg {
    filter: brightness(0.3) saturate(0);
  }
  ```

### 5. `src/components/layout/FooterAccueilMobile.astro`

- Horloge : `text-[#727272]` → `text-dark-gray`
- Filtres CSS appliqués aux SVG du footer mobile en mode dark

### 6. `src/components/layout/ContactOverlay.astro`

- Titres, labels, inputs : toutes les couleurs bleues remplacées par les classes avec variables CSS
- `text-[#34beed]` → `text-light-blue`
- `border-[#34beed]` → `border-light-blue`
- `bg-[#34beed]` → `bg-light-blue`

### 7. `src/components/layout/ParametresOverlay.astro`

- Backgrounds : `bg-[#f2f2f2]` → `bg-background`
- Headers/Footers : utilisation de `color-mix` avec les variables CSS

### 8. `src/components/boutons/MainBouton.astro`

- Type "presentation" : `bg-gray-300` → `bg-[var(--color-light-gray)]`
- Type "presentation" : `text-gray-600` → `text-[var(--color-dark-gray)]`

### 9. `src/components/ui/Fleche.astro`

- Effet hover : utilise maintenant `color-mix` avec `var(--color-light-blue)`
- En mode dark, le "light-blue" sera gris clair

## Résultat

En mode **Dark** :

- ✅ Fond : Noir profond (#1a1a1a)
- ✅ Textes : Blanc cassé (#f3f4f6) et gris (#6b7280)
- ✅ Bordures/Accents : Gris clair (#d1d5db) et gris moyen (#9ca3af)
- ✅ Footer : SVG assombris et désaturés
- ✅ Flèches : Gris clair au lieu de bleu
- ✅ Boutons : Gris au lieu de bleu
- ❌ **AUCUNE trace de bleu**

En mode **Wii** :

- ✅ Toutes les couleurs originales (bleu clair, bleu foncé, gris clair, etc.)
- ✅ Conserve l'esthétique Wii originale
