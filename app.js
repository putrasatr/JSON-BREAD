const express = require('express');
const path = require('path');
const app = express()
const fs = require('fs')
const bodyParser = require('body-parser')
const port = 3000


//render tampilan
app.set('views', path.join(__dirname, ''));
app.set('view engine', 'ejs');

let data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8'));

let writeData = (data) => {
    fs.writeFileSync('data.json', JSON.stringify(data, null, 3));
}

app.use(express.static(path.join(__dirname, 'public')));

//Parsing JSON
app.use(bodyParser.json());
app.use(express.urlencoded({
    extended: false
}));

//Rendering Home
app.get('/', function (req, res, next) {
    const page = req.params.page || 1
    const limit = 3
    const offset = (page - 1) * limit;
    const url = req.url == '/' ? '/?page=1' : req.url

    const { index, string, integer, float, boolean } = req.query

    let dataFiltered = [];
    let onSearch = false
    data.map((item, idx) => {
        if (item.id == index) {
            onSearch = true
            dataFiltered.push(item)
        }
        if (item.string == string) {
            onSearch = true
            dataFiltered.push(item)
        }
        if (item.integer == integer) {
            onSearch = true
            dataFiltered.push(item)
        }
        if (item.float == float) {
            onSearch = true
            dataFiltered.push(item)
        }
        if (item.boolean.toString() == boolean && boolean != 'none') {
            onSearch = true
            dataFiltered.push(item)
        }
    })
    const total = data.length;
    // const i = data.splice(offset, limit)

    const pages = Math.ceil(total / limit);

    res.render('index.ejs', {
        dataFiltered,
        data,
        onSearch,
        page,
        pages,
        url
    })

});

//Add 
app.get('/add', function (req, res, next) {
    res.render('add.ejs');
});

app.post('/add', function (req, res) {
    console.log(data.length)
    let count = data.length == 0 ? 0 : data[data.length - 1].id
    data.push({
        id: Number(count) + 1,
        string: req.body.string,
        integer: parseInt(req.body.integer),
        float: parseFloat(req.body.float),
        date: req.body.date,
        boolean: JSON.parse(req.body.boolean)
    });
    writeData(data);
    res.redirect('/');
})

//Edit
app.get('/edit/:id', function (req, res, next) {
    let id = req.params.id;
    let item;
    data.map((items, index) => {
        if (items.id == id) item = items
    })
    res.render('edit.ejs', {
        item,
        id
    });
});

app.post('/edit/:id', function (req, res) {
    let idx = req.params.id;
    let id;
    data.map((item, index) => {
        if (item.id == idx) id = index
    })
    data[id] = {
        id: idx,
        string: req.body.string,
        integer: parseInt(req.body.integer),
        float: parseFloat(req.body.float),
        date: req.body.date,
        boolean: JSON.parse(req.body.boolean)
    }
    writeData(data);
    res.redirect('/');
})


//Delete
app.get('/delete/:id', function (req, res, next) {
    let id = req.params.id;
    let idx;
    data.map((item, index) => {
        if (item.id == id) idx = index
    })
    data.splice(idx, 1);
    writeData(data);
    res.redirect('/');
});

app.listen(port, () => { console.info(`Anda sedang berjalan di port ${port}`) })