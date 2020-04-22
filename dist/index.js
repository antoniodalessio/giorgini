var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express = require('express');
var fs = require('fs');
const expressApp = express();
var handlebars = require("handlebars");
const FTP = require('./utils/ftp');
var clientftp = new FTP("ftp.amaliacardo.it", 21, "7489922@aruba.it", "password1846", false, fs);
expressApp.use(express.json());
expressApp.listen(15645, () => {
    console.log('Server running on port 15645!');
});
expressApp.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    var source = "<p>Hello, my name is {{name}}. I am from {{hometown}}. I have " +
        "{{kids.length}} kids:</p>" +
        "<ul>{{#kids}}<li>{{name}} is {{age}}</li>{{/kids}}</ul>";
    var template = handlebars.compile(source);
    var data = { "name": "Alan", "hometown": "Somewhere, TX",
        "kids": [{ "name": "Jimmy", "age": "12" }, { "name": "Sally", "age": "4" }] };
    var result = template(data);
    let text = "nessuno";
    fs.writeFile('/mnt/helloworld.html', result, function (err) {
        text = err;
        if (err)
            return console.log(err);
        clientftp.upload('/mnt/helloworld.html', './www.amaliacardo.it/test/helloworld.html', 755);
    });
    res.end(text);
}));
//# sourceMappingURL=index.js.map