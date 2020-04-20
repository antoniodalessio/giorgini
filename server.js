var express = require('express')

var expressApp = express();

expressApp.use(express.json());
expressApp.listen(8124, () => {
    console.log('Server running on port 8124!');
});

expressApp.get('/', async (req, res) => {
    res.end('Hello World\n');
})