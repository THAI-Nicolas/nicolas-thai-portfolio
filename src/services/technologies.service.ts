import pb from "../utils/pb";
import type { TechnologiesRecord } from "../../backend/pocketbase-types";
import { ProjetsService } from "./projets.service";

export class TechnologiesService {
  private static COLLECTION = "technologies";

  static async getAll(): Promise<TechnologiesRecord[]> {
    try {
      const records = await pb
        .collection(this.COLLECTION)
        .getFullList<TechnologiesRecord>();
      return records;
    } catch (error) {
      console.error("Erreur lors de la récupération des technologies:", error);
      return [];
    }
  }

  static getLogoUrl(record: TechnologiesRecord): string | null {
    if (!record.logo) {
      return null;
    }
    return ProjetsService.getFileUrl(record, record.logo);
  }

  static formatTechnologiesForPresentation(
    technologies: TechnologiesRecord[]
  ): Array<{ nom: string; logo: string }> {
    return technologies
      .map((tech) => {
        const logoUrl = this.getLogoUrl(tech);
        if (!logoUrl) {
          return null;
        }
        return {
          nom: tech.nom,
          logo: logoUrl,
        };
      })
      .filter((tech): tech is { nom: string; logo: string } => tech !== null);
  }
}
