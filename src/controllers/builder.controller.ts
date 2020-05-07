import Assemble from './../assemble'
import FTP from './../utils/ftp'
import { Category, Product } from '../models'
var fs = require('fs');

class BuilderController {

  private assemble: any
  private clientFtp: any

  constructor() {
    this.initAssemble()
    this.clientFtp = new FTP(process.env.FTP_HOST, 21, process.env.FTP_USER, process.env.FTP_PWD, false);
  }

  async initAssemble(){
    this.assemble = new Assemble({
      templatesPath: process.env.TEMPLATES_PATH,
      partialsPath: `${process.env.TEMPLATES_PATH}/partials/`,
      defaultLayout: `${process.env.TEMPLATES_PATH}/layout/default.hbs`,
      defaultFolder: `${process.env.SITE_PATH}`
    })
  }

  async getSubcategory(id: any) {
    let categories = await Category.find({parent: id}).sort('ord')
    let cats = []
    for(const category of categories) {
      cats.push(category.toObject())
    }
    return cats
  }

  async getProductOfCategory(id: any) {
    let products = await Product.find({category: id}).sort('ord').populate('images')
    let prods = []
    for(const product of products) {
      prods.push(product.toObject())
    }
    return prods
  }

  async buildCategories(published: boolean = false) {
    
    let filter: any = !published ? {published: false} : null
    
    let categories = await Category.find(filter).sort('ord')
    
    for(const category of categories) {
      let cat:any = category.toObject()
      cat.key = "work"
      cat.mywork = "active"
      cat.products = await this.getProductOfCategory(category._id)
      cat.products.forEach((product: any) => {
        if (product.hasOwnProperty("images") && product.images.length > 0) {
          product.thumb = product.images[0].uri
        }else{ 
          product.thumb = null 
        }
      });
      if(category.hasSubcategory) {
        cat.categories = await this.getSubcategory(category._id)
        await this.assemble.render("categories", cat)
      }else{
        await this.assemble.render("category", cat)
      }
      await Category.updateOne({_id: category._id}, {published: true})
    }
  
  }

  async buildProducts(published: boolean = false) {
    const filter = !published ? {published: false} : null
    let products = await Product.find(filter).populate('images category')
    for(const product of products) {
      let prod = product.toObject()
      prod.key = "product"
      prod.mywork = "active"
      await this.assemble.render("product", prod)
      await Product.updateOne({_id: product._id}, {published: true})
    }
  }

  async build(published: boolean = false) {
    await this.buildCategories(published)
    await this.buildProducts(published)
  }

  async upload() {
    let fileToUpload: any = await fs.readdirSync(`${process.env.SITE_PATH}`).filter( (file: any) => {
      return file.match(/.html/ig)
    });

    let filesUploaded = []

    for(const file of fileToUpload) {
      await this.clientFtp.upload(`${process.env.SITE_PATH}${file}`, `${process.env.FTP_FOLDER}${file}`, 755)
      filesUploaded.push(`${file}`)
    }

    return {fileToUpload, filesUploaded}
  }

  async clearFolder() {
    let filesToRemove: any = await fs.readdirSync(`${process.env.SITE_PATH}`).filter( (file: any) => {
      return file.match(/.html/ig)
    });

    for(const file of filesToRemove) {
      await fs.unlinkSync(`${process.env.SITE_PATH}${file}`)
    }
  }

  async publish(req: any, res: any) {

    let published = false
    if (req.query.hasOwnProperty('published')) {
      published = true
    }

    await this.build(published)
    let result = await this.upload()
    await this.clearFolder()
    res.status(200).json(result);
  }
}

export default BuilderController