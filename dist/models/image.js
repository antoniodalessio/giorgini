"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const image = new mongoose_1.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    alt: {
        type: String,
    },
    uri: {
        type: String
    }
});
exports.image = image;
//# sourceMappingURL=image.js.map