import { ObjectId } from "mongodb";
import { useMongoDb } from "../../../hooks/useMongoDb";
import { NextApiRequest, NextApiResponse } from "next";
import { OrmService } from "../../services/OrmService";
import { MongoConfigService } from "../../services/MongoConfigService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case "GET":
            return get(req, res);
            break;

        case "PUT": // TODO
            // return put(req, res);
            break;

        case "DELETE":
            return _delete(req, res);
            break;

        default:
            return res.status(400).json({ status: 400, messages: "Bad Request" });
    }
}

interface getParams {
    idMovie: string
}

async function get(req: NextApiRequest, res: NextApiResponse) {
    try {
        const query = req.query;

        if (!query.idMovie) {
            return res.json({ status: 401, message: "Invalid Movie ID" });
        }

        const movie = await OrmService.

        // const movie = await db
        //     .collection("movies")
        //     .findOne({ _id: new ObjectId(query.idMovie as string) });

        return res.json({
            status: 200,
            data: movie,
        });
    } catch (e) {
        return res.json({ status: 500, message: "Internal Error" });
    }
}

async function _delete(req: NextApiRequest, res: NextApiResponse) {
    try {
        const db = await useMongoDb();

        if (!db) {
            return res.json({
                status: 500,
                message: "Impossible de se connecter à la base de données",
            });
        }

        const query = req.query;

        if (!query.idMovie) {
            return res.json({ status: 401, message: "Invalid Movie ID" });
        }

        const deletedMovie = db
            .collection("movies")
            .deleteOne(new ObjectId(query.idMovie as string));

        if (!deletedMovie) {
            return res
                .status(500)
                .json({ status: 500, message: "Error when deleting movie" });
        }

        return res.json({ status: 200 });
    } catch (e) {
        return res.json({ status: 500, message: "Internal Error" });
    }
}
