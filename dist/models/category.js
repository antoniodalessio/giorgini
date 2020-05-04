"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const category = new mongoose_1.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    meta: {
        title: {},
        description: {},
        keywork: {}
    },
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
    ord: {
        type: Number
    },
    published: {
        type: Boolean
    },
    parent: {
        type: mongoose_1.Schema.Types.ObjectId
    },
    hasSubcategory: {
        type: Boolean,
    }
});
exports.category = category;
category.index({ '$**': 'text' });
//# sourceMappingURL=category.js.map