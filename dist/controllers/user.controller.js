"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_controller_1 = __importDefault(require("./base.controller"));
const models_1 = require("../models/");
class UserController extends base_controller_1.default {
    constructor() {
        super();
        this.model = models_1.User;
    }
}
exports.default = UserController;
//# sourceMappingURL=user.controller.js.map