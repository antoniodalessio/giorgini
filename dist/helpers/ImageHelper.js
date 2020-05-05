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
var fs = require('fs');
var Jimp = require('jimp');
const ftp_1 = __importDefault(require("./../utils/ftp"));
var clientftp = new ftp_1.default(process.env.FTP_HOST, 21, process.env.FTP_USER, process.env.FTP_PWD, false);
class ImageHelper {
    saveImageFile(imageBase64, name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                imageBase64 = imageBase64.replace(/^data:image\/jpeg;base64,/, "");
                const path = `${process.env.SITE_IMAGE_PATH}${name}.jpg`;
                yield fs.writeFileSync(path, imageBase64, 'base64');
                yield this.createImageFormatAndUpload(name);
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    createSingleImageAndUpload(name, size, suffix) {
        return __awaiter(this, void 0, void 0, function* () {
            const image = yield Jimp.read(`${process.env.SITE_IMAGE_PATH}${name}.jpg`);
            yield image.resize(size.width, size.height);
            let result = yield image.getBufferAsync(Jimp.MIME_JPEG);
            yield fs.writeFileSync(`${process.env.SITE_IMAGE_PATH}${name}${suffix}.jpg`, result);
            yield clientftp.upload(`${process.env.SITE_IMAGE_PATH}${name}${suffix}.jpg`, `${process.env.REMOTE_IMAGES_PATH}${name}${suffix}.jpg`, 755);
        });
    }
    createImageFormatAndUpload(name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.createSingleImageAndUpload(name, { width: 640, height: 640 }, "_thumb");
            yield this.createSingleImageAndUpload(name, { width: 640, height: 640 }, "_normal");
            yield this.createSingleImageAndUpload(name, { width: 1024, height: 1024 }, "_x2");
        });
    }
}
exports.default = ImageHelper;
//# sourceMappingURL=ImageHelper.js.map