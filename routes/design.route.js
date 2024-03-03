const express = require("express");
const router = express.Router();
const designController = require("../controller/design.controller");
const { authRequired, adminAuthRequired } = require("../utils/authentication");
const { EHW } = require("../utils/helper");

router.get("/all", EHW(authRequired), EHW(designController.getAllDesigns));
router.post("/create", EHW(authRequired), EHW(designController.createDesigns));
router.put(
  "/update/:_id",
  EHW(authRequired),
  EHW(designController.updateDesign)
);
router.delete(
  "/remove/:_id",
  EHW(adminAuthRequired),
  EHW(designController.removeDesign)
);

module.exports = router;
