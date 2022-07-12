const mongoose = require(`../config/db`);

// schema
const packageSchema = new mongoose.Schema({
  tracking_number: String,
  status: String,
  days_ago: Number,
  checkpoints: Object,
});

// model
const Package = mongoose.model("Package", packageSchema);

// exports
module.exports = Package;
