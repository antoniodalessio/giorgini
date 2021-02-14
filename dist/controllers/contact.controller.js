"use strict";
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
}
exports.default = ContactController;
//# sourceMappingURL=contact.controller.js.map