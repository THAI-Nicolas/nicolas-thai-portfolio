import PocketBase from "pocketbase";

// Utiliser une variable d'environnement si définie, sinon basculer selon le mode
const PB_URL =
  import.meta.env.PUBLIC_POCKETBASE_URL ||
  (import.meta.env.MODE === "production"
    ? "https://nicolas-thai.fr"
    : "http://localhost:8090");

// URL publique de PocketBase, à utiliser pour les liens/images rendus dans le
// HTML (le client du middleware pointe lui sur l'URL interne du serveur)
export const PB_PUBLIC_URL = PB_URL;

class PocketBaseClient {
  private static instance: PocketBase;

  private constructor() {}

  public static getInstance(): PocketBase {
    if (!PocketBaseClient.instance) {
      PocketBaseClient.instance = new PocketBase(PB_URL);
      PocketBaseClient.instance.autoCancellation(false);
    }
    return PocketBaseClient.instance;
  }
}

export const pb = PocketBaseClient.getInstance();

export default pb;
