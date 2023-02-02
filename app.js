const express = require('express');
const port = 3000;
let tasks = []; 

const app = express();

app.use(express.urlencoded({extend: true}));

app.set('view engine', 'ejs'); // App view engine settled to use ejs

app.get('/', (req, res) => {
    let today = new Date();
    let options = {weekday: 'long', day: 'numeric', month: 'long'};
    let day = today.toLocaleDateString('en-us', options)
    
    /* 
        In this case, the response renders the newListItem with the task array empty before the post request because if we try to render it within the post request, 
       the page will try to render it with a nothing in it, sending an error (note that the get request method triggers when we open the page and the post method when a form is submitted, 
       so their scopes are different).
    */  
    res.render('list', {kindOfDay: day, newListItems: tasks}); 
})

app.post('/', (req, res) => {
    item = req.body.newTask;

    tasks.push(item);

    res.redirect('/'); //When the form is submitted, the page redirects the page to the home route again to render the text saved in the tasks array
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})