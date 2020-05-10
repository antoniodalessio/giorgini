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
const nodemailer = require("nodemailer");
const fetch = require('node-fetch');
let transporter = nodemailer.createTransport({
    host: "smtps.aruba.it",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PWD
    }
});
class ContactController {
    sendEmailToInfo(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let info = yield transporter.sendMail({
                from: `"${data.name} 👻" <${data.email}>`,
                to: `info@amaliacardo.it`,
                subject: "Richiesta informazioni dal sito amaliacardo.it",
                text: `${data.message}`,
                html: ''
            });
            return info;
        });
    }
    sendEmailToContact(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let info = yield transporter.sendMail({
                from: `"${data.name}" <info@amaliacardo.it>`,
                to: `${data.email}`,
                subject: "Richiesta informazioni dal sito amaliacardo.it",
                text: '',
                html: `Grazie ${data.name} per avermi contattato. Risponderò a breve alla tua richiesta:<br/><span style="font-size:10px; color: #999">${data.message}<span><br/><br/>Amalia Cardo`
            });
            return info;
        });
    }
    contact(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            fetch("https://www.google.com/recaptcha/api/siteverify", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `secret=${process.env.RECAPTCHA_TOKEN}&response=${req.body['g-recaptcha-response']}`
            })
                .then((result) => result.json())
                .then((result) => __awaiter(this, void 0, void 0, function* () {
                let sendEmailContactRes;
                let sendEmailInfoRes;
                if (result.success) {
                    console.log(req.body, result);
                    sendEmailInfoRes = yield this.sendEmailToInfo(req.body);
                    sendEmailContactRes = yield this.sendEmailToContact(req.body);
                    res.status(200).json({ result, sendEmailContactRes, sendEmailInfoRes });
                }
                else {
                    res.status(406).json({ result, sendEmailContactRes, sendEmailInfoRes });
                }
            }))
                .catch((e) => {
                res.status(406).json(e);
            });
        });
    }
}
exports.default = ContactController;
//# sourceMappingURL=contact.controller.js.map