import { Schema, Document } from 'mongoose';
import { IProduct } from './product'

const category: Schema = new Schema({
    _id: Schema.Types.ObjectId,
    title: { 
        type: String, 
        required: '{PATH} is required!'
    },
    description: {
        type: String
    },
    text: {
        type: String
    },
    category_name: {
        type: String
    },
    thumb_preview: {
        type: String
    },
    slug: {
        type: String,
        lowercase: true,
        trim: true,
        required: '{PATH} is required!'
    },
    products: [
        { type: Schema.Types.ObjectId, ref: 'Product' }
    ]
})

interface ICategory extends Document {
    title: string;
    description: string;
    text: string;
    category_name: string;
    thumb_preview: string;
    slug: string;
    products: IProduct[]
}

export { 
    category,
    ICategory,
}