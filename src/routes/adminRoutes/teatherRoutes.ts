import  express  from "express";

import { validateRequest } from "../../middlewares/validateRequest";
import { deleteTeather, getTeather, getTeatherDetail, postTeather, putTeather } from "../../controllers/teatherController";
import { teatherSchema } from "../../utils/zodSchema";


const teatherRoutes = express.Router()

teatherRoutes.get('/teathers', getTeather)
teatherRoutes.get('/teathers/:id', getTeatherDetail)
teatherRoutes.post('/teathers', validateRequest(teatherSchema) , postTeather)
teatherRoutes.put('/teathers/:id', validateRequest(teatherSchema) , putTeather)
teatherRoutes.delete('/teathers/:id', deleteTeather)

export default teatherRoutes