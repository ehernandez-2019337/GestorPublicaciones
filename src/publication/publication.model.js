import { Schema, model } from 'mongoose';

const publicationSchema = Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
}, {
    versionKey: false //Desahabilitar el __v (version del documento)
})

export default model('publication', publicationSchema)