const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("advance/", {
    title: "Advance Crud ever",
  });
});

module.exports = router;
