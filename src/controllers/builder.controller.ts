import Assemble from './../assemble'
import FTP from './../utils/ftp'
import { Page, Image, Story, Service, Collaborator } from '../models'
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

    const stories = (await Story.find().populate('images')).map((item: any) => item ? item.toObject() : null)
    const services = (await Story.find().populate('images')).map((item: any) => item ? item.toObject() : null)
    const pages = (await Page.find().populate('images')).map((item: any) => item ? item.toObject() : null)
    const resources = stories.concat(services).concat(pages)

    const data = {
      resources: resources.filter((resource) => resource.template != 'index' && resource.template != '404'),
      baseUrl: process.env.SITE_URL,
      slug: 'sitemap'
    }

    await this.assemble.renderSimple('sitemap', data, "xml")
    await this.clientFtp.upload(`${process.env.SITE_PATH}sitemap.xml`, `${process.env.FTP_FOLDER}sitemap.xml`, 755)
  }

  async addResources(page: any) {

    if (page.hasOwnProperty('resources') && page.resources.length > 0){
      
      let resources: any = {}

      for (const resource of page.resources) {

        if (resource.type == 'story') {
          resources.stories = (
            await Story.find(resource.filter)
                        .sort('order')
                        .populate({path: 'images', options: { sort: { 'ord': 1 } } }))
                        .map((item: any) => item ? item.toObject() : null)
        }

        if (resource.type == 'service') {
          resources.services = (await Service.find(resource.filter)
                                .sort('order'))
                                .map((item: any) => item ? item.toObject() : null)
        }

        if (resource.type == 'collaborator') {
          resources.collaborator = (
            await Collaborator.find(resource.filter)
                        .sort('order')
                        .populate({path: 'images', options: { sort: { 'ord': 1 } } }))
                        .map((item: any) => item ? item.toObject() : null)
        }

      }

      page.resources = resources

    }

    return page

  }

  async buildStaticPages() {

    const pages = (await Page.find()).map((item: any) => item ? item.toObject() : null)
    const pags = []
    for(let page of pages) {
      page = await this.addResources(page)
      page.pageImage = `${process.env.SITE_URL}/images/logo.png`
      pags.push(page)
    }
    return pags;
  }

  async uploadStaticPages(pages: any, unpublished: boolean) {
    for(let page of pages) {
      if (!unpublished || !page.published) {
        await this.assemble.render(page.template, page)
        this.fileToUpload.push(page.slug)
        await Page.updateOne({_id: page._id}, {published: true})
      }
    }
  }


  async buildServices() {
    let services = await Service.find().populate({path: 'images', options: { sort: { 'ord': 1 } } })
    let servs = [];
    for(let service of services) {
      let serv = service.toObject()
      serv = await this.addResources(serv)
      servs.push(serv)
    }
    return servs;
  }

  async uploadServices(services: any, unpublished: boolean) {
    for(const service of services) {
      if (!unpublished || !service.published) {
        await this.assemble.render("service", service)
        this.fileToUpload.push(service.slug)
        await Service.updateOne({_id: service._id}, {published: true})
      }
    }
  }

  async buildStories() {
    let stories = await Story.find().sort('-order').populate({path: 'images', options: { sort: { 'ord': 1 } } })
    let stors = [];
    for(let story of stories) {
      let stor = story.toObject()
      stor = await this.addResources(stor)
      stors.push(stor)
    }
    return stors;
  }

  async uploadStories(stories: any, unpublished: boolean) {
    for(const story of stories) {
      if (!unpublished || !story.published) {
        await this.assemble.render("story", story)
        this.fileToUpload.push(story.slug)
        await Story.updateOne({_id: story._id}, {published: true})
      }
    }
  }

  async upload() {
    try {
      let filesUploaded = []

      for(const file of this.fileToUpload) {
        await this.clientFtp.upload(`${process.env.SITE_PATH}${file}.html`, `${process.env.FTP_FOLDER}${file}.html`, 755)
        filesUploaded.push(`${file}`)
      }

      this.fileToUpload = []

      return {filesUploaded}
    }catch(e){
      console.log(e)
    }
  }

  async clearFolder() {
    let filesToRemove: any = await fs.readdirSync(`${process.env.SITE_PATH}`).filter( (file: any) => {
      return file.match(/.html/ig)
    });

    for(const file of filesToRemove) {
      await fs.unlinkSync(`${process.env.SITE_PATH}${file}`)
    }
  }

  async renderBySlug(name: string) {

    const allPages = [await this.buildStaticPages()].reduce((acc:any, curr:any) => {
      return acc.concat(curr)
    })

    for (let page of allPages) {
      page = await this.addResources(page)
    }
    
    name = name.replace(".html", "")
    const page: any = allPages.filter((resource:any) => resource.slug == name)
    const result = await this.assemble.renderPage(page[0])

    return result

  }

  async build(unpublished: boolean) {
    await this.uploadStaticPages(await this.buildStaticPages(), unpublished)
    await this.uploadServices(await this.buildServices(), unpublished)
    await this.uploadStories(await this.buildStories(), unpublished)
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