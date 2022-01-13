const express = require("express");
const router = express.Router();
const { listFilter, routers } = require("../../utils");

router.get("/", (req, res, next) => {
  res.render("advance/", {
    title: "Advance Crud ever",
    listFilter,
    routers,
  });
});

router.get("/add", (req, res, next) => {
  res.render("advance/", {
    title: "Add",
    listFilter,
    routers,
  });
});

module.exports = router;
