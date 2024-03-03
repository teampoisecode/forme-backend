"use strict";

const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    mobile_no: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("Customer", customerSchema);
