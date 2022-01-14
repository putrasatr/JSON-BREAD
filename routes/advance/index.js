const express = require("express");
const router = express.Router();
const { listFilter, getRouters } = require("../../utils");

router.get("/", (req, res, next) => {
  res.render("advance/", {
    title: "Advance Crud ever",
    listFilter,
    routers: getRouters(),
  });
});

router.get("/add", (req, res, next) => {
  res.render("advance/", {
    title: "Add",
    listFilter,
    routers: getRouters("add"),
  });
});
router.get("/favorite", (req, res, next) => {
  res.render("advance/favorite", {
    title: "Favorite",
    listFilter,
    routers: getRouters("favorite"),
  });
});

module.exports = router;
