const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");
const { adminAuthRequired, authRequired } = require("../utils/authentication");
const { EHW } = require("../utils/helper");

router.post("/create-admin", EHW(userController.createAdmin));
router.post("/login", EHW(userController.loginUser));
router.post("/create", EHW(adminAuthRequired), EHW(userController.createUser));
router.put(
  "/update/:_id",
  EHW(adminAuthRequired),
  EHW(userController.updateUser)
);
router.patch(
  "/update",
  EHW(authRequired),
  EHW(userController.updateSelfPassword)
);
router.get("/all", EHW(authRequired), EHW(userController.getAllUsers));
router.delete(
  "/remove/:_id",
  adminAuthRequired,
  EHW(userController.removeUser)
);
router.post("/validate-reset-token", EHW(userController.validateResetToken));

module.exports = router;
