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
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const page_controller_1 = __importDefault(require("../controllers/page.controller"));
const story_controller_1 = __importDefault(require("../controllers/story.controller"));
const builder_controller_1 = __importDefault(require("../controllers/builder.controller"));
const image_controller_1 = __importDefault(require("../controllers/image.controller"));
const service_controller_1 = __importDefault(require("../controllers/service.controller"));
const collaborator_controllerr_1 = __importDefault(require("../controllers/collaborator.controllerr"));
function initApiRoutes() {
    let userCTRL = new user_controller_1.default();
    let pageCTRL = new page_controller_1.default();
    let builderCTRL = new builder_controller_1.default();
    let imageCTRL = new image_controller_1.default();
    let storyCTRL = new story_controller_1.default();
    let serviceCTRL = new service_controller_1.default();
    let collaboratorCTRL = new collaborator_controllerr_1.default();
    routes.use((req, res, next) => verifyToken(req, res, next));
    createDefaultRoutes("user", userCTRL);
    createDefaultRoutes("page", pageCTRL);
    createDefaultRoutes("story", storyCTRL);
    createDefaultRoutes("service", serviceCTRL);
    createDefaultRoutes("collaborator", collaboratorCTRL);
    createDefaultRoutes("image", imageCTRL);
    routes.get('/publish', (req, res) => __awaiter(this, void 0, void 0, function* () { yield builderCTRL.publish(req, res); }));
}
function createDefaultRoutes(route, controller) {
    routes.get(`/${route}`, (req, res) => __awaiter(this, void 0, void 0, function* () { yield controller.getAll(req, res); }));
    routes.get(`/${route}/:id`, (req, res) => __awaiter(this, void 0, void 0, function* () { yield controller.get(req, res); }));
    routes.post(`/${route}`, (req, res) => __awaiter(this, void 0, void 0, function* () { yield controller.create(req, res); }));
    routes.put(`/${route}/:id`, (req, res) => __awaiter(this, void 0, void 0, function* () { yield controller.update(req, res); }));
    routes.delete(`/${route}/:id`, (req, res) => __awaiter(this, void 0, void 0, function* () { yield controller.delete(req, res); }));
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