import { NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";

export default async function handler(req: Request, res: Response) {

    switch (req.method) {
        case 'POST':
            return post(req, res);
            break;

        case 'GET':
            return get(req, res);
            break;
    }
}

async function get(req: Request, res: Response) {
    try {
        const client = await clientPromise;
        const db = client.db("sample_mflix");
        const movies = await db.collection("movies").find({}).limit(10).toArray();

        return NextResponse.json({
            status: 200,
            data: movies
        });
    } catch(e) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}

interface postBodyParams {
    title: string;
    plot: string;
    genres: string[],
    runtime: {
        [key: string]: string
    };
    cast: string[];
    poster: string;
    fullplot: string;
    languages: string[];
    released: {
        [key:string]: {
            [key:string]: string
        }
    };
    directors: string[];
    rated: string;
    awards: {
        [key:string]: {
            [key:string]: string
        } | string[]
    };
    lastupdated: string;
    year: {
        [key:string]: string
    };
    imdb: {
        [key:string]: {
            [key:string]: string
        }
    };
    countries: string[];
    type: string;
    tomatoes: {
        [key:string]: {
            [key:string]: {
                [key:string]: string
            }
        }
    };
    rotten: {
        [key:string]: string
    }
    lastUpdated: {
        [key:string]: {
            [key:string]: string
        }
    };
    num_mflix_comments: {
        [key:string]: string
    }
}

async function post(req: Request, res: Response) {
    try {
        const body: postBodyParams = await req.json();

        if (!body.title) {
            return new NextResponse("Empty title param", { status: 401 });
        }
    } catch(e) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}