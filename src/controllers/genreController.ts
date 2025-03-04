import { Request, Response } from "express";
import Genre from "../models/Genre";
import { genreSchema } from "../utils/zodSchema";

export const getGenres = async(req: Request, res: Response): Promise<any> => {
    try {
        const genres = await Genre.find()

        return res.status(200).json({
            succes: true,
            message: 'Get data genres success',
            data: genres
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

export const getGenreDetail = async(req: Request, res: Response): Promise<any> => {
    try {
        const {id} = req.params;

        const genre = await Genre.findById(id)

        return res.status(200).json({
            succes: true,
            message: 'Get data genre by id success',
            data: genre
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

export const postGenre = async(req: Request, res: Response): Promise<any> => {
    try {
        const body = genreSchema.parse(req.body)

        const genre = new Genre({
            name: body.name
        })

        const newData = await genre.save()

        return res.status(201).json({
            succes: true,
            message: 'Success create data',
            data: newData
        })
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            success: false,
            message: 'failed create data',
            data: null
        })
    }
}

export const putGenre = async(req: Request, res: Response): Promise<any> => {
    try {
        const {id} = req.params;

        const body = genreSchema.parse(req.body)

        await Genre.findByIdAndUpdate(id, {
            name: body.name
        })

        const updatedGenre = await Genre.findById(id)

        return res.status(200).json({
            succes: true,
            message: 'Success update data',
            data: updatedGenre
        })
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            success: false,
            message: 'failed update data',
            data: null
        })
    }
}

export const deleteGenre = async(req: Request, res: Response): Promise<any> => {
    try {
        const {id} = req.params;

        const deletedGenre = await Genre.findById(id)

        await Genre.findByIdAndDelete(id)

        return res.status(200).json({
            succes: true,
            message: 'Success delete data',
            data: deletedGenre
        })
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            success: false,
            message: 'failed delete data',
            data: null
        })
    }
}