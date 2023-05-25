// Importando dependecias
import { getDate } from './date.js';
import  express  from 'express';
import mongoose  from 'mongoose';
import lodash from 'lodash';
import {} from 'dotenv/config';

const app = express();

app.use(express.urlencoded({extend: true}));

app.use(express.static('public'));

app.set('view engine', 'ejs'); //Seteando a EJS como motor de vista

mongoose.connect(process.env.URI); //Conexión a base de datos

// Creación de esquemas y modelos
const itemSchema = {
    name: { type: String, required: true}
};

const Item = mongoose.model('Item', itemSchema);

const listSchema = {
    name: String,
    items: [itemSchema]
};

const List = mongoose.model('List', listSchema);

// Creación de items por defecto
const item1 = new Item({
    name: 'Welcome to your to do list!'
});

const item2 = new Item({
    name: 'Hit the + button to add a new item'
});

const item3 = new Item({
    name: '<--- Hit the x button to delete an item'
})

const defaultItems = [item1, item2, item3];

/* Esta petición se ejecuta cada vez que se entra por primera vez a la página,
    creando una lista con la fecha actual */
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


/* Este metodo recibe una peticion get para una lista personalizada. Primero verifica si dicha lista existe dentro 
    de la base de datos, en caso de no existir crea una nueva lista con el nombre indicado y los items por defecto y
    la renderiza, y en caso contrario simplemente renderiza la lista encontrada en la base de datos */
app.get('/:customRouteName', (req, res) => {
    const customRouteName = lodash.capitalize(req.params.customRouteName);

    List.findOne({name: customRouteName})
        .then((result) => {
            if(!result){
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

/* Se postea la nueva tarea asignada. Primero se verifica si es la lista por defecto (que lleva de nombre la fecha actual)
    y, en caso de ser verdadero, simplemente se guarda la nueva tarea en la base de datos; de no ser la lista por defecto
    se busca en la base de datos la lista donde se hizo la petición y una vez encontrada se pushea la tarea en el campo items
    y se guarda el cambio, redireccionando finalmente a la lista donde se hizo la petición. */
app.post('/', async (req, res) => {
    const itemName = req.body.newTask;
    const listName = req.body.button;

    const task = new Item({
        name: itemName
    });

    if(listName === getDate()){
        task.save();
        res.redirect('/');
        
    } else {
        List.findOne({name: listName})
            .then(foundList => {
                foundList.items.push(task);
                foundList.save();
                res.redirect(`/${listName}`)
            })
            .catch(err => console.log(err))
    }
})

/* Este petición post se ejecuta cada vez que se hace click en un checkbox, señalando que la tarea ha sido completada
    y eliminando de la base de datos dicha tarea completada */
app.post('/delete', async (req, res) => {
    const itemID = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === getDate()){
        Item.findByIdAndRemove(itemID)
            .catch(err => console.log(err))
            .finally(() => res.redirect('/'))
    } else {
        List.findOneAndUpdate(
            {name: listName},
            {$pull: {items: {_id: itemID}}}
        )
        .then(() => res.redirect(`/${listName}`))
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})