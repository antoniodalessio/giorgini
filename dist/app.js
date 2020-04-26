"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const api_1 = __importDefault(require("./routes/api"));
const webapp_1 = __importDefault(require("./routes/webapp"));
const sharp = require('sharp');
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
        sharp(`./src/assets/images/abbigliamento_sartoria-amalia-cardo_thumb.jpg`)
            .resize(100, 100)
            .toFile(`${process.env.SITE_PATH}/output.webp`, (err, info) => {
            console.log(err, info);
        });
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map