import BaseController from './base.controller'
import { Category, Product } from '../models/'
import { IProduct } from '../models/product';
import { Types } from 'mongoose';


class CategoryController extends BaseController{

  constructor() {
    super()
    this.model = Category
  }

  async getAll(req: any, res: any) {
    await super.getAll(req, res, 'products')
  }

  async get(req: any, res: any) {
    await super.get(req, res, 'products')
  }

  async save(req: any, res: any) {
    
    try{
      const data = await Category.find({slug: req.body.slug})
      if (data.length != 0) {
        res.status(500).json({error: `resource with a '${req.body.slug}' slug already exists`})
        return;
      }

      let productsIDS = []; 

      if (req.body.products && req.body.products.length > 0) {
        
        productsIDS = req.body.products.map(async (item: IProduct) => {
          item._id = new Types.ObjectId()
          let product = new Product(item)
          return (await product.save())._id
        })
      }

      req.body._id = new Types.ObjectId()

      let category = new Category(req.body)

      let result = await category.save()

      // La richiesta è stata soddisfatta, restituendo la creazione di una nuova risorsa.
      res.status(201).json(result);
    }catch(e){
      res.status(500).json(e);
    }
  }


  updateRecursively() {

  }


  async update(req: any, res: any) {
    
    try {
      const id = req.params.id
      const data: any = await Category.find({_id: id}).populate('products')
      
      if (data.length == 0) {
        res.status(500).json({error: `resource category with '${id}' doesn't exists`})
        return;
      }

      let productsIDS: any = data[0].products.map( (item: IProduct) => {
        return item._id
      })

      if (req.body.products && req.body.products.length > 0) {
        let products = req.body.products
        for (const element of products) {
          if (element.hasOwnProperty('_id')) {
            //update
            await Product.updateOne({ _id: element._id }, element)
          }else{
            //Save
            element._id = new Types.ObjectId()
            let product = new Product(element)
            await product.save()
            productsIDS.push(element._id)
          }
        }
      }

      req.body.products = productsIDS

      let result = await Category.updateOne({ _id: id }, req.body)
      res.status(200).json(result);
    }catch(e) {
      res.status(500).json(e)
    }

  }
}

export default CategoryController;