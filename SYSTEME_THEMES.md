# Système de Thèmes

## 🎨 Présentation

Le portfolio dispose d'un système de thèmes global qui permet de changer l'apparence de l'interface. Actuellement, deux thèmes sont disponibles :

- **Wii** : Le thème par défaut avec les couleurs Nintendo Wii (bleu ciel, blanc, gris)
- **Dark** : Un thème sombre avec des nuances de noir, gris et blanc cassé

## 🔧 Architecture

### 1. Variables CSS (`src/styles/global.css`)

Les couleurs sont définies via des variables CSS qui changent en fonction de l'attribut `data-theme` sur le `<html>` :

```css
:root {
  /* Thème Wii (par défaut) */
  --color-light-blue: #34beed;
  --color-dark-blue: #008cff;
  --color-light-gray: #e1e2e6;
  --color-text-gray: #383e3f;
  --color-dark-gray: #a2a2a2;
  --color-background: #f2f2f2;
}

[data-theme="dark"] {
  --color-light-blue: #4a9eff;
  --color-dark-blue: #2563eb;
  --color-light-gray: #374151;
  --color-text-gray: #e5e7eb;
  --color-dark-gray: #9ca3af;
  --color-background: #1f2937;
}
```

### 2. ThemeManager (`src/scripts/theme.ts`)

Classe singleton qui gère le changement de thème :

```typescript
import { ThemeManager } from "./scripts/theme";

const themeManager = ThemeManager.getInstance();

// Changer de thème
themeManager.setTheme("dark"); // ou 'wii'

// Obtenir le thème actuel
const currentTheme = themeManager.getTheme();

// Basculer entre les thèmes
themeManager.toggleTheme();
```

### 3. Interface Utilisateur

Le sélecteur de thème est intégré dans l'overlay **Paramètres** :

- Section "Thème" dans la colonne gauche
- 2 boutons : Wii et Dark
- Le bouton actif est mis en surbrillance

## 🎯 Fonctionnalités

### ✅ Persistance

Le thème choisi est sauvegardé dans `localStorage` et restauré automatiquement au chargement de la page.

### ✅ Événements

Un événement `themeChange` est dispatché à chaque changement :

```javascript
window.addEventListener("themeChange", (event) => {
  console.log("Nouveau thème:", event.detail.theme);
});
```

### ✅ Exclusion des pages projets

Les pages de détails des projets (`/projets/[id]/details`) **ne sont PAS affectées** par le système de thèmes car elles utilisent les couleurs dynamiques du projet (ex: jaune pour Asafram).

## 🚀 Utilisation

### Pour les utilisateurs

1. Cliquer sur le bouton **Paramètres** (icône engrenage) en bas à gauche
2. Dans la section "Thème", choisir entre **WII** et **DARK**
3. Le changement est instantané et sauvegardé automatiquement

### Pour les développeurs

#### Ajouter un nouveau thème

1. **Ajouter le type dans `theme.ts`** :

```typescript
export type Theme = "wii" | "dark" | "nouveau_theme";
```

2. **Définir les variables CSS dans `global.css`** :

```css
[data-theme="nouveau_theme"] {
  --color-light-blue: #...;
  --color-dark-blue: #...;
  /* ... autres couleurs */
}
```

3. **Ajouter le bouton dans `ParametresOverlay.astro`** :

```html
<button
  id="theme-nouveau"
  class="theme-button gaming-card group cursor-pointer"
  data-theme="nouveau_theme"
>
  <!-- Icône et nom -->
</button>
```

#### Utiliser les couleurs de thème

Dans vos composants, utilisez les variables CSS :

```css
.mon-element {
  background-color: var(--color-background);
  color: var(--color-text-gray);
  border-color: var(--color-light-blue);
}
```

Ou les classes Tailwind personnalisées :

```html
<div class="bg-background text-text-gray border-light-blue">Mon contenu</div>
```

## 📊 Variables disponibles

| Variable             | Wii     | Dark    |
| -------------------- | ------- | ------- |
| `--color-light-blue` | #34beed | #4a9eff |
| `--color-dark-blue`  | #008cff | #2563eb |
| `--color-light-gray` | #e1e2e6 | #374151 |
| `--color-text-gray`  | #383e3f | #e5e7eb |
| `--color-dark-gray`  | #a2a2a2 | #9ca3af |
| `--color-background` | #f2f2f2 | #1f2937 |

## 🎮 Classes Tailwind personnalisées

- **Texte** : `.text-light-blue`, `.text-dark-blue`, `.text-text-gray`, `.text-dark-gray`
- **Background** : `.bg-light-blue`, `.bg-dark-blue`, `.bg-light-gray`, `.bg-background`
- **Border** : `.border-light-blue`, `.border-dark-blue`, `.border-light-gray`

## 🔮 Thèmes à venir

D'autres thèmes pourront être ajoutés facilement grâce à cette architecture :

- **Retro** : Couleurs vintage des années 80
- **Neon** : Couleurs fluos cyberpunk
- **Nature** : Tons verts et terreux
- ...et plus encore !

## 📝 Notes importantes

1. Le thème **ne s'applique pas** aux pages de détails des projets (`/projets/[id]/details`)
2. Le thème par défaut est **Wii**
3. Les changements sont **instantanés** et **persistants**
4. Compatible avec **tous les navigateurs modernes**
