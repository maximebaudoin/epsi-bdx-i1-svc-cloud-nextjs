import { Filter } from "mongodb";
import { useMongoDb } from "../hooks/useMongoDb";
import { ObjectId } from "mongodb";

export const OrmService = {
    connectAndFind: async (collectionName: string) => {
        const db = await useMongoDb();
        return await db.collection(collectionName).find({}).limit(10).toArray();
    },
    connectAndFindOne: async (dbName: string, idObjectToFind: Filter<Document>) => {
        const db = await useMongoDb();
        return await db.collection(dbName).findOne({ _id: new ObjectId(idObjectToFind) });
    }
}