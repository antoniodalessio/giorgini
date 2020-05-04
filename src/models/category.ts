import { Schema, Document } from 'mongoose';

const category: Schema = new Schema({
    _id: Schema.Types.ObjectId,
    meta: {
        title: {

        },
        description: {

        },
        keywork: {

        }
    },
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
    ord: {
        type: Number
    },
    published: {
        type: Boolean
    },
    parent: {
        type: Schema.Types.ObjectId
    },
    hasSubcategory: {
        type: Boolean,
    }
})

category.index({'$**': 'text'});

interface ICategory extends Document {
    meta: any;
    title: string;
    description: string;
    text: string;
    category_name: string;
    thumb_preview: string;
    slug: string;
    ord: number;
    published: boolean;
    hasSubcategory: boolean;
    parent: ICategory
}

export { 
    category,
    ICategory,
}