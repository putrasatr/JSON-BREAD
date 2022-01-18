const express = require("express");
const router = express.Router();
const { addService, deleteService, favoriteService } = require("./service");
const { getFilteredData, getInitialResponse } = require("../../helpers");

router.get("/", (req, res, next) => {
  const datas = require("../../db/advance-data.json");
  const { string } = req.query;
  let data = datas.data;
  if (string) data = getFilteredData(datas.data, string);
  res.render("advance/", {
    ...getInitialResponse({
      title: "Advance CRUD",
    }),
    query: req.query,
    data: data,
  });
});

router.get("/add", (req, res, next) => {
  res.render("advance/form", {
    ...getInitialResponse({
      title: "Add",
      route: "add",
    }),
  });
});

router.get("/edit/:id", (req, res, next) => {
  const { id } = req.params;
  const datas = require("../../db/advance-data.json");
  const data = getFilteredData(datas.data, id, true);
  res.render("advance/form", {
    ...getInitialResponse({
      title: "Edit",
      route: "edit",
    }),
    data,
  });
});

router.post("/add", (req, res, next) => {
  addService(req.body);
  res.redirect("add");
});

router.get("/favorite", (req, res, next) => {
  res.render("advance/favorite", {
    ...getInitialResponse({
      title: "Favorite",
      route: "favorite",
    }),
  });
});

router.get("/favorite/:id", (req, res, next) => {
  const { id } = req.params;
  const datas = require("../../db/advance-data.json");
  favoriteService(datas, id);
  res.redirect("/advance");
});

router.get("/delete/:id", (req, res, next) => {
  const { id } = req.params;
  const datas = require("../../db/advance-data.json");
  deleteService(datas, id);
  res.redirect("/advance");
});

module.exports = router;
