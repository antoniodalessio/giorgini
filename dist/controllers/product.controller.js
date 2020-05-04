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
const base_controller_1 = __importDefault(require("./base.controller"));
const models_1 = require("../models/");
const mongoose_1 = require("mongoose");
const ftp_1 = __importDefault(require("./../utils/ftp"));
var fs = require('fs');
var Jimp = require('jimp');
var clientftp = new ftp_1.default(process.env.FTP_HOST, 21, process.env.FTP_USER, process.env.FTP_PWD, false);
class ProductController extends base_controller_1.default {
    constructor() {
        super();
        this.model = models_1.Product;
    }
    getAll(req, res) {
        const _super = Object.create(null, {
            getAll: { get: () => super.getAll }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.getAll.call(this, req, res, 'images');
        });
    }
    get(req, res) {
        const _super = Object.create(null, {
            get: { get: () => super.get }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.get.call(this, req, res, 'images');
        });
    }
    save(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield models_1.Product.find({ slug: req.body.slug });
                if (data.length != 0) {
                    res.status(500).json({ error: `resource with a '${req.body.slug}' slug already exists` });
                    return;
                }
                req.body.published = false;
                req.body.images = yield this.saveOrUpdateImages(req.body);
                req.body._id = new mongoose_1.Types.ObjectId();
                let product = new models_1.Product(req.body);
                let result = yield product.save();
                // La richiesta è stata soddisfatta, restituendo la creazione di una nuova risorsa.
                res.status(201).json(result);
            }
            catch (e) {
                res.status(500).json(e);
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                let data = yield models_1.Product.find({ _id: id }).populate('images');
                if (data.length == 0) {
                    res.status(500).json({ error: `resource product with '${id}' doesn't exists` });
                    return;
                }
                req.body.published = false;
                req.body.images = yield this.saveOrUpdateImages(req.body);
                let result = yield models_1.Product.updateOne({ _id: id }, req.body);
                res.status(200).json({ data: result });
            }
            catch (e) {
                res.status(500).json(e);
            }
        });
    }
    saveOrUpdateImages(newData) {
        return __awaiter(this, void 0, void 0, function* () {
            let imagesIDS = [];
            if (newData.images && newData.images.length > 0) {
                let images = newData.images;
                for (const image of images) {
                    yield this.saveImageFile(image);
                    if (image.hasOwnProperty('_id')) {
                        yield models_1.Image.updateOne({ _id: image._id }, image);
                        imagesIDS.push(image._id);
                    }
                    else {
                        image._id = new mongoose_1.Types.ObjectId();
                        let imageInstance = new models_1.Image(image);
                        yield imageInstance.save();
                        imagesIDS.push(image._id);
                    }
                }
            }
            return imagesIDS;
        });
    }
    saveImageFile(image) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (image.hasOwnProperty('imagedata')) {
                    image.imagedata.base64 = image.imagedata.base64.replace(/^data:image\/jpeg;base64,/, "");
                    const path = `${process.env.SITE_IMAGE_PATH}${image.uri}.jpg`;
                    yield fs.writeFileSync(path, image.imagedata.base64, 'base64');
                    yield this.createImageFormatAndUpload(image.uri);
                    delete image.imagedata;
                }
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    createSingleImageAndUpload(name, size, suffix) {
        return __awaiter(this, void 0, void 0, function* () {
            const image = yield Jimp.read(`${process.env.SITE_IMAGE_PATH}${name}.jpg`);
            yield image.resize(size.width, size.height);
            let result = yield image.getBufferAsync(Jimp.MIME_JPEG);
            yield fs.writeFileSync(`${process.env.SITE_IMAGE_PATH}${name}${suffix}.jpg`, result);
            yield clientftp.upload(`${process.env.SITE_IMAGE_PATH}${name}${suffix}.jpg`, `${process.env.REMOTE_IMAGES_PATH}${name}${suffix}.jpg`, 755);
        });
    }
    createImageFormatAndUpload(name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.createSingleImageAndUpload(name, { width: 640, height: 640 }, "_thumb");
            yield this.createSingleImageAndUpload(name, { width: 640, height: 640 }, "_normal");
            yield this.createSingleImageAndUpload(name, { width: 1024, height: 1024 }, "_x2");
        });
    }
}
exports.default = ProductController;
//# sourceMappingURL=product.controller.js.map