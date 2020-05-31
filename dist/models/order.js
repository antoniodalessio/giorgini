"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const order = new mongoose_1.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    acquisitionDate: Date,
    orderFulfillmentDate: Date,
    paymentDate: Date,
    price: String,
    comment: String,
});
exports.order = order;
order.index({ '$**': 'text' });
//# sourceMappingURL=order.js.map