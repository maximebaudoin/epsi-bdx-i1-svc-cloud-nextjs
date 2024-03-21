import { ObjectId } from "mongodb";
import { useMongoDb } from "../../../hooks/useMongoDb";
import { NextApiRequest, NextApiResponse } from "next";
import { OrmService } from "../../../services/OrmService";
import { MongoConfigService } from "../../../services/MongoConfigService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case "GET":
            return get(req, res);
            break;

        case "PUT":
            return put(req, res);
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

/**
 * @swagger
 *   /api/movie/{idMovie}:
 *     get:
 *       description: Returns a movie based on its ID
 *       parameters:
 *         - in: path
 *           name: idMovie
 *           required: true
 *           type: string
 *           description: ID of query movie
 *       responses:
 *         200:
 *           description: Success
 *         401:
 *           description: Invalid Movie ID
 *         500:
 *           description: Internal Error
 */
async function get(req: NextApiRequest, res: NextApiResponse) {
    try {
        const query = req.query;

        if (!query.idMovie) {
            return res.json({ status: 401, message: "Invalid Movie ID" });
        }

        const movie = await OrmService.connectAndFindOne(MongoConfigService.collections.movies, query.idMovie);

        return res.json({
            status: 200,
            data: movie,
        });
    } catch (e) {
        return res.json({ status: 500, message: "Internal Error" });
    }
}

/**
 * @swagger
 *   /api/movie/{idMovie}:
 *     put:
 *       description: Update a movie
 *       parameters:
 *         - in: path
 *           name: idMovie
 *           required: true
 *           type: string
 *           description: ID of movie
 *       responses:
 *         200:
 *           description: Success
 *         401:
 *           description: Invalid Movie ID
 *         500:
 *           description: Internal Error
 */
async function put(req: NextApiRequest, res: NextApiResponse) {
    try {
        const query = req.query;

        if (!query.idMovie) {
            return res.status(401).json({ status: 401, message: "Invalid Movie ID" });
        }

        const body = req.body;

        const movie = await OrmService.connectAndUpdateOne(MongoConfigService.collections.movies, query.idMovie, {
            "$set": {
                // name: body.name ?? currentComment.name,
                // email: body.email ?? currentComment.email,
                // text: body.text ?? currentComment.text
                plot: "antonin"
            }
        });

        return res.json({ status: 200, movie: movie });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ status: 500, message: "Internal Error" });
    }
}

/**
 * @swagger
 *   /api/movie/{idMovie}:
 *     delete:
 *       description: Delete a movie based on its ID
 *       parameters:
 *         - in: path
 *           name: idMovie
 *           required: true
 *           type: string
 *           description: ID of deleted movie
 *       responses:
 *         200:
 *           description: Success
 *         401:
 *           description: Invalid Movie ID
 *         500:
 *           description: Internal Error
 */
async function _delete(req: NextApiRequest, res: NextApiResponse) {
    try {
        const query = req.query;

        if (!query.idMovie) {
            return res.json({ status: 401, message: "Invalid Movie ID" });
        }

        await OrmService.connectAndDeleteOne(MongoConfigService.collections.movies, query.idMovie);

        return res.json({ status: 200 });
    } catch (e) {
        return res.json({ status: 500, message: "Internal Error" });
    }
}
