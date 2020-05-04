import BaseController from './base.controller'
import { Product, Image } from '../models/'
import { IImage } from '../models/image';
import { Types } from 'mongoose';
import FTP from './../utils/ftp'
var fs = require('fs');
var Jimp = require('jimp');

var clientftp = new FTP(process.env.FTP_HOST, 21, process.env.FTP_USER, process.env.FTP_PWD, false);

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

    if (newData.images && newData.images.length > 0) {
      let images = newData.images
      for (const image of images) {
        await this.saveImageFile(image)
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

  async saveImageFile(image: any) {
    try{
      if (image.hasOwnProperty('imagedata')) {
        image.imagedata.base64 = image.imagedata.base64.replace(/^data:image\/jpeg;base64,/, "");
        const path = `${process.env.SITE_IMAGE_PATH}${image.uri}.jpg`
        await fs.writeFileSync(path, image.imagedata.base64, 'base64')
        await this.createImageFormatAndUpload(image.uri)

        delete image.imagedata
      }
    }catch(e) {
      console.log(e)
    }
  }

  async createSingleImageAndUpload(name: string, size: any, suffix: string) {
      const image = await Jimp.read(`${process.env.SITE_IMAGE_PATH}${name}.jpg`)
      await image.resize(size.width, size.height);
      let result = await image.getBufferAsync(Jimp.MIME_JPEG);
      await fs.writeFileSync(`${process.env.SITE_IMAGE_PATH}${name}${suffix}.jpg`, result)
      await clientftp.upload(`${process.env.SITE_IMAGE_PATH}${name}${suffix}.jpg`, `${process.env.REMOTE_IMAGES_PATH}${name}${suffix}.jpg`, 755)
  }

  async createImageFormatAndUpload(name: string) {
      await this.createSingleImageAndUpload(name, {width: 640, height: 640}, "_thumb")
      await this.createSingleImageAndUpload(name, {width: 640, height: 640}, "_normal")
      await this.createSingleImageAndUpload(name, {width: 1024, height: 1024}, "_x2")
  }

}

export default ProductController;