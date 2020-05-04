const express = require('express')
var cors = require('cors');

import loginController from './controllers/login.controller'

import apiRoutes from './routes/api'
import webAppRoutes from './routes/webapp'

var fs = require('fs');
var Jimp = require('jimp');
var webp = require('webp-converter');
const mongoose = require('mongoose');
var fs = require('fs');

import { Product, Category, Image } from './models'


class App {
  
  private _expressApp: any

  constructor() {
    console.log("app init")
    this.setupExpress()
    this.initMongoose()

    this.testFS();
    //const builderController = new BuilderController()
    //builderController.publish(null, null)
    //this.import()
    //this.testJimp()
    //initAssemble()
  }

  async testFS() {

    // console.log("read /mnt/site/")
    // await fs.readdirSync("/mnt/site/", (file: any) => {
    //   console.log("/mnt/site", file)
    // })

    // console.log("read mnt/site/")
    // await fs.readdirSync("mnt/site/", (file: any) => {
    //   console.log("mnt/site", file)
    // })

    // console.log("read ./mnt/site/")
    // await fs.readdirSync("./mnt/site/", (file: any) => {
    //   console.log("./mnt/site", file)
    // })

    console.log("read ./mnt/")
    await fs.readdirSync("./mnt/", (file: any) => {
      console.log("./mnt/", file)
    })

    await fs.writeFileSync('/mnt/test.html', "<div>test</div>")

    await fs.writeFileSync('./mnt/test.html', "<div>test</div>")
  }

  setupExpress() {
    this._expressApp = express();
    this._expressApp.use(cors({
      "origin": '*',
      "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
      "exposedHeaders": ['Content-Range', 'X-Content-Range', '10'],
      "preflightContinue": false,
      "optionsSuccessStatus": 204
    }));
    this._expressApp.use
    this._expressApp.use(express.json({limit: '50mb'}));
    this._expressApp.use(express.urlencoded({limit: '50mb'}));
    this._expressApp.setMaxListeners(0);

    this._expressApp.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT!}`);
    });

    this._expressApp.get('/', async (req: any, res: any) => {
      res.send("hello world")
    })

    let loginCTRL = new loginController()

    this._expressApp.post('/authenticate', async (req: any, res: any) => { await loginCTRL.login(req, res)} )
    this._expressApp.post('/checkAuth', async (req: any, res: any) => { await loginCTRL.checkAuth(req, res)} )
    this._expressApp.post('/logout', async (req: any, res: any) => { await loginCTRL.logout(req, res)} )

    this._expressApp.use('/api/', apiRoutes());
    this._expressApp.use('/webapp/', webAppRoutes());

    
  }

  async initMongoose() {
    let connection = await mongoose.connect(`${process.env.DB_HOST}${process.env.DB_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }
  
  async testJimp() {

    console.log("test Jimp")
    try {
      const image = await Jimp.read(`./src/assets/images/abbigliamento_sartoria-amalia-cardo_thumb.jpg`);
      await image.resize(100, 100);
      let result = await image.getBufferAsync(Jimp.MIME_JPEG);
      console.log("result", result)
      await fs.writeFileSync(`${process.env.SITE_PATH}output.jpg`, result)

      webp.cwebp(`${process.env.SITE_PATH}output.jpg`,`${process.env.SITE_PATH}output.webp`,"-q 80",function(status: any,error: any)
      {
         //if conversion successful status will be '100'
        //if conversion fails status will be '101'
        console.log(status,error);	
      });

      //await image.writeAsync(`${process.env.SITE_PATH}output.jpg`);
      
    }catch(e) {
      console.log(e)
    }
   
  }


  async import() {
    const file = await fs.readFileSync(`${process.env.SITE_PATH}categories.json`)

    const parsedFile = JSON.parse(file)
    
    for(const category of parsedFile.categories) {
      
      const categoryId = new mongoose.Types.ObjectId()

      const cat = new Category({
        _id: categoryId,
        description: category.description,
        title: category.title,
        slug: category.slug,
        text: category.category_name,
        thumb_preview: category.thumb_preview,
        category_name: category.category_name
      })

      await cat.save()

      for(const product of category.products) {
        
        let imageIDS = []

        const productId = new mongoose.Types.ObjectId()

        let prod = new Product({
          _id: productId,
          description: product.description,
          title: product.title,
          slug: product.slug,
          category: categoryId
        })



        for (const image of product.images) {
          const imgId = new mongoose.Types.ObjectId()
          const img = new Image({
            _id: imgId,
            alt: image.alt,
            uri: image.uri
          })

          imageIDS.push(imgId)

          await img.save()
          console.log("...")

        }

        prod.images = imageIDS

        await prod.save()
  
      }

    }

  }

    
}


export default App;



//import FTP from './utils/ftp'

//var clientftp = new FTP(process.env.FTP_HOST, 21, process.env.FTP_USER, process.env.FTP_PWD, false);

