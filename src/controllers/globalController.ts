import { Request, Response } from "express";
import Movie from "../models/Movie";
import Genre from "../models/Genre";
import Transaction from "../models/Transaction";
import Teather from "../models/Teather";

export const getMovies = async(req: Request, res: Response): Promise<any> => {
    try {
        const data = await Movie.find().select('title thumbnail').populate({
            path: 'genre',
            select: 'name -_id'
        }).limit(3)

        return res.status(200).json({
            success: true,
            message: 'Get data success',
            data: data
        })
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            success: false,
            message: 'Failed to get data',
            data: null
        })
    }
}

export const getGenres = async(req: Request, res: Response): Promise<any> => {
    try {
        const data = await Genre.find().select('name')

        return res.status(200).json({
            success: true,
            message: 'Get data genre success',
            data: data
        })
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            success: false,
            message: 'Get data failed',
            data: null
        })
    }
}

export const getDetailMovie = async(req: Request, res: Response): Promise<any> => {
    try {
        const {id} = req.params;

        const seats = []

        for (let i = 0; i < 5; i++) {
            seats.push({
                seat: `A${i + 1}`,
                isBooked: false
            })
        }

        for (let i = 0; i < 5; i++) {
            seats.push({
                seat: `B${i + 1}`,
                isBooked: false
            })
        }

        for (let i = 0; i < 5; i++) {
            seats.push({
                seat: `C${i + 1}`,
                isBooked: false
            })
        }

        const movie = await Movie.findById(id).populate({
            path: 'teathers',
            select: 'name city'
        }).populate({
            path: 'genre',
            select: 'name -_id'
        })

        return res.status(200).json({
            success: true,
            message: 'Get data success',
            data: {
                ...movie?.toJSON(),
                seats,
                time: ['10:30', '12:00', '14:30', '16:40', '19:00']
            }
        })
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            success: false,
            message: 'Get data failed',
            data: null
        })
    }
}

export const getAvailableSeats = async(req: Request, res: Response): Promise<any> => {
    try {
        const {movieId} = req.params;
        const {date} = req.query;

        const transactions = await Transaction.find({
            date: date?.toString().replace("+", " "),
            movie: movieId
        }).select({
            path: 'seats',
            select: 'seat'
        })

        const seats = []

        for (const seat of transactions) {
            seats.push(...seat.seats)
        }

        return res.status(200).json({
            success: true,
            message: 'Get data success',
            data: seats
        })
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            success: false,
            message: 'Get data failed',
            data: null
        })
    }
}

export const getMoviesFilter = async(req: Request, res: Response): Promise<any> => {
    try {
        const {genreId} = req.params;
        const {city, teathers, availbility} = req.query;

        let filterQuery: any = {}

        if (genreId) {
            filterQuery = {
                ...filterQuery,
                genre: genreId
            }
        }

        if (city) {
            const teathers_list = await Teather.find({
                city: city
            })

            const teatherIds = teathers_list.map((the) => the.id)

            filterQuery = {
                ...filterQuery,
                teathers: {
                    $in: [...teatherIds]
                }
            }
        }

        if (teathers) {
            const teatherIds2 = teathers as string[]

            filterQuery = {
                ...filterQuery,
                teathers: {
                    $in: [...(filterQuery?.teathers.$in ?? []), teatherIds2]
                }
            }
        }

        if (availbility === 'true') {
            filterQuery = {
                ...filterQuery,
                available: true
            }
        }

        const data = await Movie.find({
            ...filterQuery
        }).select('title genre thumbnail').populate({
            path: 'genre',
            select: 'name'
        })

        const allData = await Movie.find().select('title genre teathers thumbnail').populate({
            path: 'genre',
            select: 'name'
        }).populate({
            path: 'teathers',
            select: 'city'
        })


        return res.status(200).json({
            success: true,
            message: 'Success get data',
            data: {
                filterMovies: data,
                allMovies: allData
            }
        })

    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            success: false,
            message: 'Get data failed',
            data: null
        })
    }
}