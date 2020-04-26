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
const bodyParser = require('body-parser');
var cors = require('cors');
const api_1 = __importDefault(require("./routes/api"));
const webapp_1 = __importDefault(require("./routes/webapp"));
var Jimp = require('jimp');
class App {
    constructor() {
        this.setupExpress();
        this.testSharp();
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
        this._expressApp.use(express.json());
        this._expressApp.use(bodyParser.json());
        this._expressApp.use(bodyParser.urlencoded({ extended: true }));
        this._expressApp.setMaxListeners(0);
        this._expressApp.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
            res.send("hello world");
        }));
        this._expressApp.use('/api/', api_1.default());
        this._expressApp.use('/webapp/', webapp_1.default());
        this._expressApp.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
    }
    setup() {
    }
    run() {
    }
    testSharp() {
        Jimp.read(`./src/assets/images/abbigliamento_sartoria-amalia-cardo_thumb.jpg`)
            .then((image) => {
            return image
                .resize(100, 100)
                .write(`${process.env.SITE_PATH}/output.jpg`);
        });
        // sharp(`./src/assets/images/abbigliamento_sartoria-amalia-cardo_thumb.jpg`)
        //   .resize(100, 100)
        //   .toFile(`${process.env.SITE_PATH}/output.webp`, (err:any, info:any) => { 
        //     console.log(err, info)
        //    });
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map