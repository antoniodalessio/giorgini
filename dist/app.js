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
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
var Jimp = require('jimp');
class App {
    constructor() {
        console.log("app init");
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
        this._expressApp.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
        this._expressApp.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
            this.testSharp();
            res.send("hello world");
        }));
        //this._expressApp.use('/api/', apiRoutes());
        //this._expressApp.use('/webapp/', webAppRoutes());
    }
    setup() {
    }
    run() {
    }
    testSharp() {
        console.log("test sharp");
        Jimp.read(`./src/assets/images/abbigliamento_sartoria-amalia-cardo_thumb.jpg`)
            .then((image) => {
            console.log(image);
            console.log(`${process.env.SITE_PATH}output.jpg`);
            return image
                .resize(100, 100)
                .write(`${process.env.SITE_PATH}output.jpg`);
        })
            .catch((err) => {
            // Handle an exception.
            console.log(err);
        });
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map