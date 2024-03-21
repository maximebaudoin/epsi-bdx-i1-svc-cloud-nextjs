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
 *       tags:
 *         - Movies
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
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *         500:
 *           description: Internal Error
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
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
        console.log(e);
        return res.status(500).json({ status: 500, message: "Internal Error" });
    }
}

interface putBodyParams {
    title?: string;
    plot?: string;
    genres?: string[],
    runtime?: {
        [key: string]: string
    };
    cast?: string[];
    poster?: string;
    fullplot?: string;
    languages?: string[];
    released?: {
        [key:string]: {
            [key:string]: string
        }
    };
    directors?: string[];
    rated?: string;
    awards?: {
        [key:string]: {
            [key:string]: string
        } | string[]
    };
    lastupdated?: string;
    year?: {
        [key:string]: string
    };
    imdb?: {
        [key:string]: {
            [key:string]: string
        }
    };
    countries?: string[];
    type?: string;
    tomatoes?: {
        [key:string]: {
            [key:string]: {
                [key:string]: string
            }
        }
    };
    rotten?: {
        [key:string]: string
    };
    lastUpdated?: {
        [key:string]: {
            [key:string]: string
        }
    };
    num_mflix_comments?: {
        [key:string]: string
    }
}

/**
 * @swagger
 *   /api/movie/{idMovie}:
 *     put:
 *       tags:
 *         - Movies
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
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *         500:
 *           description: Internal Error
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 */
async function put(req: NextApiRequest, res: NextApiResponse) {
    try {
        const query = req.query;

        if (!query.idMovie) {
            return res.status(401).json({ status: 401, message: "Invalid Movie ID" });
        }

        const currentMovie = await OrmService.connectAndFindOne(MongoConfigService.collections.movies, query.idMovie);

        if (!currentMovie) {
            return res.status(401).json({ status: 401, message: "Unknown Movie" });
        }

        const body: putBodyParams = req.body;

        const updatedMovie = Object.keys(currentMovie).reduce((acc, key) => {
            acc[key] = body[key] ?? currentMovie[key];
            return acc;
        }, {});

        delete(updatedMovie._id);
        
        const movie = await OrmService.connectAndUpdateOne(MongoConfigService.collections.movies, query.idMovie, {
            "$set": updatedMovie
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
 *       tags:
 *         - Movies
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
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *         500:
 *           description: Internal Error
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
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
        console.log(e);
        return res.status(500).json({ status: 500, message: "Internal Error" });
    }
}
