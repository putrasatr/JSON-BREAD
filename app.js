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
    res.render('index.ejs', {
        data
    })

});

// router.get('/', function (req, res, next) {
//     const page = req.query.page || 1
//     const url = req.url == '/' ? '/?page=1' : req.url
//     const limit = 3
//     const offset = (page - 1) * limit

//     let params = []
//     let paramsSql = []

//     if (req.query.nama) {
//       params.push(req.query.nama)
//       paramsSql.push(`nama ilike '%' || $${params.length} || '%'`)
//     }

//     if (req.query.umur) {
//       params.push(Number(req.query.umur))
//       paramsSql.push(`umur = $${params.length}`)
//     }

//     if (req.query.isjomblo) {
//       params.push(JSON.parse(req.query.isjomblo))
//       paramsSql.push(`isjomblo = $${params.length}`)
//     }

//     let sql = `SELECT count(*) as total FROM murid`
//     if (params.length > 0) sql += ` where ${paramsSql.join(' AND ')}`
//     console.log(sql)

//     pool.query(sql, params, (err, data) => {
//       if (err) return res.send('error pertama')
//       const total = data.rows[0].total;
//       const pages = Math.ceil(total / limit)


//       sql = sql.replace('count(*) as total', '*');
//       params.push(limit)
//       params.push(offset)
//       sql += ` limit $${params.length - 1} offset $${params.length}`
//       console.log(sql)

//       pool.query(sql, params, (err, data) => {
//         if (err) return res.send(err)
//         res.render('index', { data: data.rows, page, pages, query: req.query, url })
//       })
//     })
//   });

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


app.post('/search', (req, res) => {
    const page = req.query.page || 1;
    const limit = 5;
    const offset = (page - 1) * limit;
    const url = req.url == '/' ? '/?page=1' : req.url

    let params = [];
    let isFilter = false;

    if (req.query.checkid && req.query.formid) {
        params.push(`id=${req.query.formid}`);
        isFilter = true;
    }
    if (req.query.checkstring && req.query.formstring) {
        params.push(`string like '%${req.query.formstring}%'`);
        isFilter = true;
    }
    if (req.query.checkinteger && req.query.forminteger) {
        params.push(`integer=${req.query.forminteger}`);
        isFilter = true;
    }
    if (req.query.checkfloat && req.query.formfloat) {
        params.push(`float=${req.query.formfloat}`);
        isFilter = true;
    }
    if (req.query.checkdate && req.query.formdate && req.query.formenddate) {
        params.push(`date between '${req.query.formdate}' and '${req.query.formenddate}'`);
        isFilter = true;
    }
    if (req.query.checkboolean && req.query.boolean) {
        params.push(`boolean='${req.query.boolean}'`);
        isFilter = true;
    }

    let sql = `select count(*) as total from users`;
    if (isFilter) {
        sql += ` where ${params.join(' and ')}`
        console.log(params)
    }

    app.get(sql, (err, count) => {
        const total = count.total;
        console.log(count.total)
        const pages = Math.ceil(total / limit);
        sql = `select * from users`;
        if (isFilter) {
            sql += ` where ${params.join(' and ')}`
        }
        sql += ` limit ${limit} offset ${offset}`;

        db.all(sql, (err, rows) => {
            res.render('index.ejs', {
                rows,
                page,
                pages,
                query: req.query,
                url
            });
        });
    });

});

//Delete
app.get('/delete/:id', function (req, res, next) {
    let id = req.params.id;
    data.splice(id, 1);
    writeData(data);
    res.redirect('/');
});

app.listen(port, () => { console.info(`Anda sedang berjalan di port ${port}`) })