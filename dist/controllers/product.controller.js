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
const models_1 = require("../models/");
const mongoose_1 = require("mongoose");
class ProductController {
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield models_1.Product.find().populate('images');
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json(e);
            }
        });
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const data = yield models_1.Product.findOne({ _id: id }).populate('images');
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json(e);
            }
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