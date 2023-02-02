const express = require('express');
const port = 3000;

const app = express();

app.use(express.urlencoded({extend: true}));

app.set('view engine', 'ejs'); // App view engine settled to use ejs

app.get('/', (req, res) => {
    let today = new Date();
    let options = {weekday: 'long', day: 'numeric', month: 'long'};
    let day = today.toLocaleDateString('en-us', options)
    
    res.render('list', {kindOfDay: day});
})

app.post('/', (req, res) => {
    console.log(req.body.newTask);
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})