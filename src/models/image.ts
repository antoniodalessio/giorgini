import { Schema, Document } from 'mongoose';


const image: Schema = new Schema({
    _id: Schema.Types.ObjectId,
    alt: { 
        type: String,
    },
    uri: {
        type: String
    }
})

interface IImage extends Document {
    alt: string;
    uri: string;
}

export { 
    image,
    IImage
}