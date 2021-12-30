const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");
const {
  getDataFiltered,
  getSortedData,
  generateIndex,
  getKasKus,
} = require("./helpers");
const port = 3007;

//render tampilan
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

//Parsing JSON
app.use(bodyParser.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
let data = JSON.parse(
  fs.readFileSync(path.join(__dirname, "./db/data.json"), "utf8")
);

const writeData = (data) => {
  fs.writeFileSync("./db/data.json", JSON.stringify(data, null, 3));
};

//Rendering Home
app.get("/", function (req, res, next) {
  let data = JSON.parse(
    fs.readFileSync(path.join(__dirname, "./db/data.json"), "utf8")
  );
  let page = req.query.page || 1;
  let params = [];
  let paramsDate = [];
  const listSorter = [
    { value: "id", name: "ID" },
    { value: "string", name: "String" },
    { value: "integer", name: "Integer" },
    { value: "float", name: "Float" },
    { value: "date", name: "Date" },
  ];
  const listLimit = [
    { value: 5, name: 5 },
    { value: 10, name: 10 },
    { value: 15, name: 15 },
    { value: 20, name: 20 },
    { value: "All", name: "All" },
  ];
  generateIndex(data);
  const url = req.url == "/" ? "/?page=1" : req.url;
  const limit = req.query.limit == "All" ? data.length : req.query.limit || 5;
  const offset = (page - 1) * limit;
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
    checkBoolean,
    search,
    sorter,
  } = req.query;
  if (sorter != "id" && sorter) {
    data = getSortedData(data, sorter)[0];
  }
  if (search) {
    if (index && checkid) {
      params.length > 0
        ? (params[0]["id"] = index)
        : params.push({ id: index });
    }
    if (string && checkString) {
      params.length > 0
        ? (params[0]["string"] = string)
        : params.push({ string });
    }
    if (integer && checkInteger) {
      params.length > 0
        ? (params[0]["integer"] = integer)
        : params.push({ integer });
    }
    if (float && checkFloat) {
      params.length > 0 ? (params[0]["float"] = float) : params.push({ float });
    }
    if ((start_date || end_date) && checkDate) {
      paramsDate.push(start_date || "0000-00-00", end_date || "9999-12-31");
    }
    if (boolean && checkBoolean) {
      params.length > 0
        ? (params[0]["boolean"] = boolean)
        : params.push({ boolean });
    }
  }
  let total;
  let dataFiltered;
  if (params.length > 0 || paramsDate.length > 0) {
    let result = [];
    total = getDataFiltered(data, params[0] ? params : [{}], paramsDate).length;
    dataFiltered = getDataFiltered(
      data,
      params[0] ? params : [{}],
      paramsDate
    ).splice(offset, limit);
  } else {
    total = data.length;
    dataFiltered = data.splice(offset, limit);
  }
  console.log(params);
  const pages = Math.ceil(total / limit);
  res.render("index.ejs", {
    data: dataFiltered,
    query: req.query,
    url,
    pages,
    page: parseInt(page),
    limit,
    offset,
    listSorter,
    listLimit,
  });
});

//Add
app.get("/add", function (req, res, next) {
  const { url: urlBack } = req.query;
  res.render("add.ejs", {
    urlBack,
  });
});

app.post("/add", function (req, res) {
  let data = JSON.parse(
    fs.readFileSync(path.join(__dirname, "./db/data.json"), "utf8")
  );
  data.push({
    string: req.body.string,
    integer: parseInt(req.body.integer),
    float: parseFloat(req.body.float),
    date: req.body.date,
    boolean: req.body.boolean,
  });
  writeData(data);
  res.redirect("/");
});

//Edit
app.get("/edit/:id", function (req, res, next) {
  let data = JSON.parse(
    fs.readFileSync(path.join(__dirname, "./db/data.json"), "utf8")
  );
  let id = req.params.id - 1;
  const { url: urlBack } = req.query;
  res.render("edit.ejs", {
    item: data[id],
    id: id,
    urlBack,
  });
});

app.post("/edit/:id", function (req, res) {
  let idx = req.params.id;
  data[idx] = {
    string: req.body.string,
    integer: parseInt(req.body.integer),
    float: parseFloat(req.body.float),
    date: req.body.date,
    boolean: req.body.boolean,
  };
  writeData(data);
  res.redirect("/");
});

//Delete
app.get("/delete/:id", function (req, res, next) {
  let data = JSON.parse(
    fs.readFileSync(path.join(__dirname, "./db/data.json"), "utf8")
  );
  let id = req.params.id - 1;
  data.splice(id, 1);
  writeData(data);
  res.redirect("/");
});

app.get("/kaskus", function (req, res, next) {
  const { count } = req.query;
  let kaskus = [];
  if (count) kaskus = getKasKus(count);
  res.render("kaskus.ejs", {
    kaskus,
  });
});

app.get("/todo", function (req, res, next) {
  res.render("todo.ejs", {
    title: "Todo",
    data: [
      { title: "Ngoding", status: false, tag: [] },
      { title: "Dengerin Musik", status: true, tag: ["musik", "enjoy"] },
      { title: "Dengerin Musik", status: true, tag: ["musik", "enjoy"] },
      { title: "Dengerin Musik", status: true, tag: ["musik", "enjoy"] },
      { title: "Dengerin Musik", status: true, tag: ["musik", "enjoy"] },
      { title: "Dengerin Musik", status: true, tag: ["musik", "enjoy"] },
      { title: "Dengerin Musik", status: true, tag: ["musik", "enjoy"] },
      { title: "Dengerin Musik", status: true, tag: ["musik", "enjoy"] },
    ],
  });
});

app.listen(port, () => {
  console.info(`Anda sedang berjalan di port ${port}`);
});
