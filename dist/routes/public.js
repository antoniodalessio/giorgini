"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const routes = require('express').Router();
const contact_controller_1 = __importDefault(require("../controllers/contact.controller"));
function initPublicRoutes() {
    const contactCTRL = new contact_controller_1.default();
    //routes.post('/contact', async (req: any, res: any) => { await contactCTRL.contact(req, res)} )
    //routes.post('/comment', async (req: any, res: any) => { await contactCTRL.comment(req, res)} )
}
exports.default = () => {
    initPublicRoutes();
    return routes;
};
//# sourceMappingURL=public.js.map