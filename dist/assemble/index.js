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
var handlebars = require("handlebars");
var fs = require('fs');
const YAML = require('yaml');
class Assemble {
    constructor(options) {
        this.options = options;
        this.createPartials();
    }
    createPartials() {
        return __awaiter(this, void 0, void 0, function* () {
            let files = fs.readdirSync(this.options.partialsPath);
            files.forEach((file) => __awaiter(this, void 0, void 0, function* () {
                const data = yield fs.readFileSync(`${this.options.partialsPath}${file}`, 'utf8');
                handlebars.partials[file.replace(".hbs", "")] = handlebars.compile(data);
            }));
        });
    }
    setTemplate(name, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const template = yield fs.readFileSync(`${this.options.templatesPath}${name}.hbs`, 'utf8');
                let templateData = this.parseData(template);
                handlebars.partials['body'] = handlebars.compile(templateData.template);
                return templateData.data;
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    render(name, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let template = yield fs.readFileSync(`${this.options.defaultLayout}`, 'utf8');
            let newdata = yield this.setTemplate(name, data);
            template = handlebars.compile(template);
            let result = template(Object.assign(data, newdata));
            yield fs.writeFileSync(`${this.options.defaultFolder}${name}.html`, result);
        });
    }
    parseData(template) {
        let pattern = /---([\s\S]*)---/gim;
        let text = pattern.exec(template);
        let data = {};
        if (text && text.length > 1) {
            data = YAML.parse(text[1]);
        }
        return {
            template: template.replace(pattern, ""),
            data
        };
    }
}
exports.default = Assemble;
//# sourceMappingURL=index.js.map