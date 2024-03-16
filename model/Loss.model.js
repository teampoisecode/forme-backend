"use strict";

const mongoose = require("mongoose");

const lossSchema = new mongoose.Schema({
  filling: { type: Map, of: Number, default: {} },
  pre_polish: { type: Map, of: Number, default: {} },
  setting: { type: Map, of: Number, default: {} },
  final_polish: { type: Map, of: Number, default: {} },
  qc: { type: Map, of: Number, default: {} },
  repair: { type: Map, of: Number, default: {} },
});

module.exports = new mongoose.model("Loss", lossSchema);
