const mongoose = require("mongoose");
const gpt = new mongoose.Schema({
  userId: { type: String, required: true },
  user: { type: String },
  gpt: { type: String },
});

module.exports = mongoose.model("gpt", gpt);
