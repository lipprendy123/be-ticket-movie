import express from 'express';
import { getAvailableSeats, getDetailMovie, getGenres, getMovies } from '../../controllers/globalController';

const globalRoutes = express.Router()

globalRoutes.get('/movies', getMovies)
globalRoutes.get('/genres', getGenres)
globalRoutes.get('/movies/:id', getDetailMovie)
globalRoutes.get('/check-seats/movieId', getAvailableSeats)

export default globalRoutes