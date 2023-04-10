import { getDate } from './date.js';
import  express  from 'express';

const port = 3000;
let tasks = []; 
let workTasks = [];

const app = express();

app.use(express.urlencoded({extend: true}));

app.use(express.static('public'));

app.set('view engine', 'ejs'); //Here we say that view engine should be replaced with ejs (which is to reduce the repeated things like html files)

app.get('/', (req, res) => {
    /* 
        In this case, the response renders the newListItem with the task array empty before the post request because if we try to render it within the post request, 
       the page will try to render it with nothing in it, sending an error (note that the get request method triggers when we open the page and the post method when a form is submitted, 
       so their scopes are different).
    */  
    res.render('list', {listTitle: getDate(), newListItems: tasks, route: req.url}); 
});


app.post('/', (req, res) => {
    let item = req.body.newTask;
    const btnValue = req.body.button;
    
    if(item !== '' &&  btnValue === 'submit') {
        
        tasks.push(item);
        res.redirect('/'); //When the form is submitted, the page redirects to the home route again to render the text saved in the tasks array
        
    } else if(item !== '' && btnValue === 'delete') {
        
        tasks.splice( -1, 1);
        res.redirect('/');

    }
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})