"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const routes = require('express').Router();
const category_controller_1 = __importDefault(require("../controllers/category.controller"));
const product_controller_1 = __importDefault(require("../controllers/product.controller"));
const builder_controller_1 = __importDefault(require("../controllers/builder.controller"));
const image_controller_1 = __importDefault(require("../controllers/image.controller"));
function initApiRoutes() {
    let categoryCTRL = new category_controller_1.default();
    let productCTRL = new product_controller_1.default();
    let builderCTRL = new builder_controller_1.default();
    let imageCTRL = new image_controller_1.default();
    routes.use((req, res, next) => verifyToken(req, res, next));
    routes.get('/category', (req, res) => __awaiter(this, void 0, void 0, function* () { yield categoryCTRL.getAll(req, res); }));
    routes.get('/category/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield categoryCTRL.get(req, res); }));
    routes.post('/category', (req, res) => __awaiter(this, void 0, void 0, function* () { yield categoryCTRL.save(req, res); }));
    routes.put('/category/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield categoryCTRL.update(req, res); }));
    routes.delete('/category/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield categoryCTRL.delete(req, res); }));
    routes.get('/product', (req, res) => __awaiter(this, void 0, void 0, function* () { yield productCTRL.getAll(req, res); }));
    routes.get('/product/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield productCTRL.get(req, res); }));
    routes.post('/product', (req, res) => __awaiter(this, void 0, void 0, function* () { yield productCTRL.save(req, res); }));
    routes.put('/product/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield productCTRL.update(req, res); }));
    routes.delete('/product/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield productCTRL.delete(req, res); }));
    routes.get('/image', (req, res) => __awaiter(this, void 0, void 0, function* () { yield imageCTRL.getAll(req, res); }));
    routes.get('/image/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield imageCTRL.get(req, res); }));
    routes.post('/image', (req, res) => __awaiter(this, void 0, void 0, function* () { yield imageCTRL.save(req, res); }));
    routes.put('/image/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield imageCTRL.update(req, res); }));
    routes.delete('/image/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield imageCTRL.delete(req, res); }));
    routes.get('/publish', (req, res) => __awaiter(this, void 0, void 0, function* () { yield builderCTRL.publish(req, res); }));
}
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (bearerHeader) {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }
    else {
        // Forbidden
        res.sendStatus(403);
    }
}
exports.default = () => {
    initApiRoutes();
    return routes;
};
//# sourceMappingURL=api.js.map