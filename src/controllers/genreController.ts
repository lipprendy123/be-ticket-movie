import { Request, Response } from "express";
import Genre from "../models/Genre";

export const getGenres = async(req: Request, res: Response) => {
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