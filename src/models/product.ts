import { Schema, Document } from 'mongoose';
import { IImage } from './image'
import { ICategory } from './category'

const product: Schema = new Schema({
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
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    ord: {
        type: Number
    },
    published: {
        type: Boolean
    }
})

interface IProduct extends Document {
    meta: any;
    title: string;
    description: string;
    slug: string;
    ord: number;
    published: boolean,
    images: IImage[];
    category: ICategory;
}

export { 
    product,
    IProduct
}