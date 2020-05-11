"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const page = new mongoose_1.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    meta: {
        title: {
            type: String,
        },
        description: {
            type: String,
        },
        keywork: {
            type: String,
        }
    },
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
    ord: {
        type: Number
    },
    published: {
        type: Boolean
    }
});
exports.page = page;
page.index({ '$**': 'text' });
//# sourceMappingURL=page.js.map