import clientPromise from "../lib/mongodb";
import { MongoConfigService } from "../services/MongoConfigService";

export const useMongoDb = async () => {
    const client = await clientPromise;
    const db = client.db(MongoConfigService.databases.mflix);

    return db;
}