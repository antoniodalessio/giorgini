const express = require('express')
const bodyParser = require('body-parser');
var cors = require('cors');
import apiRoutes from './routes/api'
import webAppRoutes from './routes/webapp'

var Jimp = require('jimp');

class App {
  
  private _expressApp: any

  constructor() {
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

    this._expressApp.get('/', async (req: any, res: any) => {
      res.send("hello world")
    })

    this._expressApp.use('/api/', apiRoutes());
    this._expressApp.use('/webapp/', webAppRoutes());

    this._expressApp.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT!}`);
    });

    
  }
  
  setup() {

  }

  run() {

  }

  testSharp() {

    Jimp.read(`./src/assets/images/abbigliamento_sartoria-amalia-cardo_thumb.jpg`)
      .then( (image:any) => {
        return image 
          .resize(100, 100)
          .write(`${process.env.SITE_PATH}/output.jpg`);
      })

    // sharp(`./src/assets/images/abbigliamento_sartoria-amalia-cardo_thumb.jpg`)
    //   .resize(100, 100)
    //   .toFile(`${process.env.SITE_PATH}/output.webp`, (err:any, info:any) => { 
    //     console.log(err, info)
    //    });
  }

    
}


export default App;