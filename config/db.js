require("dotenv").config();
const mongoose = require("mongoose");

try {
  // connect to Atlas DB
  mongoose.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.KEY}@cluster0.mb1wr.mongodb.net/trackerDb`
  );
  console.log("connected via config");
} catch (error) {
  console.log(error);
}

module.exports = mongoose;
