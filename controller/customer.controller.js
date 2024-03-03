"use strict";

let Customer = require("../model/Customer.model");
const {
  MODULE_CREATED,
  MODULE_UPDATED,
  MODULE_NOT_FOUND,
  MODULE_FOUND,
  MODULE_DELETED,
} = require("../utils/message");

module.exports = {
  getAllCustomers: async (req, res) => {
    const { search } = req.query;

    const query = {};
    if (search) {
      query["$or"] = [
        { name: { $regex: `^${search}`, $options: "i" } },
        { email: { $regex: `^${search}`, $options: "i" } },
      ];
    }

    let data = await Customer.find(query, null, {
      sort: { name: 1 },
    });
    return helpers.createResponse(
      res,
      constants.SUCCESS,
      MODULE_FOUND("Customer"),
      data
    );
  },

  createCustomers: async (req, res) => {
    const customerData = { ...req.body };

    let customer = await Customer.findOne({ email: customerData.email });
    if (customer) {
      return helpers.createResponse(
        res,
        constants.BAD_REQUEST,
        "Customer with same email is already exist!"
      );
    }

    customer = new Customer(customerData);
    await customer.save();

    return helpers.createResponse(
      res,
      constants.CREATED,
      MODULE_CREATED("Customer"),
      customer
    );
  },

  updateCustomer: async (req, res) => {
    const { _id } = req.params;
    const { name, email, mobile_no } = req.body;

    let customer = await Customer.findOne({ _id });
    if (!customer) {
      return helpers.createResponse(
        res,
        constants.NOT_FOUND,
        MODULE_NOT_FOUND("Customer")
      );
    }

    let _customer = await Customer.findOne({ email, _id: { $ne: _id } });
    if (_customer) {
      return helpers.createResponse(
        res,
        constants.BAD_REQUEST,
        "Customer with same email is already exist!"
      );
    }

    name && (customer["name"] = name);
    email && (customer["email"] = email);
    mobile_no && (customer["mobile_no"] = mobile_no);
    await customer.save();

    return helpers.createResponse(
      res,
      constants.SUCCESS,
      MODULE_UPDATED("Customer"),
      customer
    );
  },

  removeCustomer: async (req, res) => {
    const { _id } = req.params;

    let customer = await Customer.findOne({ _id });
    if (!customer) {
      return helpers.createResponse(
        res,
        constants.NOT_FOUND,
        MODULE_NOT_FOUND("Customer")
      );
    }

    await customer.delete();

    return helpers.createResponse(
      res,
      constants.SUCCESS,
      MODULE_DELETED("Customer")
    );
  },
};
