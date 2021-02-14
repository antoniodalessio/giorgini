import { Schema, Document } from 'mongoose';
import { IImage } from './image'
import { defaultPageField} from './basePage'


const collaborator: Schema = new Schema(Object.assign(defaultPageField,  {
    _id: Schema.Types.ObjectId,
    images: [
        { type: Schema.Types.ObjectId, ref: 'Image' }
    ],
    name: {
        type: String
    },
    text: {
        type: String
    },
    order: {
        type: Number
    }
}))

collaborator.index({'$**': 'text'});

interface ICollaborator extends Document {
    images: IImage[];
    name: string
    text: string,
    order: number,
}

export { 
    collaborator,
    ICollaborator
}