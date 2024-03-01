'use strict'

import Publication from './publication.model.js';
import User from '../user/user.model.js'
import { checkUpdate } from '../utils/validator.js'


export const test = (req, res) => {
    console.log('test is running')
    return res.send({ message: 'Test is running' })
}

export const create = async(req,res)=>{
    try{

        let data = req.body;
        data.user = req.user._id

        //crear publicacion con el user logueado
        let publication = new Publication(data)

        await publication.save()
        return res.send({message: 'publication created succesfully'})

    }catch(err){
        console.error(err)
        return res.status(500).send({message:'error creating publication '})
    }
}

export const update = async (req, res) => {
    try {
        let { id } = req.params
        let data = req.body
        //user logueado
        let idU = req.user.id

        // validar que la publicacion exista y sea del user
        let publi = await Publication.findOne({ _id: id, user: idU })
        if (!publi) {
            return res.status(404).send({ message: 'publicacion not found or you do not have acces' })
        }

        // Actualizar
        await Publication.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )  

        return res.send({ message: 'publicacion updated successfully', publi })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'error updating publication' })
    }
}


export const deletePubli = async (req, res) => {
    try {
        let { id } = req.params
        //user logueado
        let idU = req.user.id

        // validar que la publicacion exista y sea del user
        let publi = await Publication.findOne({ _id: id, user: idU })
        if (!publi) {
            return res.status(404).send({ message: 'publicacion not found or you do not have acces' })
        }

        // Eliminar 
        let deletePubli = await Publication.deleteOne({ _id: id })
        //verificar que se eliminó
        if (deletePubli.deletedCount === 0) return res.status(404).send({ message: 'publication not found and not deleted' })
        //Responder        
        return res.send({ message: 'publication deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'error deleting publication' });
    }
};

export const get = async(req,res)=>{
    try{
        let publications = await Publication.find().populate('user',['name'])
        return res.send({message:'publications found', publications})
    }catch(err){
        console.error(err)
        return res.status.send({emessage:'error getting publication'})
    }
}
