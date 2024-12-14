"use strict";

let Design = require("../model/Design.model");
const { getValidDesignId, deleteFileFromStorage } = require("../utils/helper");
const {
  MODULE_CREATED,
  MODULE_UPDATED,
  MODULE_NOT_FOUND,
  MODULE_FOUND,
  MODULE_DELETED,
} = require("../utils/message");

module.exports = {
  getAllDesigns: async (req, res) => {
    const { search, skipFilter, metal, kt, rhodium, showUnused } = req.query;

    const query = {};
    if (!skipFilter && showUnused !== "true") {
      query["final_image.url"] = { $ne: null };
    }
    if (search) {
      query["design_id"] = { $regex: `^${search}` };
    }
    if (metal) {
      query["metal.value"] = metal;
    }
    if (kt) {
      query["kt.value"] = kt;
    }
    if (rhodium) {
      query["rhodium.value"] = rhodium;
    }
    if (showUnused === "true") {
      const unUsedDesigns = await Design.aggregate([
        {
          $lookup: {
            from: "orders",
            localField: "design_id",
            foreignField: "design.design_id",
            as: "matchingDocuments",
          },
        },
        { $match: { matchingDocuments: { $eq: [] } } },
        { $project: { design_id: 1, _id: 0 } },
      ]);
      if (search) {
        query["$or"] = [
          { design_id: { $regex: `^${search}` } },
          { design_id: { $in: unUsedDesigns.map((d) => d.design_id) } },
        ];
      } else {
        query["design_id"] = { $in: unUsedDesigns.map((d) => d.design_id) };
      }
    }

    let data = await Design.find(query, null, {
      sort: { design_id: 1 },
    });

    return helpers.createResponse(
      res,
      constants.SUCCESS,
      MODULE_FOUND("Design"),
      data,
    );
  },

  createDesigns: async (req, res) => {
    const designData = { ...req.body };

    const designIds = await Design.find({}, "design_id");
    const newDesignId = getValidDesignId(designIds);
    designData["design_id"] = newDesignId;

    const design = new Design(designData);
    await design.save();

    return helpers.createResponse(
      res,
      constants.CREATED,
      MODULE_CREATED("Design"),
      design,
    );
  },

  updateDesign: async (req, res) => {
    const design = await Design.findByIdAndUpdate(
      req.params._id,
      { ...req.body },
      { new: true },
    );
    if (!design) {
      return helpers.createResponse(
        res,
        constants.NOT_FOUND,
        MODULE_NOT_FOUND("Design"),
      );
    }

    return helpers.createResponse(
      res,
      constants.SUCCESS,
      MODULE_UPDATED("Design"),
      design,
    );
  },

  removeDesign: async (req, res) => {
    const { _id } = req.params;

    let design = await Design.findOne({ _id });
    if (!design) {
      return helpers.createResponse(
        res,
        constants.NOT_FOUND,
        MODULE_NOT_FOUND("Design"),
      );
    }

    // Ensure the correct file paths are passed to deleteFileFromStorage
    if (design.ref_image?.url) deleteFileFromStorage(design.ref_image.url);
    if (design.cad_image?.url) deleteFileFromStorage(design.cad_image.url);
    if (design.final_image?.url) deleteFileFromStorage(design.final_image.url);

    await design.delete();

    return helpers.createResponse(
      res,
      constants.SUCCESS,
      MODULE_DELETED("Design"),
    );
  },
};
