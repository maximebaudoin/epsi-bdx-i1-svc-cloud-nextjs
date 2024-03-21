import { useMongoDb } from "../hooks/useMongoDb";
import { Filter, ObjectId, OptionalId, UpdateFilter } from "mongodb";

export const OrmService = {
    connectAndFind: async (collectionName: string) => {
        const db = await useMongoDb();
        return await db.collection(collectionName).find({}).limit(10).toArray();
    },
    connectAndFindBy: async (collectionName: string, filterByName: string, filterByValue: any) => {
        const db = await useMongoDb();
        return await db.collection(collectionName).find({ [filterByName]: filterByValue }).limit(10).toArray();
    },
    connectAndFindOne: async (dbName: string, idObjectToFind: string) => {
        const db = await useMongoDb();
        return await db.collection(dbName).findOne({ _id: new ObjectId(idObjectToFind) });
    },
    connectAndDeleteOne: async (dbName: string, idObjectToDelete: string) => {
        const db = await useMongoDb();
        return await db.collection(dbName).deleteOne({ _id: new ObjectId(idObjectToDelete) });
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