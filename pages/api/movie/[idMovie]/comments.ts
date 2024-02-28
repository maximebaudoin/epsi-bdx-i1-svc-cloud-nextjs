import { ObjectId } from "mongodb";
import { useMongoDb } from "../../../../hooks/useMongoDb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case "GET":
            return get(req, res);
            break;

        case "POST":
            return post(req, res);
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

        if (!query.idMovie) {
            return res.json({ status: 401, message: "Invalid Movie ID" });
        }

        const comments = await db
            .collection("comments")
            .find({ movie_id: new ObjectId(query.idMovie as string) })
            .toArray();

        return res.json({
            status: 200,
            data: comments,
        });
    } catch (e) {
        return res.json({ status: 500, message: "Internal Error" });
    }
}

interface postBodyParams {
    name: string,
    email: string,
    text: string,
}

async function post(req: NextApiRequest, res: NextApiResponse) {
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
            return res
                .status(401)
                .json({ status: 401, message: "Invalid Movie ID" });
        }

        const body: postBodyParams = req.body;

        const comment = await db.collection("comments").insertOne({
            movie_id: new ObjectId(query.idMovie as string),

            name: body.name,
            email: body.email,
            text: body.text,

            date: new Date()
        });

        return res.json({
            status: 200,
            data: comment,
        });
    } catch (e) {
        console.log(e);
        return res.json({ status: 500, message: "Internal Errors" });
    }
}