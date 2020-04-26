import BaseController from './base.controller'
import { Category, Product, Image } from '../models/'
import { IImage } from '../models/image';
import { Types } from 'mongoose';


class ProductController extends BaseController{
  
  constructor() {
    super()
    this.model = Product
  }

  async getAll(req: any, res: any) {
    await super.getAll(req, res, 'images')
  }

  async get(req: any, res: any) {
    await super.get(req, res, 'images')
  }

  async save(req: any, res: any) {
    
    try{
      const data = await Product.find({slug: req.body.slug})
      if (data.length != 0) {
        res.status(500).json({error: `resource with a '${req.body.slug}' slug already exists`})
        return;
      }

      let imagesIDS = []; 

      if (req.body.images && req.body.images.length > 0) {
        
        imagesIDS = req.body.images.map(async (item: IImage) => {
          item._id = new Types.ObjectId()
          let image = new Image(item)
          return (await image.save())._id
        })
      }

      req.body._id = new Types.ObjectId()

      let product = new Product(req.body)

      let result = await product.save()

      // La richiesta è stata soddisfatta, restituendo la creazione di una nuova risorsa.
      res.status(201).json(result);
    }catch(e){
      res.status(500).json(e);
    }
  }


  async update(req: any, res: any) {
    
    try {
      const id = req.params.id
      let data: any = await Product.find({_id: id}).populate('images')
      
      if (data.length == 0) {
        res.status(500).json({error: `resource product with '${id}' doesn't exists`})
        return;
      }

      let imagesIDS: any = data[0].images.map( (item: IImage) => {
        return item._id
      })

      if (req.body.images && req.body.images.length > 0) {
        let images = req.body.images
        for (const element of images) {
          if (element.hasOwnProperty('_id')) {
            //update
            await Image.updateOne({ _id: element._id }, element)
          }else{
            //Save
            element._id = new Types.ObjectId()
            let image = new Image(element)
            await image.save()
            imagesIDS.push(element._id)
          }
        }
      }

      req.body.images = imagesIDS

      let result = await Product.updateOne({ _id: id }, req.body)
      res.status(200).json(result);
    }catch(e) {
      res.status(500).json(e)
    }

  }

}

export default ProductController;