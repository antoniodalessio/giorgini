const express = require('express')
const bodyParser = require('body-parser');
var cors = require('cors');
import apiRoutes from './routes/api'
import webAppRoutes from './routes/webapp'

var fs = require('fs');

var Jimp = require('jimp');

class App {
  
  private _expressApp: any

  constructor() {
    console.log("app init")
    this.setupExpress()
    this.testSharp()
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
    this._expressApp.use(express.json());
    this._expressApp.use(bodyParser.json());
    this._expressApp.use(bodyParser.urlencoded({extended: true}));
    this._expressApp.setMaxListeners(0);

    this._expressApp.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT!}`);
    });

    this._expressApp.get('/', async (req: any, res: any) => {
      this.testSharp()
      res.send("hello world")
    })

    //this._expressApp.use('/api/', apiRoutes());
    //this._expressApp.use('/webapp/', webAppRoutes());

    
  }
  
  setup() {

  }

  run() {

  }

  async testSharp() {

    console.log("test Jimp")
    try {
      const image = await Jimp.read(`./src/assets/images/abbigliamento_sartoria-amalia-cardo_thumb.jpg`);
      await image.resize(100, 100);
      let result = await image.getBufferAsync(Jimp.MIME_JPEG);
      console.log("result", result)
      await fs.writeFileSync(`${process.env.SITE_PATH}output.jpg`, result)
      //await image.writeAsync(`${process.env.SITE_PATH}output.jpg`);
      
    }catch(e) {
      console.log(e)
    }
   
  }

    
}


export default App;