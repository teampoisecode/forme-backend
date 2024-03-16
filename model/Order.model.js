"use strict";

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    order_id: {
      type: String,
    },
    order_status: {
      type: String,
    },
    design: {
      design_id: {
        type: String,
      },
    },
    job_sheet: {
      customer_name: {
        value: { type: String },
        is_admin_edit: { type: Boolean },
      },
      order_date: {
        value: { type: Date },
        is_admin_edit: { type: Boolean },
      },
      delivery_date: {
        value: { type: Date },
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
      pcs: {
        value: { type: String },
        is_admin_edit: { type: Boolean },
      },
      rhodium: {
        value: { type: String },
        is_admin_edit: { type: Boolean },
      },
    },
    diamond: [
      {
        size: { value: { type: String }, is_admin_edit: { type: Boolean } },
        pcs: { value: { type: String }, is_admin_edit: { type: Boolean } },
        pointer: { value: { type: String }, is_admin_edit: { type: Boolean } },
        total_weight: {
          value: { type: String },
          is_admin_edit: { type: Boolean },
        },
      },
    ],
    metal: {
      filling: {
        pcs: { value: { type: String }, is_admin_edit: { type: Boolean } },
        in_wt: { value: { type: String }, is_admin_edit: { type: Boolean } },
        out_wt: { value: { type: String }, is_admin_edit: { type: Boolean } },
        dust_wt: { value: { type: String }, is_admin_edit: { type: Boolean } },
        complete_date: {
          value: { type: Date },
          is_admin_edit: { type: Boolean },
        },
      },
      pre_polish: {
        pcs: { value: { type: String }, is_admin_edit: { type: Boolean } },
        in_wt: { value: { type: String }, is_admin_edit: { type: Boolean } },
        out_wt: { value: { type: String }, is_admin_edit: { type: Boolean } },
        dust_wt: { value: { type: String }, is_admin_edit: { type: Boolean } },
        complete_date: {
          value: { type: Date },
          is_admin_edit: { type: Boolean },
        },
      },
      setting: {
        pcs: { value: { type: String }, is_admin_edit: { type: Boolean } },
        in_wt: { value: { type: String }, is_admin_edit: { type: Boolean } },
        out_wt: { value: { type: String }, is_admin_edit: { type: Boolean } },
        dust_wt: { value: { type: String }, is_admin_edit: { type: Boolean } },
        complete_date: {
          value: { type: Date },
          is_admin_edit: { type: Boolean },
        },
      },
      final_polish: {
        pcs: { value: { type: String }, is_admin_edit: { type: Boolean } },
        in_wt: { value: { type: String }, is_admin_edit: { type: Boolean } },
        out_wt: { value: { type: String }, is_admin_edit: { type: Boolean } },
        dust_wt: { value: { type: String }, is_admin_edit: { type: Boolean } },
        complete_date: {
          value: { type: Date },
          is_admin_edit: { type: Boolean },
        },
      },
      qc: {
        pcs: { value: { type: String }, is_admin_edit: { type: Boolean } },
        in_wt: { value: { type: String }, is_admin_edit: { type: Boolean } },
        out_wt: { value: { type: String }, is_admin_edit: { type: Boolean } },
        dust_wt: { value: { type: String }, is_admin_edit: { type: Boolean } },
        complete_date: {
          value: { type: Date },
          is_admin_edit: { type: Boolean },
        },
      },
      repair: {
        pcs: { value: { type: String }, is_admin_edit: { type: Boolean } },
        in_wt: { value: { type: String }, is_admin_edit: { type: Boolean } },
        out_wt: { value: { type: String }, is_admin_edit: { type: Boolean } },
        dust_wt: { value: { type: String }, is_admin_edit: { type: Boolean } },
        complete_date: {
          value: { type: Date },
          is_admin_edit: { type: Boolean },
        },
      },
    },
    changing: [
      {
        size: { value: { type: String }, is_admin_edit: { type: Boolean } },
        pcs: { value: { type: String }, is_admin_edit: { type: Boolean } },
        wt: { value: { type: String }, is_admin_edit: { type: Boolean } },
        total_weight: {
          value: { type: String },
          is_admin_edit: { type: Boolean },
        },
      },
    ],
    extra: {
      metal: { value: { type: String }, is_admin_edit: { type: Boolean } },
      wire: { value: { type: String }, is_admin_edit: { type: Boolean } },
      solder: { value: { type: String }, is_admin_edit: { type: Boolean } },
    },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("Order", orderSchema);
