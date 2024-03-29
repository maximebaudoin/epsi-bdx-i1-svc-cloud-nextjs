import { NextApiRequest, NextApiResponse } from "next";
import { OrmService } from "../../../../../services/OrmService";
import { MongoConfigService } from "../../../../../services/MongoConfigService";

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

/**
 * @swagger
 *   /api/movie/{idMovie}/comment/{idComment}:
 *     get:
 *       tags:
 *         - Comments
 *       description: Returns a comment of one movie bases on the comment ID
 *       parameters:
 *         - in: path
 *           name: idMovie
 *           required: true
 *           type: string
 *           description: ID of movie
 *         - in: path
 *           name: idComment
 *           required: true
 *           type: string
 *           description: ID of query comment
 *       responses:
 *         200:
 *           description: Success
 *         401:
 *           description: Invalid Movie ID or Comment ID
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

        if (!query.idComment) {
            return res.status(401).json({ status: 401, message: "Invalid Comment ID" });
        }

        if (!query.idMovie) {
            return res.status(401).json({ status: 401, message: "Invalid Movie ID" });
        }

        const comment = await OrmService.connectAndFindOne(MongoConfigService.collections.comments, query.idComment);

        return res.json({
            status: 200,
            data: comment,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ status: 500, message: "Internal Error" });
    }
}

interface putBodyParams {
    name?: string;
    email?: string;
    text?: string;
}

/**
 * @swagger
 *   /api/movie/{idMovie}/comment/{idComment}:
 *     put:
 *       tags:
 *         - Comments
 *       description: Update a comment
 *       parameters:
 *         - in: path
 *           name: idMovie
 *           required: true
 *           type: string
 *           description: ID of movie
 *         - in: path
 *           name: idComment
 *           required: true
 *           type: string
 *           description: ID of comment
 *       requestBody:
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 text:
 *                   type: string
 *       responses:
 *         200:
 *           description: Success
 *         401:
 *           description: Invalid Movie ID or Comment ID
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
        const query: { idMovie: string, idComment: string } = req.query;

        if (!query.idMovie) {
            return res.status(401).json({ status: 401, message: "Invalid Movie ID" });
        }

        if (!query.idComment) {
            return res.status(401).json({ status: 401, message: "Invalid Comment ID" });
        }

        const currentComment = await OrmService.connectAndFindOne(MongoConfigService.collections.comments, query.idComment);

        if (!currentComment) {
            return res.status(401).json({ status: 401, message: "Unknown Comment" });
        }

        const body: putBodyParams = req.body;

        const comment = await OrmService.connectAndUpdateOne(MongoConfigService.collections.comments, query.idComment, {
            "$set": {
                name: body.name ?? currentComment.name,
                email: body.email ?? currentComment.email,
                text: body.text ?? currentComment.text
            }
        });

        return res.json({ status: 200, comment: comment });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ status: 500, message: "Internal Error" });
    }
}

/**
 * @swagger
 *   /api/movie/{idMovie}/comment/{idComment}:
 *     delete:
 *       tags:
 *         - Comments
 *       description: Delete a movie based on its ID
 *       parameters:
 *         - in: path
 *           name: idMovie
 *           required: true
 *           type: string
 *           description: ID of movie
 *         - in: path
 *           name: idComment
 *           required: true
 *           type: string
 *           description: ID of deleted comment
 *       responses:
 *         200:
 *           description: Success
 *         401:
 *           description: Invalid Movie ID or Comment ID
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
            return res.status(401).json({ status: 401, message: "Invalid Movie ID" });
        }

        if (!query.idComment) {
            return res.status(401).json({ status: 401, message: "Invalid Comment ID" });
        }

        const comment = await OrmService.connectAndDeleteOne(MongoConfigService.collections.comments, query.idComment);

        return res.json({ status: 200, data: comment });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ status: 500, message: "Internal Error" });
    }
}
