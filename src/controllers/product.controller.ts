import BaseController from './base.controller'
import { Product, Image } from '../models/'
import { IImage } from '../models/image';
import { Types } from 'mongoose';
import FTP from './../utils/ftp'
import ImageHelper from '../helpers/ImageHelper'



class ProductController extends BaseController{

  private imageHelper: ImageHelper
  
  constructor() {
    super()
    this.model = Product
    this.imageHelper = new ImageHelper()
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

      req.body.published = false
      req.body.images = await this.saveOrUpdateImages(req.body)
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

      req.body.published = false
      req.body.images = await this.saveOrUpdateImages(req.body)
      
      let result = await Product.updateOne({ _id: id }, req.body)
      res.status(200).json({data: result});
    }catch(e) {
      res.status(500).json(e)
    }

  }


  async saveOrUpdateImages(newData: any) {
    
    let imagesIDS: any = []

    console.log(newData)

    if (newData.images && newData.images.length > 0) {
      let images = newData.images
      for (const image of images) {
        await this.imageHelper.saveImageFile(image.uri.base64, image.imgName)
        if (image.uri.hasOwnProperty('base64')){
          image.uri = image.imgName
        }  
        if (image.hasOwnProperty('_id')) {
          await Image.updateOne({ _id: image._id }, image)
          imagesIDS.push(image._id)
        }else{
            image._id = new Types.ObjectId()
            let imageInstance = new Image(image)
            await imageInstance.save()
            imagesIDS.push(image._id)
        } 
        
      }
    }

    return imagesIDS

  }

}

export default ProductController;