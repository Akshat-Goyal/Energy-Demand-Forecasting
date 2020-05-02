const mongoose = require("mongoose");
const Float = require("mongoose-float").loadType(mongoose, 2);

let Data = new mongoose.Schema({
  dataType: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
  },
  month: {
    type: Number,
  },
  day: {
    type: Number,
  },
  hour: {
    type: Number,
  },
  value: {
    type: Float,
    required: true,
  },
});

module.exports = mongoose.model("Data", Data);
