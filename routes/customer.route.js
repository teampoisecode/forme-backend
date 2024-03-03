const express = require("express");
const router = express.Router();
const customerController = require("../controller/customer.controller");
const { authRequired } = require("../utils/authentication");
const { EHW } = require("../utils/helper");

router.get("/all", EHW(authRequired), EHW(customerController.getAllCustomers));
router.post(
  "/create",
  EHW(authRequired),
  EHW(customerController.createCustomers)
);
router.put(
  "/update/:_id",
  EHW(authRequired),
  EHW(customerController.updateCustomer)
);
router.delete(
  "/remove/:_id",
  EHW(authRequired),
  EHW(customerController.removeCustomer)
);

module.exports = router;
