const express = require("express");
const router = express.Router();

const {
  getPackages,
  postPackages,
} = require("../controller/PackagesController");

router.route("/").get(getPackages).post(postPackages);

module.exports = router;
