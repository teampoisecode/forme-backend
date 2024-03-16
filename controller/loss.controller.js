"use strict";

let Loss = require("../model/Loss.model");
const { MODULE_UPDATED, MODULE_FOUND } = require("../utils/message");

module.exports = {
  getAllLossData: async (req, res) => {
    let data = await Loss.find({});
    if (!data.length) {
      const lossModel = new Loss();
      await lossModel.save();
      data = [lossModel];
    }
    return helpers.createResponse(
      res,
      constants.SUCCESS,
      MODULE_FOUND("Loss"),
      data[0]
    );
  },

  updateLossData: async (req, res) => {
    const { dept, month, value } = req.body;

    await Loss.updateMany({}, { $set: { [`${dept}.${month}`]: value } });

    return helpers.createResponse(
      res,
      constants.SUCCESS,
      MODULE_UPDATED("Loss")
    );
  },
};
