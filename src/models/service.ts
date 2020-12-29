import { Schema } from 'mongoose';
import { IImage } from './image'

import { IBasePage, defaultPageField} from './basePage'

const service: Schema = new Schema(Object.assign(defaultPageField, {
    _id: Schema.Types.ObjectId,
    images: [
        { type: Schema.Types.ObjectId, ref: 'Image' }
    ],
    icon: {
        type: String,
    },
    order: {
        type: Number
    },
    template: { type: String, default: 'service' },
}))

service.index({'$**': 'text'});

interface IService extends IBasePage {
    images: IImage[];
    icon: string;
    order: number;
}

export { 
    service,
    IService
}