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
const assemble_1 = __importDefault(require("./../assemble"));
const ftp_1 = __importDefault(require("./../utils/ftp"));
const models_1 = require("../models");
var fs = require('fs');
class BuilderController {
    constructor() {
        this.initAssemble();
        this.clientFtp = new ftp_1.default(process.env.FTP_HOST, 21, process.env.FTP_USER, process.env.FTP_PWD, false);
    }
    initAssemble() {
        return __awaiter(this, void 0, void 0, function* () {
            this.assemble = new assemble_1.default({
                templatesPath: process.env.TEMPLATES_PATH,
                partialsPath: `${process.env.TEMPLATES_PATH}/partials/`,
                defaultLayout: `${process.env.TEMPLATES_PATH}/layout/default.hbs`,
                defaultFolder: `${process.env.SITE_PATH}`
            });
        });
    }
    getSubcategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let categories = yield models_1.Category.find({ parent: id }).sort('ord');
            let cats = [];
            for (const category of categories) {
                cats.push(category.toObject());
            }
            return cats;
        });
    }
    getProductOfCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let products = yield models_1.Product.find({ category: id }).sort('ord').populate('images');
            let prods = [];
            for (const product of products) {
                prods.push(product.toObject());
            }
            return prods;
        });
    }
    buildCategories(published = false) {
        return __awaiter(this, void 0, void 0, function* () {
            let filter = !published ? { published: false } : null;
            let categories = yield models_1.Category.find(filter).sort('ord');
            for (const category of categories) {
                let cat = category.toObject();
                cat.key = "work";
                cat.mywork = "active";
                cat.products = yield this.getProductOfCategory(category._id);
                cat.products.forEach((product) => {
                    product.thumb = product.images[0].uri;
                });
                if (category.hasSubcategory) {
                    cat.categories = yield this.getSubcategory(category._id);
                    yield this.assemble.render("categories", cat);
                }
                else {
                    yield this.assemble.render("category", cat);
                }
                yield models_1.Category.updateOne({ _id: category._id }, { published: true });
            }
        });
    }
    buildProducts(published = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = !published ? { published: false } : null;
            let products = yield models_1.Product.find(filter).populate('images category');
            for (const product of products) {
                let prod = product.toObject();
                prod.key = "product";
                prod.mywork = "active";
                yield this.assemble.render("product", prod);
                yield models_1.Product.updateOne({ _id: product._id }, { published: true });
            }
        });
    }
    build(published = false) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.buildCategories(published);
            yield this.buildProducts(published);
        });
    }
    publish(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.build(true);
            let fileToUpload = fs.readdirSync(`${process.env.SITE_PATH}`).filter((file) => {
                return file.match(/.html/ig);
            });
            let filesUploaded = [];
            for (const file of fileToUpload) {
                yield this.clientFtp.upload(`${process.env.SITE_PATH}${file}`, `${process.env.FTP_FOLDER}${file}`, 755);
                filesUploaded.push(`${file}`);
            }
            res.status(200).json({ fileToUpload, filesUploaded });
        });
    }
}
exports.default = BuilderController;
//# sourceMappingURL=builder.controller.js.map