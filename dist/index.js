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
require('dotenv').config();
const app_1 = __importDefault(require("./app"));
const app = new app_1.default();
const express = require('express');
const mongoose = require('mongoose');
const expressApp = express();
const assemble_1 = __importDefault(require("./assemble"));
let assemble = new assemble_1.default({
    templatesPath: `./site/templates/`,
    partialsPath: `./site/templates/partials/`,
    defaultLayout: `./site/templates/layout/default.hbs`,
    defaultFolder: `${process.env.SITE_PATH}/`
});
const ftp_1 = __importDefault(require("./utils/ftp"));
var clientftp = new ftp_1.default(process.env.FTP_HOST, 21, process.env.FTP_USER, process.env.FTP_PWD, false);
function initMongoose() {
    return __awaiter(this, void 0, void 0, function* () {
        let connection = yield mongoose.connect(`${process.env.DB_HOST}${process.env.DB_NAME}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        /*let product = new Product({
            _id: new mongoose.Types.ObjectId(),
            title: "Giacca Kimono",
            description: "In jersey stampato",
            slug: "giacca-kimono-jersey-stampato"
        })
    
        product = await product.save()
    
        let category = new Category({
            _id: new mongoose.Types.ObjectId(),
            title: "Abiti su misura - Sartoria Firenze",
            slug:"abbigliamento sartoria firenze",
            products: [product._id]
        });
    
        await category.save()
        
        product.category = category._id
        await product.save()*/
        /*let category: any = await Category.find().populate('products');
    
        console.log(category[0])*/
    });
}
initMongoose();
//# sourceMappingURL=index.js.map