"use strict";
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");
const FileManager = require("../utils/fileManager");
const mime = require("mime-types");

const fileManager = new FileManager();

module.exports = {
  uploadImage: async (req, res) => {
    const { prefix, url } = req.body;

    if (url) {
      await fileManager.deleteFile(url);
    }

    const file = req.files[0];
    let key = null;
    if (file) {
      const fileExtension = file.originalname.split(".").pop();
      key = `${Date.now()}.${fileExtension}`;
      await fileManager.uploadFile(key, file.buffer);
    }

    return helpers.createResponse(
      res,
      constants.SUCCESS,
      "File uploaded successfully",
      key
    );
  },

  getFile: async (req, res) => {
    try {
      const { fileName } = req.params;
      if (fileName && fileName !== "undefined" && fileName !== "null") {
        const key = process.env.AWS_FOLDER + "/" + fileName;
        // Determine the Content-Disposition & Content-Typeheader based on the file type
        const inlineTypes = [
          "mp3",
          "mp4",
          "pdf",
          "jpg",
          "jpeg",
          "png",
          "svg",
          "gif",
        ];
        const fileType = key.split(".").pop();
        const contentDisposition =
          inlineTypes.includes(fileType) ||
          fileType.startsWith("image/") ||
          fileType.startsWith("video/") ||
          fileType === "application/pdf"
            ? `inline; filename="${key}"`
            : `attachment; filename="${key}"`;
        const contentType = mime.lookup(fileType) || "application/octet-stream";

        const fileManager = new FileManager();
        const data = await fileManager.getFileByKey(
          key,
          contentDisposition,
          contentType
        );
        // Check if data is defined and has a 'Body' property (a readable stream)
        if (data && data.Body) {
          let bodyContents;
          if (data.Body instanceof Buffer) {
            bodyContents = data.Body;
          } else if (data.Body instanceof Stream) {
            bodyContents = await fileManager.streamToString(data.Body);
          }
          const headers = {
            "Content-Type": contentType,
            "Content-Length": data.ContentLength,
            "Content-Disposition": contentDisposition,
          };
          res.writeHead(200, headers);
          res.write(bodyContents, "binary");
          res.end(null, "binary");
        } else {
          // Handle the case where 'data' or 'data.Body' is undefined
          return res
            .status(404)
            .json({ error: "File not found or cannot be read." });
        }
        /* 
          This code returns a presigned URL of the file
          const fileManager = new FileManager();
          const URL = await fileManager.generatePresignedUrl(key, contentDisposition, contentType);
          return res.redirect(URL);
        */
      } else {
        return helpers.createResponse(res, 400, "File not found");
      }
    } catch (e) {
      console.error(e);
      helpers.createResponse(
        res,
        constants.SERVER_ERROR,
        messages.SERVER_ERROR,
        { error: e.message }
      );
    }
  },
};
