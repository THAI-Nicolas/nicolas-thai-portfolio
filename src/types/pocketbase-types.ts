export interface TechnologiesRecord {
  id: string;
  nom: string;
  logo?: string;
  created: string;
  updated: string;
}

export interface ProcessusEtapesRecord {
  id: string;
  projet: string;
  numero: number;
  titre: string;
  description: string;
  image?: string;
  created: string;
  updated: string;
}

export interface ProjetsRecord {
  id: string;
  slug: string;
  titre: string;
  annee: string;
  description: string;
  contexte: string;
  client: string;
  cadre: string;
  temps: string;
  mode: string;
  color_from: string;
  color_to: string;
  cover_image: string;
  visuels: string[];
  resultat_url?: string;
  resultat_iframe?: string;
  processus: string[];
  technologies: string[];
  ordre: number;
  visible: boolean;
  created: string;
  updated: string;
}

export interface ProjetsResponse extends ProjetsRecord {
  expand?: {
    technologies?: TechnologiesRecord[];
    processus?: ProcessusEtapesRecord[];
  };
}

export interface Collections {
  projets: ProjetsResponse;
  technologies: TechnologiesRecord;
  processus_etapes: ProcessusEtapesRecord;
}

