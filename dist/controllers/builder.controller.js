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
        this.staticPages = [
            {
                slug: "index",
                sections: ['categories']
            },
            {
                slug: "contatta-amalia-cardo-modellista-stilista-sarta"
            },
            {
                slug: "amalia-cardo-sarta-modellista-stilista"
            },
            {
                slug: "cosa-faccio-amalia-cardo-modellista-stilista-sarta"
            },
        ];
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
    buildSitemapXml() {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = (yield models_1.Category.find()).map((item) => item ? item.toObject() : null);
            const products = (yield models_1.Product.find().populate('images')).map((item) => item ? item.toObject() : null);
            const pages = (yield models_1.Page.find()).map((item) => item ? item.toObject() : null);
            let resources = categories.concat(products).concat(pages);
            let siteMap = `
      <?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
      ${resources.map((item) => {
                return `
        <url>
          <loc>${process.env.SITE_URL}/${item.slug}.html</loc>
          ${item.images && item.images.length && item.images.map((image) => {
                    return `
              <image:image>
                <image:caption>${image.alt}</image:caption>
                <image:geo_location>Florence, Italy</image:geo_location>
                <image:loc>${process.env.SITE_URL}/images/work/${image.uri}_thumb.jpg</image:loc>
              </image:image>
            `;
                }).join('\n') || ''}
        </url>
      `;
            }).join('\n')}
      </urlset>
    `;
            yield fs.writeFileSync(`${process.env.SITE_PATH}sitemap.xml`, siteMap);
            yield this.clientFtp.upload(`${process.env.SITE_PATH}sitemap.xml`, `${process.env.FTP_FOLDER}sitemap.xml`, 755);
        });
    }
    getSubcategories(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield models_1.Category.find({ parent: id }).sort('ord')).map((item) => item ? item.toObject() : null);
        });
    }
    getProductsOfCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield models_1.Product.find({ category: id }).sort('ord').populate('images')).map((item) => item ? item.toObject() : null);
        });
    }
    buildStaticPages() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const page of this.staticPages) {
                if (page.hasOwnProperty('sections')) {
                    // find main category
                    const parentCategory = yield models_1.Category.findOne({ parent: null });
                    const _id = parentCategory.toObject()._id;
                    // get subcategory of main category
                    const categories = (yield models_1.Category.find({ parent: _id })).map((item) => item ? item.toObject() : null);
                    for (const category of categories) {
                        const products = (yield models_1.Product.find({ category: category._id }).populate('images')).map((item) => item ? item.toObject() : null);
                        category.products = products;
                    }
                    page.sections = {
                        categories
                    };
                }
                yield this.assemble.render(page.slug, page);
            }
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
                cat.products = yield this.getProductsOfCategory(category._id);
                cat.pageImage = `${process.env.SITE_URL}${process.env.IMAGES_PATH}${cat.thumb_preview}_normal.jpg`,
                    cat.products.forEach((product) => {
                        if (product.hasOwnProperty("images") && product.images.length > 0) {
                            product.thumb = product.images[0].uri;
                        }
                        else {
                            product.thumb = null;
                        }
                    });
                if (category.hasSubcategory) {
                    cat.categories = yield this.getSubcategories(category._id);
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
                prod.pageImage = `${process.env.SITE_URL}${process.env.IMAGES_PATH}${prod.images[0].uri}_normal.jpg`,
                    yield this.assemble.render("product", prod);
                yield models_1.Product.updateOne({ _id: product._id }, { published: true });
            }
        });
    }
    build(published = false) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.buildCategories(published);
            yield this.buildProducts(published);
            yield this.buildStaticPages();
        });
    }
    upload() {
        return __awaiter(this, void 0, void 0, function* () {
            let fileToUpload = yield fs.readdirSync(`${process.env.SITE_PATH}`).filter((file) => {
                return file.match(/.html/ig);
            });
            let filesUploaded = [];
            for (const file of fileToUpload) {
                yield this.clientFtp.upload(`${process.env.SITE_PATH}${file}`, `${process.env.FTP_FOLDER}${file}`, 755);
                filesUploaded.push(`${file}`);
            }
            return { fileToUpload, filesUploaded };
        });
    }
    clearFolder() {
        return __awaiter(this, void 0, void 0, function* () {
            let filesToRemove = yield fs.readdirSync(`${process.env.SITE_PATH}`).filter((file) => {
                return file.match(/.html/ig);
            });
            for (const file of filesToRemove) {
                yield fs.unlinkSync(`${process.env.SITE_PATH}${file}`);
            }
        });
    }
    publish(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let published = false;
            if (req.query.hasOwnProperty('published')) {
                published = true;
            }
            yield this.build(published);
            let result = yield this.upload();
            if (process.env.ENV == 'prod') {
                yield this.clearFolder();
            }
            yield this.buildSitemapXml();
            res.status(200).json(result);
        });
    }
}
exports.default = BuilderController;
//# sourceMappingURL=builder.controller.js.map