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
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("./../models");
var crypto = require('crypto');
class LoginController {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = req.body;
            const hash = this.toHash(username, password);
            let result = yield models_1.User.find({ hash });
            if (result.length > 0) {
                let token = this.createRandomToken();
                result[0].token = token;
                yield models_1.User.updateOne({ _id: result[0]._id }, result[0]);
                res.status(200).json({ token });
            }
            else {
                res.status(403).json({ error: '' });
            }
        });
    }
    checkAuth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.body.token;
            let result = yield models_1.User.find({ token });
            if (result.length > 0) {
                res.status(200).json({ message: "User authenticated" });
            }
            else {
                res.status(403).json({ error: '' });
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.body.token;
            let result = yield models_1.User.find({ token });
            result[0].token = "";
            yield models_1.User.updateOne({ _id: result[0]._id }, result[0]);
            res.status(200).json({ message: "logout" });
        });
    }
    toHash(username, password) {
        return crypto.createHash('sha256').update(`${username}${password}`).digest('base64');
    }
    createRandomToken() {
        return crypto.randomBytes(64).toString('hex');
    }
}
exports.default = LoginController;
//# sourceMappingURL=login.controller.js.map