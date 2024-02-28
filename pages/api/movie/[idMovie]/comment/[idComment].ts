import { ObjectId } from "mongodb";
import { useMongoDb } from "../../../../../hooks/useMongoDb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case "GET":
            return get(req, res);
            break;

        case "PUT": // TODO
            return put(req, res);
            break;

        case "DELETE":
            return _delete(req, res);
            break;

        default:
            return res.status(400).json({ status: 400, messages: "Bad Request" });
    }
}

async function get(req: NextApiRequest, res: NextApiResponse) {
    try {
        const db = await useMongoDb();

        if (!db) {
            return res.json({
                status: 500,
                message: "Impossible de se connecter à la base de données",
            });
        }

        const query = req.query;

        if (!query.idComment) {
            return res.status(401).json({ status: 401, message: "Invalid Comment ID" });
        }

        if (!query.idMovie) {
            return res.status(401).json({ status: 401, message: "Invalid Movie ID" });
        }

        const comment = await db
            .collection("comments")
            .findOne({
                _id: new ObjectId(query.idComment as string),
                movie_id: new ObjectId(query.idMovie as string)
            });

        return res.json({
            status: 200,
            data: comment,
        });
    } catch (e) {
        return res.json({ status: 500, message: "Internal Error" });
    }
}

interface putBodyParams {
    name?: string;
    email?: string;
    text?: string;
}

async function put(req: NextApiRequest, res: NextApiResponse) {
    try {
        const db = await useMongoDb();

        if (!db) {
            return res.status(500).json({
                status: 500,
                message: "Impossible de se connecter à la base de données",
            });
        }

        const query = req.query;

        if (!query.idMovie) {
            return res.status(401).json({ status: 401, message: "Invalid Movie ID" });
        }

        if (!query.idComment) {
            return res.status(401).json({ status: 401, message: "Invalid Comment ID" });
        }

        const currentComment = await db.collection("comments").findOne({
            _id: new ObjectId(query.idComment as string),
            movie_id: new ObjectId(query.idMovie as string)
        });

        if (!currentComment) {
            return res.status(401).json({ status: 401, message: "Unknown Comment" });
        }

        const body: putBodyParams = req.body;



        const comment = await db
            .collection("comments")
            .updateOne({
                _id: new ObjectId(query.idComment as string),
                movie_id: new ObjectId(query.idMovie as string)
            }, {
                "$set": {
                    name: body.name ?? currentComment.name,
                    email: body.email ?? currentComment.email,
                    text: body.text ?? currentComment.text
                }
            });

        if (!comment) {
            return res
                .status(500)
                .json({ status: 500, message: "Error when updating comment" });
        }

        return res.json({ status: 200, comment: comment });
    } catch (e) {
        console.log(e);

        return res.status(500).json({ status: 500, message: "Internal Error" });
    }
}


async function _delete(req: NextApiRequest, res: NextApiResponse) {
    try {
        const db = await useMongoDb();

        if (!db) {
            return res.status(500).json({
                status: 500,
                message: "Impossible de se connecter à la base de données",
            });
        }

        const query = req.query;

        if (!query.idMovie) {
            return res.status(401).json({ status: 401, message: "Invalid Movie ID" });
        }

        if (!query.idComment) {
            return res.status(401).json({ status: 401, message: "Invalid Comment ID" });
        }

        const deletedComment = db
            .collection("comment")
            .deleteOne({ _id: new ObjectId(query.idComment as string), movie_id: new ObjectId(query.idMovie as string) });

        if (!deletedComment) {
            return res
                .status(500)
                .json({ status: 500, message: "Error when deleting comment" });
        }

        return res.json({ status: 200 });
    } catch (e) {
        return res.json({ status: 500, message: "Internal Error" });
    }
}
