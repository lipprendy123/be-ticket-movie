import express from 'express'
import genreRoutes from './genreRoutes'
import teatherRoutes from './teatherRoutes'
import movieRoutes from './movieRoutes'
import customerRoutes from './customerRoutes'
import { verifyRole, verifyToken } from '../../middlewares/veirifyToken'

const adminRoutes = express.Router()

adminRoutes.use(verifyToken)
adminRoutes.use(verifyRole('admin') as express.RequestHandler )
adminRoutes.use(genreRoutes)
adminRoutes.use(teatherRoutes)
adminRoutes.use(movieRoutes)
adminRoutes.use(customerRoutes)

export default adminRoutes