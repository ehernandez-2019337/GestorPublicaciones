'use strict' //Modo estricto

import User from './user.model.js'
import {    encrypt, 
            checkPassword, 
            checkUpdate 
        } from '../utils/validator.js'
import { generateJwt } from '../utils/jwt.js'

export const test = (req, res)=>{
    console.log('test is running')
    return res.send({message: 'Test is running'})
}

export const register = async(req, res)=>{
    try{
        //Capturar el formulario (body)
        let data = req.body
        //Encriptar la contraseña
        data.password = await encrypt(data.password)
        //Guardar la información en la BD
        let user = new User(data)
        await user.save() //Guardar en la BD
        //Responder al usuario
        return res.send({message: `Registered successfully, can be logged with username ${user.username}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error registering user', err: err})
    }
}

export const login = async(req, res)=>{
    try{
        //Capturar los datos (body)
        let data = req.body
        //Validar que el usuario exista
        let user = await User.findOne({$or: [{email: data.user},{username: data.user}]}) //buscar un solo registro
        //Verifico que la contraseña coincida
        if(user && await checkPassword(data.password, user.password)){
            let loggedUser = {
                uid: user._id,
                username: user.username,
                name: user.name,
                role: user.role
            }
            //Generar el Token
            let token = await generateJwt(loggedUser)
            //Respondo al usuario
            return res.send(
                {
                    message: `Welcome ${loggedUser.name}`, 
                    loggedUser,
                    token
                }
            )
        }
        return res.status(404).send({message: 'Invalid credentials'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to login'})
    }
}

export const update = async(req, res)=>{ //Datos generales (No password)
    try{
        //Obtener el id del usuario a actualizar
        let { id } = req.params
        //Obtener los datos a actualizar
        let data = req.body
        //Validar si data trae datos
        let update = checkUpdate(data, id)
        if(!update) return res.status(400).send({message: 'Have submitted some data that cannot be updated or missing data'})
        //Validar si tiene permisos (tokenización) X Hoy No lo vemos X
        //Actualizar (BD)
        let updatedUser = await User.findOneAndUpdate(
            {_id: id}, //ObjectsId <- hexadecimales (Hora sys, Version Mongo, Llave privada...)
            data, //Los datos que se van a actualizar
            {new: true} //Objeto de la BD ya actualizado
        )
        //Validar la actualización
        if(!updatedUser) return res.status(401).send({message: 'User not found and not updated'})
        //Respondo al usuario
        return res.send({message: 'Updated user', updatedUser})
    }catch(err){
        console.error(err)
        if(err.keyValue.username) return res.status(400).send({message: `Username ${err.keyValue.username} is alredy taken`})
        return res.status(500).send({message: 'Error updating account'})
    }
}

export const updatePassword = async(req,res)=>{
    try{
        let {id} = req.params
        let data = req.body
        let uId = req.user

        let user = await User.findOne({_id: uId})
        if(!user) return res.status(404).send({message:'user not found '})
        
        if(await checkPassword(data.currentPassword, user.password)){ 
        data.newPassword = await encrypt(data.newPassword)
        let updatePassword = await User.findOneAndUpdate(
            {_id:id},
            {password: data.newPassword},
            {new:true}
            
        )
        return res.send({message:'password updated successfully'})

        }else return res.status(500).send({message: 'Error updating account'})




    }catch(err){
        console.error(err)
        return res.status(500).send({message:'error updating password'})
    }
}