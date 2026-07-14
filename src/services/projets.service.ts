import pb from "../utils/pb";
import type {
  ProjetsResponse,
  ProcessusEtapesRecord,
} from "../types/pocketbase-types";

export class ProjetsService {
  private static COLLECTION = "projets";

  // Cache en mémoire de la liste des projets : évite un aller-retour PocketBase
  // à chaque requête SSR. Une édition admin apparaît au plus tard après le TTL.
  private static CACHE_TTL_MS = 60_000;
  private static listCache: {
    data: ProjetsResponse[];
    expiresAt: number;
  } | null = null;

  static async getAll(): Promise<ProjetsResponse[]> {
    if (this.listCache && this.listCache.expiresAt > Date.now()) {
      return this.listCache.data;
    }

    try {
      const records = await pb
        .collection(this.COLLECTION)
        .getFullList<ProjetsResponse>({
          sort: "ordre",
          filter: "visible = true",
          expand: "technologies,processus",
        });
      this.listCache = {
        data: records,
        expiresAt: Date.now() + this.CACHE_TTL_MS,
      };
      return records;
    } catch (error) {
      console.error("Erreur lors de la récupération des projets:", error);
      // Servir le cache périmé plutôt qu'une page vide si PocketBase est indisponible
      return this.listCache?.data ?? [];
    }
  }

  static async getBySlug(slug: string): Promise<ProjetsResponse | null> {
    // Servir depuis la liste en cache quand elle est chaude (même expand)
    if (this.listCache && this.listCache.expiresAt > Date.now()) {
      const cached = this.listCache.data.find((p) => p.slug === slug);
      if (cached) return cached;
      // Absent du cache (ex: projet non visible) : requête directe ci-dessous
    }

    try {
      const record = await pb
        .collection(this.COLLECTION)
        .getFirstListItem<ProjetsResponse>(pb.filter("slug = {:slug}", { slug }), {
          expand: "technologies,processus",
        });
      return record;
    } catch (error) {
      console.error(`Erreur lors de la récupération du projet ${slug}:`, error);
      return null;
    }
  }

  static getFileUrl(
    record: ProjetsResponse | ProcessusEtapesRecord | any,
    filename: string
  ): string {
    if (!filename) return "";
    try {
      return pb.files.getURL(record, filename);
    } catch (error) {
      console.error(
        `Erreur lors de la récupération du fichier ${filename}:`,
        error
      );
      return "";
    }
  }

  static getCoverUrl(record: ProjetsResponse): string {
    if (!record?.cover_image) return "";
    return this.getFileUrl(record, record.cover_image);
  }

  static getVisuelUrls(record: ProjetsResponse): string[] {
    return record.visuels.map((filename) => this.getFileUrl(record, filename));
  }
}
