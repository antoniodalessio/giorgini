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
const mongoose_1 = require("mongoose");
const SeoHelper_1 = __importDefault(require("../helpers/SeoHelper"));
const ImageHelper_1 = __importDefault(require("../helpers/ImageHelper"));
const models_1 = require("../models/");
class BaseController {
    constructor() {
        this.seoHelper = new SeoHelper_1.default();
        this.imageHelper = new ImageHelper_1.default();
    }
    isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }
    getAll(req, res, populate = '') {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let limit = 0;
                let filter = {};
                let sort = {};
                let range = [];
                if (req.query.hasOwnProperty('filter')) {
                    filter = JSON.parse(req.query.filter);
                    if (filter.hasOwnProperty('id')) {
                        filter._id = Object.assign([], filter.id);
                        delete (filter.id);
                    }
                    if (filter.hasOwnProperty("q")) {
                        //$text: {$search: request.searchtext}
                        filter.$text = { $search: filter.q };
                        delete filter.q;
                    }
                }
                if (req.query.hasOwnProperty('range')) {
                    range = JSON.parse(req.query.range);
                }
                if (req.query.hasOwnProperty('sort')) {
                    const sortTmp = JSON.parse(req.query.sort);
                    sortTmp[1] == 'ASC' ? sort = `${sortTmp[0]}` : sort = `-${sortTmp[0]}`;
                }
                const all = yield this.model.find(filter);
                limit = range[1] - range[0] + 1;
                const data = yield this.model.find(filter).sort(sort).skip(range[0]).limit(limit).populate(populate);
                res.header('Content-Range', all.length);
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json(e);
            }
        });
    }
    get(req, res, populate = '') {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const data = yield this.model.findOne({ _id: id }).populate(populate);
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json(e);
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.body._id = new mongoose_1.Types.ObjectId();
                const model = new this.model(req.body);
                if (req.body.hasOwnProperty('images')) {
                    req.body.images = yield this.saveOrUpdateImages(req.body);
                }
                const result = yield model.save();
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
                const data = yield this.model.find({ _id: id });
                if (data.length == 0) {
                    res.status(404).json({ error: `resource with '${id}' doesn't exists` });
                    return;
                }
                let oldData = data[0].toObject();
                if (oldData.hasOwnProperty('slug') && oldData.slug != req.body.slug) {
                    this.seoHelper.resourceChangeName(`${oldData.slug}.html`, `${req.body.slug}.html`);
                }
                if (req.body.hasOwnProperty('images')) {
                    req.body.images = yield this.saveOrUpdateImages(req.body);
                }
                let result = yield this.model.updateOne({ _id: id }, req.body);
                res.status(200).json({ data: result });
            }
            catch (e) {
                res.status(500).json(e);
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            this.model.deleteOne({ _id: id }, function (err) {
                if (err) {
                    console.log(err);
                    return;
                }
            });
        });
    }
    saveOrUpdateImages(newData) {
        return __awaiter(this, void 0, void 0, function* () {
            let imagesIDS = [];
            if (newData.images && newData.images.length > 0) {
                let images = newData.images;
                for (const image of images) {
                    let imageName = image.hasOwnProperty('uri') ? image.uri : image.file.rawFile.path.replace(".jpeg", "").replace(".jpg", "");
                    // upload image
                    if (image.file.hasOwnProperty('base64')) {
                        yield this.imageHelper.saveImageFile(image.file.base64, imageName);
                        image.uri = imageName;
                    }
                    else {
                        // modify only image name
                        const imageOld = yield models_1.Image.findOne({ _id: image._id });
                        if (imageOld && imageOld.uri != image.uri) {
                            yield this.imageHelper.ftpRename(imageOld.uri, image.uri);
                        }
                    }
                    //update or save
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
}
exports.default = BaseController;
//# sourceMappingURL=base.controller.js.map