require('dotenv').config()
const express = require('express')
var fs = require('fs');

const expressApp = express();
var handlebars = require("handlebars");

const FTP = require('./utils/ftp');

var clientftp = new FTP(process.env.FTP_HOST, 21, process.env.FTP_USER, process.env.FTP_PWD, false, fs);

expressApp.use(express.json());
expressApp.listen(15645, () => {
    console.log('Server running on port 15645!');
});

expressApp.get('/', async (req, res) => {

    var source = "<p>Hello, my name is {{name}}. I am from {{hometown}}. I have " +
             "{{kids.length}} kids:</p>" +
             "<ul>{{#kids}}<li>{{name}} is {{age}}</li>{{/kids}}</ul>";
    var template = handlebars.compile(source);
    
    var data = { "name": "Alan", "hometown": "Somewhere, TX",
                "kids": [{"name": "Jimmy", "age": "12"}, {"name": "Sally", "age": "4"}]};
    var result = template(data);
    let text = "nessuno";

    fs.writeFile(`${process.env.SITE_PATH}/helloworld.html`, result, function (err) {
        text = err;
        if (err) return console.log(err);
        
        clientftp.upload(`${process.env.SITE_PATH}/helloworld.html`, './www.amaliacardo.it/test/helloworld.html', 755);
        
    });


    res.end(text);
})