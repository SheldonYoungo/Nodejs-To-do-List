import { getDate } from './date.js';
import  express  from 'express';
import mongoose  from 'mongoose';

const app = express();

app.use(express.urlencoded({extend: true}));

app.use(express.static('public'));

app.set('view engine', 'ejs');

const port = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/todolistDB')

const itemSchema = {
    name: { type: String, required: true}
};

const Item = mongoose.model('Item', itemSchema);

const item1 = new Item({
    name: 'Welcome to your to do list!'
});

const item2 = new Item({
    name: 'Hit the + button to add a new item'
});

const item3 = new Item({
    name: '<--- Hit the x button to delete an item'
})

const listSchema = {
    name: String,
    items: [itemSchema]
};

const List = mongoose.model('List', listSchema);

const defaultItems = [item1, item2, item3];

app.get('/', async (req, res) => {
    
    let foundItems = await Item.find({});

    if(foundItems.length === 0) {
        Item.insertMany(defaultItems)
        .then(() => console.log('Succesfully saved!'))
        .catch(err => console.log(err))

        res.redirect('/')
    } else {

        res.render('list', {listTitle: getDate(), newListItems: foundItems, route: req.url}); 
    }
});

app.get('/:customRouteName', (req, res) => {
    const customRouteName = req.params.customRouteName;

    List.findOne({name: customRouteName})
        .then(result => {
            if(result === null){
                const list = new List({
                    name: customRouteName,
                    items: defaultItems
                });

                list.save();

                res.render('list', {listTitle: list.name, newListItems:list.items, route: req.url})
            } else {
                res.render('list', {listTitle: result.name, newListItems:result.items, route: req.url})
            }
        })
        .catch(err => console.log(err))
});

app.post('/', async (req, res) => {
    const itemName = req.body.newTask;

    const task = new Item({
        name: itemName
    });
    
    task.save();
    res.redirect('/'); 
})

app.post('/delete', (req, res) => {
    const itemID = req.body.checkbox;

    Item.findByIdAndRemove(itemID)
        .then(() => console.log('Item removed'))
        .catch(err => console.log(err))
        .finally(() => res.redirect('/'))
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})