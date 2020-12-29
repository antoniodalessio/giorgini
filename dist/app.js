"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
var cors = require('cors');
const login_controller_1 = __importDefault(require("./controllers/login.controller"));
const api_1 = __importDefault(require("./routes/api"));
const public_1 = __importDefault(require("./routes/public"));
//import siteRoutes from './routes/site'
const models_1 = require("./models");
const mongoose_1 = require("mongoose");
const utils_1 = require("./utils/utils");
const SeoHelper_1 = __importDefault(require("./helpers/SeoHelper"));
const mongoose = require('mongoose');
var fs = require('fs');
class App {
    constructor() {
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("app init");
            this.createFolders();
            this.setupExpress();
            this.initMongoose();
            this.setupFirstAdminUser();
            if (process.env.ENV == 'PROD') {
                const seoHelper = new SeoHelper_1.default();
                seoHelper.downloadHtaccess();
            }
        });
    }
    createFolders() {
        if (!fs.existsSync(`${process.env.SITE_PATH}`)) {
            fs.mkdirSync(`${process.env.SITE_PATH}`);
        }
        if (!fs.existsSync(`${process.env.SITE_IMAGE_PATH}`)) {
            fs.mkdirSync(`${process.env.SITE_IMAGE_PATH}`);
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
        this._expressApp.use(express.static('site'));
        this._expressApp.use(express.json({ limit: '50mb' }));
        this._expressApp.use(express.urlencoded({ limit: '50mb' }));
        this._expressApp.setMaxListeners(0);
        this._expressApp.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
        let loginCTRL = new login_controller_1.default();
        this._expressApp.post('/authenticate', (req, res) => __awaiter(this, void 0, void 0, function* () { yield loginCTRL.login(req, res); }));
        this._expressApp.post('/checkAuth', (req, res) => __awaiter(this, void 0, void 0, function* () { yield loginCTRL.checkAuth(req, res); }));
        this._expressApp.post('/logout', (req, res) => __awaiter(this, void 0, void 0, function* () { yield loginCTRL.logout(req, res); }));
        this._expressApp.use('/api/', api_1.default());
        this._expressApp.use('/public/', public_1.default());
        //this._expressApp.use('/', siteRoutes())
    }
    initMongoose() {
        return __awaiter(this, void 0, void 0, function* () {
            let connection = yield mongoose.connect(`${process.env.DB_HOST}${process.env.DB_NAME}`, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
        });
    }
    setupFirstAdminUser() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield models_1.User.find({ username: 'admin' });
            if (data.length === 0) {
                let user = new models_1.User({
                    _id: new mongoose_1.Types.ObjectId(),
                    username: process.env.ADMIN_USER,
                    password: process.env.ADMIN_PWD,
                    hash: utils_1.toHash(process.env.ADMIN_USER, process.env.ADMIN_PWD)
                });
                const result = yield user.save();
                console.log(result);
            }
        });
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map