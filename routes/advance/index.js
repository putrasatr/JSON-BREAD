const express = require("express");
const router = express.Router();
const { listFilter, getRouters } = require("../../utils");
const { addService } = require("./service");
const datas = require("../../db/advance-data.json");
const { getDataFiltered, generateIndex } = require("../../helpers");

router.get("/", (req, res, next) => {
  generateIndex(datas.data);
  let params = [];
  const { string } = req.query;
  if (string) {
    params.length > 0
      ? (params[0]["string"] = string)
      : params.push({ string });
  }
  let data = datas.data;
  if (params.length)
    data = getDataFiltered(datas.data, params[0] ? params : [{}], []);
  res.render("advance/", {
    title: "Advance Crud ever",
    listFilter,
    data,
    query: req.query,
    routers: getRouters(),
  });
});

router.get("/add", (req, res, next) => {
  res.render("advance/add", {
    title: "Add",
    listFilter,
    routers: getRouters("add"),
  });
});

router.post("/add", (req, res, next) => {
  addService(req.body);
  res.redirect("add");
});

router.get("/favorite", (req, res, next) => {
  res.render("advance/favorite", {
    title: "Favorite",
    listFilter,
    routers: getRouters("favorite"),
  });
});

module.exports = router;
