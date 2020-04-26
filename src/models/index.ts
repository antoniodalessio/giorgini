import { model } from 'mongoose';

import { category, ICategory } from './category'
import { product, IProduct } from './product'
import { image, IImage } from './image'


let Category = model<ICategory>('Category', category)
let Product = model<IProduct>('Product', product)
let Image = model<IImage>('Image', image)

export {
    Category,
    Product,
    Image
}