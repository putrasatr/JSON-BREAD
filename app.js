const express = require('express');
const path = require('path');
const app = express()
const fs = require('fs')
const bodyParser = require('body-parser')
const port = 3000


//render tampilan
app.set('views', path.join(__dirname, ''));
app.set('view engine', 'ejs');

let data = JSON.parse(fs.readFileSync(path.join(__dirname, './db/data.json'), 'utf8'));

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
    res.render('index.ejs', {
        data
    })

});

//Add 
app.get('/add', function (req, res, next) {
    res.render('add.ejs');
});

app.post('/add', function (req, res) {
    data.push({
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
    res.render('edit.ejs', {
        item: data[id],
        id: id
    });
});

app.post('/edit/:id', function (req, res) {
    let idx = req.params.id;
    data[idx] = {
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
    data.splice(id, 1);
    writeData(data);
    res.redirect('/');
});

app.listen(port, () => { console.info(`Anda sedang berjalan di port ${port}`) })