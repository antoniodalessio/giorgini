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
                let imagesIDS = [];
                if (req.body.images && req.body.images.length > 0) {
                    imagesIDS = req.body.images.map((item) => __awaiter(this, void 0, void 0, function* () {
                        item._id = new mongoose_1.Types.ObjectId();
                        let image = new models_1.Image(item);
                        return (yield image.save())._id;
                    }));
                }
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
                let imagesIDS = data[0].images.map((item) => {
                    return item._id;
                });
                if (req.body.images && req.body.images.length > 0) {
                    let images = req.body.images;
                    for (const element of images) {
                        if (element.hasOwnProperty('_id')) {
                            //update
                            yield models_1.Image.updateOne({ _id: element._id }, element);
                        }
                        else {
                            //Save
                            element._id = new mongoose_1.Types.ObjectId();
                            let image = new models_1.Image(element);
                            yield image.save();
                            imagesIDS.push(element._id);
                        }
                    }
                }
                req.body.images = imagesIDS;
                let result = yield models_1.Product.updateOne({ _id: id }, req.body);
                res.status(200).json(result);
            }
            catch (e) {
                res.status(500).json(e);
            }
        });
    }
}
exports.default = ProductController;
//# sourceMappingURL=product.controller.js.map