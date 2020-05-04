const express = require('express')
var cors = require('cors');

import loginController from './controllers/login.controller'

import apiRoutes from './routes/api'
import webAppRoutes from './routes/webapp'

//var Jimp = require('jimp');
//var webp = require('webp-converter');
const mongoose = require('mongoose');

var fs = require('fs');

//import { Product, Category, Image } from './models'


class App {
  
  private _expressApp: any

  constructor() {
    console.log("app init")
    this.setupExpress()
    this.initMongoose()
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

    /*console.log("test Jimp")
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
    }*/
   
  }

    
}


export default App;



//import FTP from './utils/ftp'

//var clientftp = new FTP(process.env.FTP_HOST, 21, process.env.FTP_USER, process.env.FTP_PWD, false);

