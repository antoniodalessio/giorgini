var express = require('express')

var expressApp = express();

expressApp.use(express.json());
expressApp.listen(3000, () => {
    console.log('Server running on port 3000!');
});

expressApp.get('/', async (req, res) => {

})