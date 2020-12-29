import { Schema, Document } from 'mongoose';
import { IImage } from './image'
import { IBasePage, defaultPageField} from './basePage'


const story: Schema = new Schema(Object.assign(defaultPageField,  {
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

story.index({'$**': 'text'});

interface IStory extends Document {
    images: IImage[];
    name: string
    text: string,
    order: number,
}

export { 
    story,
    IStory
}