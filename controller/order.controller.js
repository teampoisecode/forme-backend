"use strict";

let Order = require("../model/Order.model");
const { getValidDesignId } = require("../utils/helper");
const {
  MODULE_CREATED,
  MODULE_UPDATED,
  MODULE_NOT_FOUND,
  MODULE_FOUND,
  MODULE_DELETED,
} = require("../utils/message");

module.exports = {
  getAllOrders: async (req, res) => {
    const { search, start_date, end_date, metal, kt, rhodium } = req.query;

    let query = {};
    if (search) {
      query["$or"] = [
        {
          "job_sheet.customer_name.value": {
            $regex: `^${search}`,
            $options: "i",
          },
        },
        { order_id: { $regex: `^${search}` } },
      ];
    }

    if (start_date && end_date) {
      query["$and"] = [
        { "job_sheet.delivery_date.value": { $gte: new Date(start_date) } },
        { "job_sheet.delivery_date.value": { $lte: new Date(end_date) } },
      ];
    } else if (start_date) {
      query = {
        "job_sheet.delivery_date.value": { $gte: new Date(start_date) },
      };
    } else if (end_date) {
      query = { "job_sheet.delivery_date.value": { $lte: new Date(end_date) } };
    }

    if (metal) {
      query["job_sheet.metal.value"] = metal;
    }

    if (kt) {
      query["job_sheet.kt.value"] = kt;
    }

    if (rhodium) {
      query["job_sheet.rhodium.value"] = rhodium;
    }

    let data = await Order.find(query, null, {
      sort: { createdAt: -1 },
    });
    return helpers.createResponse(
      res,
      constants.SUCCESS,
      MODULE_FOUND("Order"),
      data
    );
  },

  createOrders: async (req, res) => {
    const orderData = { ...req.body };

    const orderIds = await Order.find({}, "order_id");
    const newDesignId = getValidDesignId(orderIds);
    orderData["order_id"] = newDesignId;

    const order = new Order(orderData);
    await order.save();

    return helpers.createResponse(
      res,
      constants.CREATED,
      MODULE_CREATED("Order"),
      order
    );
  },

  updateOrder: async (req, res) => {
    const order = await Order.findByIdAndUpdate(
      req.params._id,
      { ...req.body },
      { new: true }
    );
    if (!order) {
      return helpers.createResponse(
        res,
        constants.NOT_FOUND,
        MODULE_NOT_FOUND("Order")
      );
    }

    return helpers.createResponse(
      res,
      constants.SUCCESS,
      MODULE_UPDATED("Order"),
      order
    );
  },

  bulkUpdateOrder: async (req, res) => {
    const { order_ids } = req.query;
    const idList = (order_ids || "").split(",");

    const order = await Order.updateMany(
      { _id: { $in: idList } },
      { ...req.body },
      { new: true }
    );
    if (!order) {
      return helpers.createResponse(
        res,
        constants.NOT_FOUND,
        MODULE_NOT_FOUND("Order")
      );
    }

    return helpers.createResponse(
      res,
      constants.SUCCESS,
      MODULE_UPDATED("Order"),
      order
    );
  },

  removeOrder: async (req, res) => {
    const { _id } = req.params;

    let order = await Order.findOne({ _id });
    if (!order) {
      return helpers.createResponse(
        res,
        constants.NOT_FOUND,
        MODULE_NOT_FOUND("Order")
      );
    }

    await order.delete();

    return helpers.createResponse(
      res,
      constants.SUCCESS,
      MODULE_DELETED("Order")
    );
  },
};
