"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collaborator = void 0;
const mongoose_1 = require("mongoose");
const basePage_1 = require("./basePage");
const collaborator = new mongoose_1.Schema(Object.assign(basePage_1.defaultPageField, {
    _id: mongoose_1.Schema.Types.ObjectId,
    images: [
        { type: mongoose_1.Schema.Types.ObjectId, ref: 'Image' }
    ],
    appellation: {
        type: String
    },
    name: {
        type: String
    },
    text: {
        type: String
    },
    order: {
        type: Number
    }
}));
exports.collaborator = collaborator;
collaborator.index({ '$**': 'text' });
//# sourceMappingURL=collaborator.js.map