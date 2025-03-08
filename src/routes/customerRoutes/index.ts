import express from 'express';
import globalRoutes from './globalRoutes';
import { verifyRole, verifyToken } from '../../middlewares/veirifyToken';

const customerRoutes = express.Router()

customerRoutes.use(verifyToken)
customerRoutes.use(verifyRole('customer') as express.RequestHandler)
customerRoutes.use(globalRoutes)

export default customerRoutes