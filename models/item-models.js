const mongoose = require("mongoose");
const { Schema } = mongoose;

const itemSchema = new Schema({
  // 產地
  stoneOrigin: {
    type: String,
    require: true,
  },
  // 石頭顏色
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
  fileName: {
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
