"use strict";

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
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
    password: {
      type: String,
    },
    is_admin: {
      type: Boolean,
      default: false,
    },
    is_password_reset: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("User", userSchema);
