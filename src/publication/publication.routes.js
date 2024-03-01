import express from 'express'
import {  test, 
        create,
        update,
        deletePubli,
        get
} 
from './publication.controller.js';
import { validateJwt } from '../middlewares/validate-jwt.js';


const api = express.Router();


api.get('/test', test)
api.post('/create',[validateJwt], create)
api.put('/update/:id',[validateJwt],update)
api.delete('/delete/:id',[validateJwt],deletePubli)
api.get('/get',get)


export default api