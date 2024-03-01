
import express from 'express'

import {
    test,
    register,
    login, 
    update,
    updatePassword
} from './user.controller.js';

import { validateJwt } from '../middlewares/validate-jwt.js';


const api = express.Router();

api.post('/register', register)
api.post('/login', login)
api.put('/update/:id', update)
api.put('/updatePassword/:id',[validateJwt], updatePassword)
api.get('/test',  test)



export default api