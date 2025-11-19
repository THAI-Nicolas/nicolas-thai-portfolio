import PocketBase from "pocketbase";

let PB_URL = "";
if (import.meta.env.MODE === "development") {
  PB_URL = "http://localhost:8090";
} else {
  PB_URL = "https://portfolio.nicolas-thai.fr:443";
}

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
