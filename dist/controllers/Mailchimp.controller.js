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
var Mailchimp = require('mailchimp-api-v3');
var mailchimp = new Mailchimp(process.env.MAILCHIMP_TOKEN);
class MailchimpController {
    constructor() {
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    saveEmailAddress(email_address) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(email_address);
            try {
                const useregistered = yield mailchimp.post(`/lists/${process.env.MAILCHIMP_LIST}/members`, {
                    email_address: email_address,
                    status: 'subscribed'
                });
                console.log("useregistered", useregistered);
                if (useregistered.id) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (e) {
                console.log(e);
                return false;
            }
        });
    }
    saveEmailAddressPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.saveEmailAddress(req.body.email);
            try {
                if (response) {
                    res.status(200).json({ result: response });
                }
                else {
                    res.status(406).json({ result: response });
                }
            }
            catch (e) {
                res.status(406).json(e);
            }
        });
    }
}
exports.default = MailchimpController;
//# sourceMappingURL=Mailchimp.controller.js.map