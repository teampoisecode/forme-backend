"use strict";

const mongoose = require("mongoose");

const designSchema = new mongoose.Schema(
  {
    design_id: {
      type: String,
    },
    ref_image: {
      url: { type: String },
      is_admin_edit: { type: Boolean },
    },
    cad_image: {
      url: { type: String },
      is_admin_edit: { type: Boolean },
    },
    final_image: {
      url: { type: String },
      is_admin_edit: { type: Boolean },
    },
    metal: {
      value: { type: String },
      is_admin_edit: { type: Boolean },
    },
    kt: {
      value: { type: String },
      is_admin_edit: { type: Boolean },
    },
    rhodium: {
      value: { type: String },
      is_admin_edit: { type: Boolean },
    },
    product_type: {
      value: { type: String },
      is_admin_edit: { type: Boolean },
    },
    product_size: {
      value: { type: String },
      is_admin_edit: { type: Boolean },
    },
    cts: {
      value: { type: String },
      is_admin_edit: { type: Boolean },
    },
    cad_data: [
      {
        shape: { value: { type: String }, is_admin_edit: { type: Boolean } },
        mm: { value: { type: String }, is_admin_edit: { type: Boolean } },
        dia_col: { value: { type: String }, is_admin_edit: { type: Boolean } },
        sive_size: {
          value: { type: String },
          is_admin_edit: { type: Boolean },
        },
        cts: { value: { type: String }, is_admin_edit: { type: Boolean } },
        qty: { value: { type: String }, is_admin_edit: { type: Boolean } },
        weight: { value: { type: String }, is_admin_edit: { type: Boolean } },
      },
    ],
  },
  { timestamps: true }
);

module.exports = new mongoose.model("Design", designSchema);
