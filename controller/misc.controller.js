"use strict";
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

module.exports = {
  uploadImage: async (req, res) => {
    const { prefix, url } = req.body;

    if (url) {
      const fileName = url.split("/").pop();
      const filePath = path.join(customImagesDirPath, fileName);
      if (fs.existsSync(filePath)) {
        fs.rmSync(filePath);
      }
    }

    const file = req.files[0];
    let uri = "";
    if (file) {
      const fileExtension = file.originalname.split(".").pop();
      uri = [prefix, uuid().replaceAll("-", ""), new Date().getTime()].join(
        "_"
      );
      uri = [uri, fileExtension].join(".");

      const filePath = path.join(customImagesDirPath, uri);
      fs.writeFileSync(filePath, file.buffer);

      uri = [process.env.tempCustomImagesMediaServerBaseURL, uri].join("/");
    }

    return helpers.createResponse(
      res,
      constants.SUCCESS,
      "File uploaded successfully",
      uri || null
    );
  },
};
