import { Schema, model } from 'mongoose';

const commentSchema = Schema({
    comment: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    publication: {
        type: Schema.Types.ObjectId,
        ref: 'post',
        required: true
    }
}, {
    versionKey: false //Desahabilitar el __v (version del documento)
})

export default model('comment', commentSchema)