import PocketBase from 'pocketbase';

const PB_URL = import.meta.env.PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';

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

