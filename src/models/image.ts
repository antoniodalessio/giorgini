import { Schema, Document } from 'mongoose';


const image: Schema = new Schema({
    _id: Schema.Types.ObjectId,
    alt: { 
        type: String,
    },
    uri: {
        type: String
    },
    ord: {
        type: Number
    },
    type: {
        type: String
    }
})

interface IImage extends Document {
    alt: string;
    uri: string;
    uri_full: string;
    ord: number,
    type: string
}

export { 
    image,
    IImage
}