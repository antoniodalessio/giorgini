"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const bodyParser = require('body-parser');
const api_1 = __importDefault(require("./routes/api"));
const webapp_1 = __importDefault(require("./routes/webapp"));
class App {
    constructor() {
        this.setupExpress();
    }
    setupExpress() {
        this._expressApp = express();
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
}
exports.default = App;
//# sourceMappingURL=app.js.map