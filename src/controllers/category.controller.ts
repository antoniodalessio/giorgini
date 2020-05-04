import BaseController from './base.controller'
import { Category, Product } from '../models/'
import { Types } from 'mongoose';


class CategoryController extends BaseController{

  constructor() {
    super()
    this.model = Category
  }

  async getAll(req: any, res: any) {
    await super.getAll(req, res, '')
  }

  async get(req: any, res: any) {
    await super.get(req, res, '')
  }

  async updateCategoryParent(id: any) {
    let category = await this.model.findOne({_id: id})
    category.hasSubcategory = true
    let result = await Category.updateOne({ _id: id }, category)
  }

  async save(req: any, res: any) {
    
    try{
      const data = await Category.find({slug: req.body.slug})
      if (data.length != 0) {
        res.status(500).json({error: `resource with a '${req.body.slug}' slug already exists`})
        return;
      }

      req.body._id = new Types.ObjectId()

      req.body.published = false
      req.body.hasSubcategory = false

      let category = new Category(req.body)

      let result = await category.save()

      if (req.body.parent) {
        this.updateCategoryParent(req.body.parent)
      }
      


      // La richiesta è stata soddisfatta, restituendo la creazione di una nuova risorsa.
      res.status(201).json(result);
    }catch(e){
      res.status(500).json(e);
    }
  }

  async update(req: any, res: any) {
    
    try {
      const id = req.params.id
      const data: any = await Category.find({_id: id}).populate('products')
      
      if (data.length == 0) {
        res.status(500).json({error: `resource category with '${id}' doesn't exists`})
        return;
      }

      req.body.published = false

      let result = await Category.updateOne({ _id: id }, req.body)
      res.status(200).json({data: result});
    }catch(e) {
      res.status(500).json(e)
    }

  }

  
}

export default CategoryController;