const express = require("express");
const router = express.Router();
const miscController = require("../controller/misc.controller");
const { authRequired } = require("../utils/authentication");
const { EHW } = require("../utils/helper");
const multer = require("multer");
const upload = multer();

router.post(
  "/upload",
  EHW(authRequired),
  EHW(upload.any()),
  EHW(miscController.uploadImage)
);

module.exports = router;
