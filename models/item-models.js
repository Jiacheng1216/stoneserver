const mongoose = require("mongoose");
const { Schema } = mongoose;

const itemSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  color: {
    type: String,
    require: true,
  },
  height: {
    type: Number,
    require: true,
  },
  width: {
    type: Number,
    require: true,
  },
  imagePath: {
    type: String,
  },
  imagePublicId: {
    type: String,
  },
  isPaper: {
    type: Boolean,
  },
  firstLastNumbers: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  id: {
    type: Number,
  },
});

module.exports = mongoose.model("Item", itemSchema);
