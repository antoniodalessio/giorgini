var express = require('express')

var expressApp = express();

expressApp.use(express.json());
expressApp.listen(8080, () => {
    console.log('Server running on port 8080!');
});