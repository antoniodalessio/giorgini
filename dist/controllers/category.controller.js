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
const ImageHelper_1 = __importDefault(require("../helpers/ImageHelper"));
class CategoryController extends base_controller_1.default {
    constructor() {
        super();
        this.model = models_1.Category;
        this.imageHelper = new ImageHelper_1.default();
    }
    getAll(req, res) {
        const _super = Object.create(null, {
            getAll: { get: () => super.getAll }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.getAll.call(this, req, res, '');
        });
    }
    get(req, res) {
        const _super = Object.create(null, {
            get: { get: () => super.get }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.get.call(this, req, res, '');
        });
    }
    updateCategoryParent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let category = yield this.model.findOne({ _id: id });
            category.hasSubcategory = true;
            let result = yield models_1.Category.updateOne({ _id: id }, category);
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
                req.body._id = new mongoose_1.Types.ObjectId();
                req.body.published = false;
                req.body.hasSubcategory = false;
                yield this.saveOrUpdateImagePreview(req.body);
                let category = new models_1.Category(req.body);
                let result = yield category.save();
                if (req.body.parent) {
                    this.updateCategoryParent(req.body.parent);
                }
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
                const data = yield models_1.Category.find({ _id: id }).populate('products');
                if (data.length == 0) {
                    res.status(500).json({ error: `resource category with '${id}' doesn't exists` });
                    return;
                }
                req.body.published = false;
                yield this.saveOrUpdateImagePreview(req.body);
                let result = yield models_1.Category.updateOne({ _id: id }, req.body);
                res.status(200).json({ data: result });
            }
            catch (e) {
                res.status(500).json(e);
            }
        });
    }
    saveOrUpdateImagePreview(body) {
        return __awaiter(this, void 0, void 0, function* () {
            if (body.hasOwnProperty('thumb_preview') && typeof body.thumb_preview != "string") {
                yield this.imageHelper.saveImageFile(body.thumb_preview.base64, body.imgName);
                body.thumb_preview = body.imgName;
            }
        });
    }
}
exports.default = CategoryController;
//# sourceMappingURL=category.controller.js.map