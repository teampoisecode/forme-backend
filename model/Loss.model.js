"use strict";

const mongoose = require("mongoose");

const lossSchema = new mongoose.Schema({
  filling: {
    type: Map,
    of: { type: Map, of: Number, default: {} },
    default: {},
  },
  pre_polish: {
    type: Map,
    of: { type: Map, of: Number, default: {} },
    default: {},
  },
  setting: {
    type: Map,
    of: { type: Map, of: Number, default: {} },
    default: {},
  },
  final_polish: {
    type: Map,
    of: { type: Map, of: Number, default: {} },
    default: {},
  },
  qc: { type: Map, of: { type: Map, of: Number, default: {} }, default: {} },
  repair: {
    type: Map,
    of: { type: Map, of: Number, default: {} },
    default: {},
  },
});

module.exports = new mongoose.model("Loss", lossSchema);
