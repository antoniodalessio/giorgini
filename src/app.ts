const express = require('express')
var cors = require('cors');

import loginController from './controllers/login.controller'

import apiRoutes from './routes/api'
import publicRoutes from './routes/public'
//import siteRoutes from './routes/site'
import { User } from './models'

import { Types } from 'mongoose';
import { toHash } from './utils/utils'

import SeoHelper from './helpers/SeoHelper';

const mongoose = require('mongoose');

var fs = require('fs');


class App {
  
  private _expressApp: any

  constructor() {
    this.init()
  }

  async init() {
    console.log("app init")
    this.setupExpress()
    this.initMongoose()
    this.setupFirstAdminUser()

    if (process.env.ENV == 'PROD') {
      const seoHelper:SeoHelper = new SeoHelper()
      seoHelper.downloadHtaccess()
    }
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
    this._expressApp.use(express.static('site'))
    this._expressApp.use(express.json({limit: '50mb'}));
    this._expressApp.use(express.urlencoded({limit: '50mb'}));
    this._expressApp.setMaxListeners(0);

    this._expressApp.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT!}`);
    });

    let loginCTRL = new loginController()

    this._expressApp.post('/authenticate', async (req: any, res: any) => { await loginCTRL.login(req, res)} )
    this._expressApp.post('/checkAuth', async (req: any, res: any) => { await loginCTRL.checkAuth(req, res)} )
    this._expressApp.post('/logout', async (req: any, res: any) => { await loginCTRL.logout(req, res)} )

    this._expressApp.use('/api/', apiRoutes());
    this._expressApp.use('/public/', publicRoutes());

    //this._expressApp.use('/', siteRoutes())
    
  }

  async initMongoose() {
    let connection = await mongoose.connect(`${process.env.DB_HOST}${process.env.DB_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }

  async setupFirstAdminUser() {
    const data = await User.find({username: 'admin'})
    if (data.length === 0) {
      let user = new User({
        _id: new Types.ObjectId(),
        username: process.env.ADMIN_USER,
        password: process.env.ADMIN_PWD,
        hash: toHash(process.env.ADMIN_USER, process.env.ADMIN_PWD)
      })

      const result = await user.save()
      console.log(result)
    }
    
  }
    
}


export default App;

