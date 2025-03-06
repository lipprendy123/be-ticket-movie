import express from 'express';
import { getCustomers } from '../../controllers/customerController';

const customerRoutes = express.Router()

customerRoutes.get('/customers', getCustomers)

export default customerRoutes