"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const category = new mongoose_1.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    title: {
        type: String,
        required: '{PATH} is required!'
    },
    description: {
        type: String
    },
    text: {
        type: String
    },
    category_name: {
        type: String
    },
    thumb_preview: {
        type: String
    },
    slug: {
        type: String,
        lowercase: true,
        trim: true,
        required: '{PATH} is required!'
    },
    products: [
        { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product' }
    ]
});
exports.category = category;
//# sourceMappingURL=category.js.map