# Configuration PocketBase

## Installation et configuration

### 1. Créer le fichier `.env`

Créez un fichier `.env` à la racine du projet avec :

```env
PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090
```

### 2. Lancer PocketBase

Depuis le dossier `backend/pocketbase/`, exécutez :

```bash
./pocketbase serve
```

PocketBase sera accessible sur `http://127.0.0.1:8090/_/`

### 3. Structure de la base de données

#### Collection `projets`

- `slug` (text, unique, required)
- `titre` (text, required)
- `annee` (text)
- `description` (editor, required)
- `contexte` (editor)
- `client` (text)
- `cadre` (text)
- `temps` (text)
- `mode` (text)
- `color_from` (text, required) - Ex: #FEEEB3
- `color_to` (text, required) - Ex: #FDDA5C
- `cover_image` (file, required)
- `visuels` (file, multiple)
- `resultat_url` (url)
- `resultat_iframe` (text)
- `technologies` (relation, multiple → technologies)
- `processus` (relation, multiple → processus_etapes)
- `ordre` (number)
- `visible` (bool, default: true)

#### Collection `technologies`

- `nom` (text, unique, required)
- `logo` (file)

#### Collection `processus_etapes`

- `projet` (relation, single → projets, required)
- `numero` (number, required)
- `titre` (text, required)
- `description` (editor, required)
- `image` (file)

## Architecture du code

### Fichiers principaux

```
backend/
├── pb.ts                           # Client PocketBase singleton
├── pocketbase-types.ts             # Types TypeScript
├── services/
│   └── projets.service.ts          # Service pour les projets
└── README_POCKETBASE.md            # Ce fichier
```

### Utilisation dans les pages Astro

```astro
---
import { ProjetsService } from "../../../backend/services/projets.service";

// Récupérer un projet par slug
const projet = await ProjetsService.getBySlug("asafram");

// Récupérer tous les projets
const projets = await ProjetsService.getAll();

// Obtenir l'URL de la cover
const coverUrl = ProjetsService.getCoverUrl(projet);

// Obtenir les URLs des visuels
const visuelUrls = ProjetsService.getVisuelUrls(projet);
---
```

## Routes dynamiques

### Page cover : `/projets/[id]`

Affiche la cover du projet en utilisant le slug comme paramètre.

### Page détails : `/projets/[id]/details`

Affiche tous les détails du projet (description, contexte, processus, etc.).

## Notes importantes

1. **Expand automatique** : Le service récupère automatiquement les technologies et les étapes du processus avec `expand: 'technologies,processus'`.

2. **Ordre des étapes** : Les étapes du processus sont automatiquement triées par leur numéro.

3. **Gestion des erreurs** : Si un projet n'est pas trouvé, les pages redirigent vers la page d'accueil.

4. **HTML dans le contenu** : Utilisez `set:html` pour afficher le contenu éditeur (description, contexte, etc.).

5. **URLs des fichiers** : Utilisez toujours `ProjetsService.getFileUrl()` pour obtenir les URLs correctes des fichiers PocketBase.
