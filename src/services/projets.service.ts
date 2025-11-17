import pb from "../utils/pb";
import type {
  ProjetsResponse,
  ProcessusEtapesRecord,
} from "../types/pocketbase-types";

export class ProjetsService {
  private static COLLECTION = "projets";

  static async getAll(): Promise<ProjetsResponse[]> {
    try {
      const records = await pb
        .collection(this.COLLECTION)
        .getFullList<ProjetsResponse>({
          sort: "ordre",
          filter: "visible = true",
          expand: "technologies,processus",
        });
      return records;
    } catch (error) {
      console.error("Erreur lors de la récupération des projets:", error);
      return [];
    }
  }

  static async getBySlug(slug: string): Promise<ProjetsResponse | null> {
    try {
      const record = await pb
        .collection(this.COLLECTION)
        .getFirstListItem<ProjetsResponse>(`slug = "${slug}"`, {
          expand: "technologies,processus",
        });
      return record;
    } catch (error) {
      console.error(`Erreur lors de la récupération du projet ${slug}:`, error);
      return null;
    }
  }

  static async getById(id: string): Promise<ProjetsResponse | null> {
    try {
      const record = await pb
        .collection(this.COLLECTION)
        .getOne<ProjetsResponse>(id, {
          expand: "technologies,processus",
        });
      return record;
    } catch (error) {
      console.error(`Erreur lors de la récupération du projet ${id}:`, error);
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
