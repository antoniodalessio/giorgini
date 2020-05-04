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
const webapp_1 = __importDefault(require("./routes/webapp"));
var fs = require('fs');
var Jimp = require('jimp');
var webp = require('webp-converter');
const mongoose = require('mongoose');
var fs = require('fs');
const models_1 = require("./models");
class App {
    constructor() {
        console.log("app init");
        this.setupExpress();
        this.initMongoose();
        this.testFS();
        //const builderController = new BuilderController()
        //builderController.publish(null, null)
        //this.import()
        //this.testJimp()
        //initAssemble()
    }
    testFS() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("read /mnt/site/");
            yield fs.readdirSync("/mnt/site/", (file) => {
                console.log("/mnt/site", file);
            });
            console.log("read mnt/site/");
            yield fs.readdirSync("mnt/site/", (file) => {
                console.log("mnt/site", file);
            });
            console.log("read .mnt/site/");
            yield fs.readdirSync("./mnt/site/", (file) => {
                console.log(".mnt/site", file);
            });
            yield fs.writeFileSync('/mnt/site/test.html', "<div>test</div>");
            yield fs.writeFileSync('/mnt/test.html', "<div>test</div>");
            yield fs.writeFileSync('mnt/test.html', "<div>test</div>");
            yield fs.writeFileSync('mnt/site/test.html', "<div>test</div>");
        });
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
        this._expressApp.use;
        this._expressApp.use(express.json({ limit: '50mb' }));
        this._expressApp.use(express.urlencoded({ limit: '50mb' }));
        this._expressApp.setMaxListeners(0);
        this._expressApp.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
        this._expressApp.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
            res.send("hello world");
        }));
        let loginCTRL = new login_controller_1.default();
        this._expressApp.post('/authenticate', (req, res) => __awaiter(this, void 0, void 0, function* () { yield loginCTRL.login(req, res); }));
        this._expressApp.post('/checkAuth', (req, res) => __awaiter(this, void 0, void 0, function* () { yield loginCTRL.checkAuth(req, res); }));
        this._expressApp.post('/logout', (req, res) => __awaiter(this, void 0, void 0, function* () { yield loginCTRL.logout(req, res); }));
        this._expressApp.use('/api/', api_1.default());
        this._expressApp.use('/webapp/', webapp_1.default());
    }
    initMongoose() {
        return __awaiter(this, void 0, void 0, function* () {
            let connection = yield mongoose.connect(`${process.env.DB_HOST}${process.env.DB_NAME}`, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
        });
    }
    testJimp() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("test Jimp");
            try {
                const image = yield Jimp.read(`./src/assets/images/abbigliamento_sartoria-amalia-cardo_thumb.jpg`);
                yield image.resize(100, 100);
                let result = yield image.getBufferAsync(Jimp.MIME_JPEG);
                console.log("result", result);
                yield fs.writeFileSync(`${process.env.SITE_PATH}output.jpg`, result);
                webp.cwebp(`${process.env.SITE_PATH}output.jpg`, `${process.env.SITE_PATH}output.webp`, "-q 80", function (status, error) {
                    //if conversion successful status will be '100'
                    //if conversion fails status will be '101'
                    console.log(status, error);
                });
                //await image.writeAsync(`${process.env.SITE_PATH}output.jpg`);
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    import() {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield fs.readFileSync(`${process.env.SITE_PATH}categories.json`);
            const parsedFile = JSON.parse(file);
            for (const category of parsedFile.categories) {
                const categoryId = new mongoose.Types.ObjectId();
                const cat = new models_1.Category({
                    _id: categoryId,
                    description: category.description,
                    title: category.title,
                    slug: category.slug,
                    text: category.category_name,
                    thumb_preview: category.thumb_preview,
                    category_name: category.category_name
                });
                yield cat.save();
                for (const product of category.products) {
                    let imageIDS = [];
                    const productId = new mongoose.Types.ObjectId();
                    let prod = new models_1.Product({
                        _id: productId,
                        description: product.description,
                        title: product.title,
                        slug: product.slug,
                        category: categoryId
                    });
                    for (const image of product.images) {
                        const imgId = new mongoose.Types.ObjectId();
                        const img = new models_1.Image({
                            _id: imgId,
                            alt: image.alt,
                            uri: image.uri
                        });
                        imageIDS.push(imgId);
                        yield img.save();
                        console.log("...");
                    }
                    prod.images = imageIDS;
                    yield prod.save();
                }
            }
        });
    }
}
exports.default = App;
//import FTP from './utils/ftp'
//var clientftp = new FTP(process.env.FTP_HOST, 21, process.env.FTP_USER, process.env.FTP_PWD, false);
//# sourceMappingURL=app.js.map