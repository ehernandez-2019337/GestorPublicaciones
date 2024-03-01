'use strict'

import User from '../user/user.model.js'
import Publication from '../publication/publication.model.js'
import Comment from './comment.model.js'

export const test = (req, res) => {
    console.log('test is running')
    return res.send({ message: 'Test is running' })
}

export const save = async(req,res)=>{
    try{
        let data = req.body
        data.user = req.user._id

        let comment = new Comment(data) 
        await comment.save()

        return res.send({message: 'comment saved successfully'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message:'error saving comment'})
    }
}


export const update = async (req, res) => {
    try {
        let { id } = req.params
        let data = req.body
        let idU = req.user.id
        console.log(idU)

        let comment = await Comment.findOne({ _id: id, user: idU })
        if (!comment) {
            return res.status(404).send({ message: 'comment not found or you do not have acces' })
        }

        // Actualizar
        await Comment.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )  

        return res.send({ message: 'comment updated successfully', comment })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'error updating comment' })
    }
}

export const deleteComment = async (req, res) => {
    try {
        let { id } = req.params
        //user logueado
        let idU = req.user.id

        let comment = await Comment.findOne({ _id: id, user: idU })
        if (!comment) {
            return res.status(404).send({ message: 'publicacion not found or you do not have acces' })
        }

        // Eliminar 
        let deleteComment = await Comment.deleteOne({ _id: id })
        //verificar que se eliminó
        if (deleteComment.deletedCount === 0) return res.status(404).send({ message: 'Comment not found and not deleted' })
        //Responder        
        return res.send({ message: 'Comment deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'error deleting Comment' });
    }
};