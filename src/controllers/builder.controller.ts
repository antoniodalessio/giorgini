import Assemble from './../assemble'
import FTP from './../utils/ftp'
import { Page, Category, Product, Image } from '../models'
var fs = require('fs');

class BuilderController {

  private assemble: any
  private clientFtp: any

  private staticPages:any[] = [
    {
      slug: "index",
      sections: ['categories']
    },
    {
      slug: "contatta-amalia-cardo-modellista-stilista-sarta"
    },
    {
      slug: "amalia-cardo-sarta-modellista-stilista"
    },
    {
      slug: "cosa-faccio-amalia-cardo-modellista-stilista-sarta"
    },
  ]

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


  async buildSitemapXml(){
    const categories = (await Category.find()).map((item: any) => item ? item.toObject(): null)
    const products = (await Product.find().populate('images')).map((item: any) => item ? item.toObject() : null)
    const pages = (await Page.find()).map((item: any) => item ? item.toObject() : null)

    let resources = categories.concat(products).concat(pages)

    let siteMap = `
      <?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
      ${resources.map((item) => { return `
        <url>
          <loc>${process.env.SITE_URL}/${item.slug}.html</loc>
          ${item.images && item.images.length && item.images.map((image: any) =>{
            return `
              <image:image>
                <image:caption>${image.alt}</image:caption>
                <image:geo_location>Florence, Italy</image:geo_location>
                <image:loc>${process.env.SITE_URL}/images/work/${image.uri}_thumb.jpg</image:loc>
              </image:image>
            `
          }).join('\n') || ''}
        </url>
      `}).join('\n')}
      </urlset>
    `
    await fs.writeFileSync(`${process.env.SITE_PATH}sitemap.xml`, siteMap)
    await this.clientFtp.upload(`${process.env.SITE_PATH}sitemap.xml`, `${process.env.FTP_FOLDER}sitemap.xml`, 755)
  }
  
  async getSubcategories(id: any) {
    return (await Category.find({parent: id}).sort('ord')).map((item: any) => item ? item.toObject() : null)
  }

  async getProductsOfCategory(id: any) {
    return (await Product.find({category: id}).sort('ord').populate('images')).map((item: any) => item ? item.toObject() : null)
  }

  async buildStaticPages() {
    for(const page of this.staticPages) {
      if (page.hasOwnProperty('sections')){

        // find main category
        const parentCategory = await Category.findOne({parent: null})
        const _id = parentCategory.toObject()._id
        
        // get subcategory of main category
        const categories = (await Category.find({parent: _id}).sort('ord')).map((item: any) => item ? item.toObject() : null)
        for(const category of categories ) {
          const products = (await Product.find({category: category._id}).populate('images')).map((item: any) => item ? item.toObject() : null)
          category.products = products
        }
        
        page.sections = {
          categories
        }
      }
      await this.assemble.render(page.slug, page)
    }
  }

  async buildCategories(published: boolean = false) {
    
    let filter: any = !published ? {published: false} : null
    
    let categories = await Category.find(filter).sort('ord')
    
    for(const category of categories) {
      let cat:any = category.toObject()
      cat.key = "work"
      cat.mywork = "active"
      cat.products = await this.getProductsOfCategory(category._id)
      cat.pageImage = `${process.env.SITE_URL}${process.env.IMAGES_PATH}${cat.thumb_preview}_normal.jpg`,
      cat.products.forEach((product: any) => {
        if (product.hasOwnProperty("images") && product.images.length > 0) {
          product.thumb = product.images[0].uri
        }else{ 
          product.thumb = null 
        }
      });
      if(category.hasSubcategory) {
        cat.categories = await this.getSubcategories(category._id)
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
      prod.pageImage = `${process.env.SITE_URL}${process.env.IMAGES_PATH}${prod.images[0].uri}_normal.jpg`,
      await this.assemble.render("product", prod)
      await Product.updateOne({_id: product._id}, {published: true})
    }
  }

  async build(published: boolean = false) {
    await this.buildCategories(published)
    await this.buildProducts(published)
    await this.buildStaticPages()
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
    if (process.env.ENV == 'prod') {
      await this.clearFolder()
    }

    await this.buildSitemapXml()

    res.status(200).json(result);
  }
}

export default BuilderController