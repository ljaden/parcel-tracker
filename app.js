require("dotenv").config();

// custom helper function
const helperFunction = require("./function/helpers");

// require
const tabletojson = require("tabletojson").Tabletojson;
const fs = require("fs");
const express = require("express");
const ejs = require("ejs");
// const moment = require("moment");
const { AsyncResource } = require("async_hooks");

// express
const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

const package = require("./routes/packageRoute");
app.use("/", package);

// // downloads route
// app.route("/download/data").get(async (req, res) => {
//   const data = await helperFunction.getTable();

//   // writes data into csv
//   fs.writeFile("./download/data.csv", data, (err) => {
//     if (!err) {
//       // download file
//       res.download("download/data.csv", (err) => {
//         if (err) res.status(404).send("<h1>File not found: 404</h1>");
//       });
//     }
//   });
// });

// // delete specific
// app.route("/delete/:id").get(async (req, res) => {
//   const link = req.params.id;

//   await Package.deleteOne({ tracking_number: link });
//   res.redirect("/");
// });
// // deleteall
// app.route("/deleteall").get(async (req, res) => {
//   await Package.deleteMany({});
//   res.redirect("/");
// });
const port = 3000;
app.listen(process.env.PORT || port, () => {
  console.log(`Port: ${port}`);
});
