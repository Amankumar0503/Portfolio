import { MongoClient, type Db } from "mongodb";

const globalForMongo = globalThis as unknown as {
  mongoClient?: MongoClient;
};

export async function getDb(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not configured");
  }

  if (!globalForMongo.mongoClient) {
    globalForMongo.mongoClient = new MongoClient(uri);
  }

  await globalForMongo.mongoClient.connect();
  return globalForMongo.mongoClient.db(process.env.MONGODB_DB || "portfolio");
}
