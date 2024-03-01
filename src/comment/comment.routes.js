import express from 'express'
import { validateJwt } from '../middlewares/validate-jwt.js';
import {  test,
          save,
          update,
          deleteComment
} from './comment.controller.js';


const api = express.Router();

api.get('/test', test)
api.post('/save',[validateJwt],save)
api.put('/update/:id',[validateJwt],update)
api.delete('/delete/:id',[validateJwt],deleteComment)

export default api