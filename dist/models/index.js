"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const category_1 = require("./category");
const product_1 = require("./product");
const image_1 = require("./image");
let Category = mongoose_1.model('Category', category_1.category);
exports.Category = Category;
let Product = mongoose_1.model('Product', product_1.product);
exports.Product = Product;
let Image = mongoose_1.model('Image', image_1.image);
exports.Image = Image;
//# sourceMappingURL=index.js.map