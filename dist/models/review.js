"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const review = new mongoose_1.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    comment: {
        type: String,
    },
    username: {
        type: String,
    },
    city: {
        type: String,
    },
    publishedAt: Date,
    product: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'Product'
    }
});
exports.review = review;
review.index({ '$**': 'text' });
//# sourceMappingURL=review.js.map