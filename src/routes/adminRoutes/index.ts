import express from 'express'
import genreRoutes from './genreRoutes'
import teatherRoutes from './teatherRoutes'
import movieRoutes from './movieRoutes'

const adminRoutes = express.Router()

adminRoutes.use(genreRoutes)
adminRoutes.use(teatherRoutes)
adminRoutes.use(movieRoutes)

export default adminRoutes