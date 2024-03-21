import { Filter } from "mongodb";
import { useMongoDb } from "../hooks/useMongoDb";
import { ObjectId } from "mongodb";

export const OrmService = {
    connectAndFind: async (collectionName: string) => {
        const db = await useMongoDb();
        return await db.collection(collectionName).find({}).limit(10).toArray();
    },
    connectAndFindOne: async (dbName: string, idObjectToFind: string, filterObjectToFind: Filter<Document> = {}) => {
        const db = await useMongoDb();
        return await db.collection(dbName).findOne({ _id: new ObjectId(idObjectToFind), ...filterObjectToFind });
    },
    connectAndDeleteOne: async (dbName: string, idObjectToDelete: string, filterObjectToDelete: Filter<Document> = {}) => {
        const db = await useMongoDb();
        return await db.collection(dbName).deleteOne({ _id: new ObjectId(idObjectToDelete), ...filterObjectToDelete });
    },
    connectAndInsertOne: async (dbName: string, objectToInsert: OptionalId<Document>) => {
        const db = await useMongoDb();
        return await db.collection(dbName).insertOne(objectToInsert);
    },
    connectAndUpdateOne: async (dbName: string, idObjectToUpdate: string, objectToUpdate: Partial<Document> | UpdateFilter<Document>) => {
        const db = await useMongoDb();
        return await db.collection(dbName).updateOne({ _id: new ObjectId(idObjectToUpdate) }, objectToUpdate);
    }
}