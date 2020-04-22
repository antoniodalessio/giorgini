const express = require('express')

const expressApp = express();

expressApp.use(express.json());
expressApp.listen(15645, () => {
    console.log('Server running on port 15645!');
});

expressApp.get('/', async (req, res) => {
    res.end('Hello new World\n');
})