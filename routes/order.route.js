const express = require("express");
const router = express.Router();
const orderController = require("../controller/order.controller");
const { authRequired } = require("../utils/authentication");
const { EHW } = require("../utils/helper");

router.get("/all", EHW(authRequired), EHW(orderController.getAllOrders));
router.post("/create", EHW(authRequired), EHW(orderController.createOrders));
router.put("/update/:_id", EHW(authRequired), EHW(orderController.updateOrder));
router.put(
  "/bulk_update",
  EHW(authRequired),
  EHW(orderController.bulkUpdateOrder)
);
router.delete(
  "/remove/:_id",
  EHW(authRequired),
  EHW(orderController.removeOrder)
);
router.get("/loss", EHW(authRequired), EHW(orderController.getLossData));


module.exports = router;
