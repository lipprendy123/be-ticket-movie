import { Request, Response } from "express";
import Movie from "../models/Movie";
import { movieSchema } from "../utils/zodSchema";
import { title } from "process";

export const getMovies = async(req: Request, res: Response): Promise<any> => {
    try {
        const movies = await Movie.find().populate({path: 'genre', select: 'name'}).populate({path: 'teathers', select: 'name'})

        return res.status(200).json({
            succes: true,
            message: 'Get data success',
            data: movies
        })
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            success: false,
            message: 'failed',
            data: null
        })
    }
}

export const postMovies = async(req: Request, res: Response): Promise<any> => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Image is required',
                data: null
            })
        }

        const parse = movieSchema.safeParse({
            title: req.body.title,
            genre: req.body.genre,
            teathers: req.body.teathers.split(','),
            available: req.body.available === "1" || req.body.available === "true",
            description: req.body.description,
            price: Number.parseInt(req.body.price),
            bonus: req.body?.bonus
        })

        console.log(req.body);
        

        if (!parse.success) {
            const errorMessages = parse.error.issues.map((err) => err.message)

            return res.status(400).json({
                message: 'Invalid request',
                details: errorMessages,
                status: 'failed'
            })
        }

        const movie = new Movie({
            title: parse.data.title,
            genre: parse.data.genre,
            available: parse.data.available,
            teathers: parse.data.teathers,
            thumbnail: req.file?.filename,
            description: parse.data.description,
            price: parse.data.price,
            bonus: parse.data.bonus
        })

        await movie.save()

        return res.status(201).json({
            success: true,
            message: 'Create data success',
            data: movie
        })

    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            success: false,
            message: 'failed to create data',
            data: null
        })
    }
}