import { Schema, Document } from 'mongoose';
import { IProduct } from './index';

const review: Schema = new Schema({
    _id: Schema.Types.ObjectId,
    comment: {
        type: String,
    },
    username: {
        type: String,
    },
    city: {
        type: String,
    },
    publishedAt: Date,
    product: {
        type: Schema.Types.ObjectId, ref: 'Product'
    }
})

review.index({'$**': 'text'});

interface IReview extends Document {
    comment: string;
    username: string;
    publishedAt: Date;
    product: IProduct
}

export { 
    review,
    IReview,
}