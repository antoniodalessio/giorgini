"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const product = new mongoose_1.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    title: {
        type: String,
        required: '{PATH} is required!'
    },
    description: {
        type: String
    },
    slug: {
        type: String,
        lowercase: true,
        trim: true,
        required: '{PATH} is required!'
    },
    images: [
        { type: mongoose_1.Schema.Types.ObjectId, ref: 'Image' }
    ],
    category: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Category' },
});
exports.product = product;
//# sourceMappingURL=product.js.map