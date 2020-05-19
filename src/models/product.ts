import { Schema } from 'mongoose';
import { IImage } from './image'
import { ICategory } from './category'
import { IFabric } from './fabric'

import { IBasePage, defaultPageField} from './basePage'

const product: Schema = new Schema(Object.assign(defaultPageField, {
    _id: Schema.Types.ObjectId,
    images: [
        { type: Schema.Types.ObjectId, ref: 'Image' }
    ],
    fabrics: {
        internal: [{ type: Schema.Types.ObjectId, ref: 'Fabric' }],
        external: [{ type: Schema.Types.ObjectId, ref: 'Fabric'}]
    },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
}))

product.index({'$**': 'text'});

interface IProduct extends IBasePage {
    images: IImage[];
    fabrics: {
        internal: IFabric[],
        external: IFabric[],
    }
    category: ICategory;
}

export { 
    product,
    IProduct
}