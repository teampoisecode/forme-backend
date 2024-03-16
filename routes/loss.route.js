const express = require("express");
const router = express.Router();
const lossController = require("../controller/loss.controller");
const { authRequired } = require("../utils/authentication");
const { EHW } = require("../utils/helper");

router.get("/", EHW(authRequired), EHW(lossController.getAllLossData));
router.put("/", EHW(authRequired), EHW(lossController.updateLossData));

module.exports = router;
