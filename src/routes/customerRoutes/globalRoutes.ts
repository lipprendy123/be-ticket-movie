import express from 'express';
import { getAvailableSeats, getDetailMovie, getGenres, getMovies, getMoviesFilter } from '../../controllers/globalController';

const globalRoutes = express.Router()

globalRoutes.get('/movies', getMovies)
globalRoutes.get('/genres', getGenres)
globalRoutes.get('/movies/:id', getDetailMovie)
globalRoutes.get('/check-seats/movieId', getAvailableSeats)
globalRoutes.get('/browse-movies/:genreId', getMoviesFilter)

export default globalRoutes