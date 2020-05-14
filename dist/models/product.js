"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const basePage_1 = require("./basePage");
const product = new mongoose_1.Schema(Object.assign(basePage_1.defaultPageField, {
    _id: mongoose_1.Schema.Types.ObjectId,
    images: [
        { type: mongoose_1.Schema.Types.ObjectId, ref: 'Image' }
    ],
    fabrics: [
        { type: mongoose_1.Schema.Types.ObjectId, ref: 'Fabric' }
    ],
    category: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Category' },
}));
exports.product = product;
product.index({ '$**': 'text' });
//# sourceMappingURL=product.js.map