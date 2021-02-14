import { Schema, Document } from 'mongoose';
import { IImage } from './image'


const collaborator: Schema = new Schema({
    _id: Schema.Types.ObjectId,
    images: [
        { type: Schema.Types.ObjectId, ref: 'Image' }
    ],
    appellation: {
        type: String
    },
    name: {
        type: String
    },
    text: {
        type: String
    },
    order: {
        type: Number
    }
})

collaborator.index({'$**': 'text'});

interface ICollaborator extends Document {
    images: IImage[]
    appellation: string
    name: string
    text: string,
    order: number,
}

export { 
    collaborator,
    ICollaborator
}