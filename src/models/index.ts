import { model } from 'mongoose';

import { user, IUser } from './user'
import { page, IPage } from './page'
import { category, ICategory } from './category'
import { product, IProduct } from './product'
import { image, IImage } from './image'
import { customer, ICustomer } from './customer'
import { fabric, IFabric } from './fabric'

let User = model<IUser>('User', user)
let Page = model<IPage>('Page', page)
let Category = model<ICategory>('Category', category)
let Product = model<IProduct>('Product', product)
let Image = model<IImage>('Image', image)
let Customer = model<ICustomer>('Customer', customer)
let Fabric = model<IFabric>('Fabric', fabric)

export {
    Page,
    Category,
    Product,
    Image,
    User,
    IUser,
    Customer,
    Fabric,
    IFabric
}