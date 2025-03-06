import express from 'express'
import multer from 'multer'
import { deleteMovie, getMovies, getMoviesDetail, postMovies, putMovie } from '../../controllers/movieController'
import { imageFilter, thumbnailStorage } from '../../utils/multer'

const upload = multer({storage: thumbnailStorage(), fileFilter: imageFilter})

const movieRoutes = express.Router()

movieRoutes.get('/movies', getMovies)
movieRoutes.get('/movies/:id', getMoviesDetail)
movieRoutes.post('/movies', upload.single('thumbnail'), postMovies)
movieRoutes.put('/movies/:id', upload.single('thumbnail'), putMovie)
movieRoutes.delete('/movies/:id', deleteMovie)

export default movieRoutes