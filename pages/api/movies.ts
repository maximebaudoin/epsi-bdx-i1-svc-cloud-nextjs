import { NextApiRequest, NextApiResponse } from "next";
import { useMongoDb } from "../../hooks/useMongoDb";
import { OrmService } from "../../services/OrmService";
import { MongoConfigService } from "../../services/MongoConfigService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case "POST": // TODO
            // return post(req, res);
            break;

        case "GET":
            return get(req, res);
            break;

        default:
            return res.status(400).json({ status: 400, messages: "Bad Request" });
    }
}

/**
 * @swagger
 *   /api/movies:
 *     get:
 *       description: Returns movies
 *       responses:
 *         200:
 *           description: Hello Movies
 *         500:
 *           description: Internal Error
 */
async function get(req: NextApiRequest, res: NextApiResponse) {
    try {
        const movies = await OrmService.connectAndFind(MongoConfigService.collections.movies);

        return res.json({
            status: 200,
            data: movies,
        });
    } catch (e) {
        return res.status(500).json({ status: 500, message: "Internal Error" });
    }
}

// interface postBodyParams {
//     title: string;
//     plot: string;
//     genres: string[],
//     runtime: {
//         [key: string]: string
//     };
//     cast: string[];
//     poster: string;
//     fullplot: string;
//     languages: string[];
//     released: {
//         [key:string]: {
//             [key:string]: string
//         }
//     };
//     directors: string[];
//     rated: string;
//     awards: {
//         [key:string]: {
//             [key:string]: string
//         } | string[]
//     };
//     lastupdated: string;
//     year: {
//         [key:string]: string
//     };
//     imdb: {
//         [key:string]: {
//             [key:string]: string
//         }
//     };
//     countries: string[];
//     type: string;
//     tomatoes: {
//         [key:string]: {
//             [key:string]: {
//                 [key:string]: string
//             }
//         }
//     };
//     rotten: {
//         [key:string]: string
//     }
//     lastUpdated: {
//         [key:string]: {
//             [key:string]: string
//         }
//     };
//     num_mflix_comments: {
//         [key:string]: string
//     }
// }

// async function post(req: NextApiRequest, res: NextApiResponse) {
//     try {
//         const body = await req.json();

//         if (!body.title) {
//             return res
//                 .status(401)
//                 .json({ status: 401, message: "Empty title param" });
//         }
//     } catch (e) {
//         return res.status(500).json({ status: 500, message: "Internal Error" });
//     }
// }
