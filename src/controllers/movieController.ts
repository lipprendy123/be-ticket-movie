import { Request, Response } from "express";
import Movie from "../models/Movie";
import { movieSchema } from "../utils/zodSchema";
import { title } from "process";
import path from "path";
import fs from 'fs'
import Genre from "../models/Genre";
import Teather from "../models/Teather";

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

export const getMoviesDetail = async(req: Request, res: Response): Promise<any> => {
    try {
        const {id} = req.params;

        const movie = await Movie.findById(id).populate({path: 'genre', select: 'name'}).populate({path: 'teathers', select: 'name'})

        return res.status(200).json({
            succes: true,
            message: 'Get data success',
            data: movie
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

export const putMovie = async(req: Request, res: Response): Promise<any> => {
    try {
        const {id} = req.params;

         const parse = movieSchema.safeParse({
            title: req.body.title,
            genre: req.body.genre,
            teathers: req.body.teathers.split(','),
            available: req.body.available === "1" || req.body.available === "true",
            description: req.body.description,
            price: Number.parseInt(req.body.price),
            bonus: req.body?.bonus
        })
        

        if (!parse.success) {
            const errorMessages = parse.error.issues.map((err) => err.message)

            return res.status(400).json({
                message: 'Invalid request',
                details: errorMessages,
                status: 'failed'
            })
        }

        const oldMovie = await Movie.findById(id)

        if (!oldMovie) {
            return res.status(400).json({
                success: false,
                message: 'Data movie not found',
                data: null
            })
        }

        if (req.file) {
            const dirname = path.resolve()
            const filepath = path.join(
                dirname,
                "public/uploads/thumbnails",
                oldMovie.thumbnail
            )

            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath)
            }
        }

        await Genre.findByIdAndUpdate(oldMovie.genre, {
            $pull: {
                movies: oldMovie._id
            }
        })

        for(const teather of oldMovie.teathers) {
            await Teather.findByIdAndUpdate(teather._id, {
                $pull: {
                    movies: oldMovie._id
                }
            })
        }        

        await Movie.findByIdAndUpdate(oldMovie._id, {
            title: parse.data.title,
            genre: parse.data.genre,
            available: parse.data.available,
            teathers: parse.data.teathers,
            thumbnail: req?.file ? req.file.filename : oldMovie.thumbnail,
            description: parse.data.description,
            price: parse.data.price,
            bonus: parse.data.bonus
        })

        await Genre.findByIdAndUpdate(parse.data.genre, {
            $push: {
                movies: oldMovie._id
            }
        })

        for(const teather of parse.data.teathers) {
            await Teather.findByIdAndUpdate(teather, {
                $push: {
                    movies: id
                }
            })
        }        

        const updateMovie = await Movie.findById(id)

        return res.status(200).json({
            success: true,
            message: 'Update data success',
            data: updateMovie
        })


    } catch (error) {
         console.log(error);
        
        return res.status(500).json({
            success: false,
            message: 'failed to update data',
            data: null
        })
    }
}

export const deleteMovie = async(req: Request, res: Response): Promise<any> => {
    try {
        const {id} = req.params;

        const movie = await Movie.findById(id)

        if (!movie) {
            return res.status(400).json({
                success: false,
                message: 'Movie not found',
                data: null
            })
        }

        const dirname = path.resolve()
            const filepath = path.join(
                dirname,
                "public/uploads/thumbnails",
                movie.thumbnail
            )

            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath)
            }

            await Genre.findByIdAndUpdate(movie.genre, {
                        $pull: {
                            movies: movie._id
                        }
                    })
            
                    for(const teather of movie.teathers) {
                        await Teather.findByIdAndUpdate(teather._id, {
                            $pull: {
                                movies: teather._id
                            }
                        })
                    }

            await Movie.findByIdAndDelete(id)

            return res.status(200).json({
                success: true,
                message: 'Delete movie success',
                data: movie
            })

    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            success: false,
            message: 'failed to delete data',
            data: null
        })
    }
}