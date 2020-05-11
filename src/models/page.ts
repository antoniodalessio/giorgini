import { Schema, Document } from 'mongoose';
import { IImage } from './image'

const page: Schema = new Schema({
    _id: Schema.Types.ObjectId,
    meta: {
        title: {
            type: String, 
        },
        description: {
            type: String, 
        },
        keywork: {
            type: String, 
        }
    },
    title: { 
        type: String, 
        required: '{PATH} is required!'
    },
    description: {
        type: String
    },
    slug: {
        type: String,
        lowercase: true,
        trim: true,
        required: '{PATH} is required!'
    },
    images: [
        { type: Schema.Types.ObjectId, ref: 'Image' }
    ],
    ord: {
        type: Number
    },
    published: {
        type: Boolean
    }
})

page.index({'$**': 'text'});

interface IPage extends Document {
    meta: any;
    title: string;
    description: string;
    slug: string;
    ord: number;
    published: boolean,
    images: IImage[];
}

export { 
    page,
    IPage
}