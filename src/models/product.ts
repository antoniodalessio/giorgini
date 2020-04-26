import { Schema, Document } from 'mongoose';
import { IImage } from './image'
import { ICategory } from './category'

const product: Schema = new Schema({
    _id: Schema.Types.ObjectId,
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
})

interface IProduct extends Document {
    title: string;
    description: string;
    slug: string;
    images: IImage[];
    category: ICategory;
}

export { 
    product,
    IProduct
}