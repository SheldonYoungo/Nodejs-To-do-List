const express = require('express');
const port = 3000;

const app = express();

app.set('view engine', 'ejs'); // App view engine settled to use ejs

app.get('/', (req, res) => {

    let today = new Date();
    let day = new Date().toLocaleDateString('en-us', {weekday: 'long'});
    
    res.render('list', {kindOfDay: day});
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})