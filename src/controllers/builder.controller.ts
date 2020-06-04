import Assemble from './../assemble'
import FTP from './../utils/ftp'
import { Page, Category, Product, Image, Review, ICategory } from '../models'
import { IProduct  } from '../models/product';
var fs = require('fs');
import SeoHelper from '../helpers/SeoHelper'

interface IBreadcrumb {
  slug: string
  label: string
}

class BuilderController {

  private assemble: any
  private clientFtp: any
  private fileToUpload: string[] = []
  private seoHelper: SeoHelper

  constructor() {
    this.initAssemble()
    this.clientFtp = new FTP(process.env.FTP_HOST, 21, process.env.FTP_USER, process.env.FTP_PWD, false);
    this.seoHelper = new SeoHelper()
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
      ${resources.map((item) => { 
        if (item.template == 'index') {
          return ''
        }
        return `
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

  async addResources(page: any) {

    if (page.hasOwnProperty('resources') && page.resources.length > 0){
      
      let resources: any = {}

      for (const resource of page.resources) {
        //console.log(resource)
        if (resource.type == 'category') {
          // find main category
          const parentCategory = await Category.findOne({parent: null})
          const _id = parentCategory.toObject()._id
          
          // get subcategory of main category
          const categories = (await Category.find({parent: _id}).sort('ord')).map((item: any) => item ? item.toObject() : null)
          for(const category of categories ) {
            const products = (await Product.find({category: category._id}).populate('images')).map((item: any) => item ? item.toObject() : null)
            category.products = products
          }
          
          resources.categories = categories
        }

        if (resource.type == 'review') {
          const reviews = (await Review.find().sort('_id')).map((item: any) => item ? item.toObject() : null)
          resources.reviews = reviews
        }

      }

      page.resources = resources

    }

    return page

  }

  async buildStaticPages(unpublished: boolean) {

    const pages = (await Page.find()).map((item: any) => item ? item.toObject() : null)

    for(let page of pages) {
      page = await this.addResources(page)
      page.pageImage = `${process.env.SITE_URL}/images/logo.png`

      if (!unpublished || !page.published) {
        await this.assemble.render(page.template, page)
        this.fileToUpload.push(page.slug)
        await Page.updateOne({_id: page._id}, {published: true})
      }
    }
  }


  async buildBreadCrumb(cat: ICategory, array: IBreadcrumb[] = []):Promise<IBreadcrumb[]> {
    array.push(
      {
        slug: cat.slug,
        label: cat.category_name
      }
    )
    if (!cat.parent){
      return array
    }else{
      const parentCat = (await Category.findOne({_id: cat.parent})).toObject()
      return await this.buildBreadCrumb(parentCat, array)
    }
  }

  async buildCategories(unpublished: boolean) {
    
    let categories = await Category.find().sort('ord')
    
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

      if (!unpublished || !category.published) {
        cat.breadcrumb = (await this.buildBreadCrumb(cat)).reverse()
        if(category.hasSubcategory) {
          cat.categories = await this.getSubcategories(category._id)
          await this.assemble.render("categories", cat)
        }else{
          await this.assemble.render("category", cat)
        }

        this.fileToUpload.push(cat.slug)
        await Category.updateOne({_id: category._id}, {published: true})
      }
    }
  }


  async renderFabrics(product: IProduct) {
    if (product.fabrics) {
    
      const fabrics = {
        internal: product.fabrics.internal.map((item: any) => item && typeof item.toObject == 'function' ? item.toObject() : null),
        external: product.fabrics.external.map((item: any) => item && typeof item.toObject == 'function' ? item.toObject() : null),
      }

      const tmpData = {
        slug: product.slug + '_fabrics',
        fabrics
      }
      await this.assemble.renderSimple('fabrics-popup', tmpData)
    }
  }

  async buildProducts(unpublished: boolean) {
    let products = await Product.find().populate({path: 'images', options: { sort: { 'ord': 1 } } }).populate('fabrics.internal fabrics.external category')
    for(const product of products) {
      let prod = product.toObject()
      prod.key = "product"
      prod.mywork = "active"
      prod.pageImage = `${process.env.SITE_URL}${process.env.IMAGES_PATH}${prod.images[0].uri}_normal.jpg`

      if (!unpublished || !product.published) {
        const category = (await Category.findOne({_id: prod.category})).toObject()
        prod.breadcrumb = (await this.buildBreadCrumb(category)).reverse()
        prod.breadcrumb.push({slug: prod.slug, label: prod.title})
        await this.assemble.render("product", prod)
        this.fileToUpload.push(product.slug)
        if (product.fabrics.internal.length > 0 || product.fabrics.external.length) {
          await this.renderFabrics(product)
          this.fileToUpload.push(`${product.slug}_fabrics`)
        }
        await Product.updateOne({_id: product._id}, {published: true})
      }
      
    }
  }

  async build(unpublished: boolean) {
    await this.buildCategories(unpublished)
    await this.buildProducts(unpublished)
    await this.buildStaticPages(unpublished)
  }

  async upload() {
    let filesUploaded = []

    for(const file of this.fileToUpload) {
      await this.clientFtp.upload(`${process.env.SITE_PATH}${file}.html`, `${process.env.FTP_FOLDER}${file}.html`, 755)
      filesUploaded.push(`${file}`)
    }

    this.fileToUpload = []

    return {filesUploaded}
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

    let unpublished = false
    if (req.query.hasOwnProperty('unpublished')) {
      unpublished = true
    }

    await this.build(unpublished)
    let result = await this.upload()
    if (process.env.ENV == 'prod') {
      await this.clearFolder()
    }

    await this.buildSitemapXml()
    await this.seoHelper.uploadHtaccess()
    await this.seoHelper.downloadHtaccess()

    res.status(200).json(result);
  }
}

export default BuilderController