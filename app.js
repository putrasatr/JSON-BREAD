const express = require('express');
const path = require('path');
const app = express()
const fs = require('fs')
const bodyParser = require('body-parser');
const port = 3000


//render tampilan
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

//Parsing JSON
app.use(bodyParser.json());
app.use(express.urlencoded({
    extended: false
}));
let data = JSON.parse(fs.readFileSync(path.join(__dirname, './db/data.json'), 'utf8'));

const writeData = (data) => {
    fs.writeFileSync('./db/data.json', JSON.stringify(data, null, 3));
}

//Rendering Home
function getDataFiltered(data, params) {
    let result = []
    if ("id" in params[0]) return [data[params[0]["id"]]]
    return data.filter((i, idx) => {
        i["index"] = idx
        for (const key in params[0]) {
            // console.log(key,params[0][key],i[key],params[0][key].includes(i[key]))
            if (params[0][key].includes(i[key])) {
                i["status"] == false ? i["status"] = false : i["status"] = true
                result.push(i)
            } else {
                i["status"] = false
            }
        }
        return result
    }).filter(item => item.status)
}
app.get('/', function (req, res, next) {
    let data = JSON.parse(fs.readFileSync(path.join(__dirname, './db/data.json'), 'utf8'));
    let page = req.query.page || 1
    let params = []
    const url = req.url == '/' ? "/?page=1" : req.url
    const limit = 5;
    const offset = (page - 1) * limit
    const {
        index,
        checkid,
        string,
        checkString,
        integer,
        checkInteger,
        float,
        checkFloat,
        start_date,
        end_date,
        checkDate,
        boolean,
        checkBoolean
    } = req.query
    if (index && checkid) {
        params.length > 0 ? params[0]["id"] = index : params.push({ id: index })
    }
    if (string && checkString) {
        params.length > 0 ? params[0]["string"] = string : params.push({ string })
    }
    if (integer && checkInteger) {
        params.length > 0 ? params[0]["integer"] = integer : params.push({ integer })
    }
    if (float && checkFloat) {
        params.length > 0 ? params[0]["float"] = float : params.push({ float })

    }
    if (start_date && checkDate) {
        params.length > 0 ? params[0]["start_date"] = start_date : params.push({ start_date })

    }
    if (end_date && checkDate) {
        params.length > 0 ? params[0]["end_date"] = end_date : params.push({ end_date })

    }
    if (boolean && checkBoolean) {
        params.length > 0 ? params[0]["boolean"] = boolean : params.push({ boolean })
    }
    let total;
    let dataFiltered;
    if (params.length > 0) {
        let result = []
        total = getDataFiltered(data, params).length
        dataFiltered = getDataFiltered(data, params).splice(offset, limit)
    } else {
        total = data.length
        dataFiltered = data.map((i, idx) => { i["index"] = idx; return i }).splice(offset, limit)
    }
    console.log(dataFiltered)
    const pages = Math.ceil(total / limit)
    res.render('index.ejs', {
        data: dataFiltered,
        query: req.query,
        url,
        pages,
        page: parseInt(page),
        limit,
        offset
    })

});

//Add 
app.get('/add', function (req, res, next) {
    res.render('add.ejs');
});

app.post('/add', function (req, res) {
    let data = JSON.parse(fs.readFileSync(path.join(__dirname, './db/data.json'), 'utf8'));
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
    let data = JSON.parse(fs.readFileSync(path.join(__dirname, './db/data.json'), 'utf8'));
    let id = req.params.id - 1;
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
        boolean: req.body.boolean
    }
    writeData(data);
    res.redirect('/');
})

//Delete
app.get('/delete/:id', function (req, res, next) {
    let data = JSON.parse(fs.readFileSync(path.join(__dirname, './db/data.json'), 'utf8'));
    let id = req.params.id -1;
    data.splice(id, 1);
    writeData(data);
    res.redirect('/');
});

app.listen(port, () => { console.info(`Anda sedang berjalan di port ${port}`) })