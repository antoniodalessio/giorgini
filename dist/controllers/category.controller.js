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
class CategoryController extends base_controller_1.default {
    constructor() {
        super();
        this.model = models_1.Category;
    }
    getAll(req, res) {
        const _super = Object.create(null, {
            getAll: { get: () => super.getAll }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.getAll.call(this, req, res, 'products');
        });
    }
    get(req, res) {
        const _super = Object.create(null, {
            get: { get: () => super.get }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.get.call(this, req, res, 'products');
        });
    }
    save(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield models_1.Category.find({ slug: req.body.slug });
                if (data.length != 0) {
                    res.status(500).json({ error: `resource with a '${req.body.slug}' slug already exists` });
                    return;
                }
                let productsIDS = [];
                if (req.body.products && req.body.products.length > 0) {
                    productsIDS = req.body.products.map((item) => __awaiter(this, void 0, void 0, function* () {
                        item._id = new mongoose_1.Types.ObjectId();
                        let product = new models_1.Product(item);
                        return (yield product.save())._id;
                    }));
                }
                req.body._id = new mongoose_1.Types.ObjectId();
                let category = new models_1.Category(req.body);
                let result = yield category.save();
                // La richiesta è stata soddisfatta, restituendo la creazione di una nuova risorsa.
                res.status(201).json(result);
            }
            catch (e) {
                res.status(500).json(e);
            }
        });
    }
    updateRecursively() {
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const data = yield models_1.Category.find({ _id: id }).populate('products');
                if (data.length == 0) {
                    res.status(500).json({ error: `resource category with '${id}' doesn't exists` });
                    return;
                }
                let productsIDS = data[0].products.map((item) => {
                    return item._id;
                });
                if (req.body.products && req.body.products.length > 0) {
                    let products = req.body.products;
                    for (const element of products) {
                        if (element.hasOwnProperty('_id')) {
                            //update
                            yield models_1.Product.updateOne({ _id: element._id }, element);
                        }
                        else {
                            //Save
                            element._id = new mongoose_1.Types.ObjectId();
                            let product = new models_1.Product(element);
                            yield product.save();
                            productsIDS.push(element._id);
                        }
                    }
                }
                req.body.products = productsIDS;
                let result = yield models_1.Category.updateOne({ _id: id }, req.body);
                res.status(200).json(result);
            }
            catch (e) {
                res.status(500).json(e);
            }
        });
    }
}
exports.default = CategoryController;
//# sourceMappingURL=category.controller.js.map