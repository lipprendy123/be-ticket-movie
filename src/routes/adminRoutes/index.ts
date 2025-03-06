import express from 'express'
import genreRoutes from './genreRoutes'
import teatherRoutes from './teatherRoutes'
import movieRoutes from './movieRoutes'
import customerRoutes from './customerRoutes'

const adminRoutes = express.Router()

adminRoutes.use(genreRoutes)
adminRoutes.use(teatherRoutes)
adminRoutes.use(movieRoutes)
adminRoutes.use(customerRoutes)

export default adminRoutes