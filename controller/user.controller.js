"use strict";

let User = require("../model/User.model");
const bcrypt = require("bcryptjs");
const {
  generatePassword,
  generateToken,
  verifyToken,
} = require("../utils/helper");
const {
  MODULE_CREATED,
  UNAUTHORIZED,
  INVALID_LOGIN_CREDENTIALS,
  LOGGED_IN_SUCCESSFULLY,
  MODULE_UPDATED,
  MODULE_NOT_FOUND,
  MODULE_FOUND,
  MODULE_DELETED,
} = require("../utils/message");

module.exports = {
  createAdmin: async (req, res) => {
    const auth = req.headers.authorization;
    if (!auth || auth.split(" ")[1] !== env.GLOBAL_ADMIN_PASSWORD) {
      return helpers.createResponse(res, constants.UNAUTHORIZED, UNAUTHORIZED);
    }

    let user = await User.findOne({ email: env.GLOBAL_ADMIN_EMAIL });
    if (user) {
      return helpers.createResponse(
        res,
        constants.SUCCESS,
        "Admin is already created!"
      );
    }

    user = new User({
      name: "Admin",
      email: env.GLOBAL_ADMIN_EMAIL,
      mobile_no: "-",
      password: (await generatePassword(env.GLOBAL_ADMIN_PASSWORD)).hash,
      is_admin: true,
      is_password_reset: false,
    });
    await user.save();
    return helpers.createResponse(
      res,
      constants.CREATED,
      MODULE_CREATED("Admin")
    );
  },

  loginUser: async (req, res) => {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      return helpers.createResponse(
        res,
        constants.BAD_REQUEST,
        INVALID_LOGIN_CREDENTIALS
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return helpers.createResponse(
        res,
        constants.BAD_REQUEST,
        INVALID_LOGIN_CREDENTIALS
      );
    }

    const accessToken = generateToken({ _id: user._id });
    return helpers.createResponse(
      res,
      constants.SUCCESS,
      LOGGED_IN_SUCCESSFULLY,
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile_no: user.mobile_no,
        is_admin: user.is_admin,
        is_password_reset: user.is_password_reset,
        accessToken,
      }
    );
  },

  createUser: async (req, res) => {
    const userData = { ...req.body };
    const { password, hash } = await generatePassword();
    userData["password"] = hash;

    let user = await User.findOne({ email: userData.email });
    if (user) {
      return helpers.createResponse(
        res,
        constants.BAD_REQUEST,
        "User with same email is already exist!"
      );
    }

    user = new User(userData);
    await user.save();

    const token = generateToken({ uuid: user._id }, true, true);
    const resetURL = `${env.FRONTEND_BASE_URL}/reset-password/${token}`;

    return helpers.createResponse(
      res,
      constants.CREATED,
      MODULE_CREATED("User"),
      {
        name: user.name,
        email: user.email,
        mobile_no: user.mobile_no,
        password,
        password_reset_url: resetURL,
      }
    );
  },

  updateUser: async (req, res) => {
    const { _id } = req.params;
    const { name, email, mobile_no, password } = req.body;

    let user = await User.findOne({ _id });
    if (!user) {
      return helpers.createResponse(
        res,
        constants.NOT_FOUND,
        MODULE_NOT_FOUND("User")
      );
    }

    let _user = await User.findOne({ email, _id: { $ne: _id } });
    if (_user) {
      return helpers.createResponse(
        res,
        constants.BAD_REQUEST,
        "User with same email is already exist!"
      );
    }

    name && (user["name"] = name);
    email && (user["email"] = email);
    mobile_no && (user["mobile_no"] = mobile_no);
    let passObj, resetURL;
    if (password) {
      passObj = await generatePassword();
      user["password"] = passObj.hash;
      user["is_password_reset"] = true;
      const token = generateToken({ uuid: _id }, true, true);
      resetURL = `${env.RESET_PASSWORD_URL}/${token}`;
    }
    await user.save();

    return helpers.createResponse(
      res,
      constants.SUCCESS,
      MODULE_UPDATED("User"),
      {
        name: user.name,
        email: user.email,
        mobile_no: user.mobile_no,
        ...(passObj
          ? { password: passObj.password, password_reset_url: resetURL }
          : {}),
      }
    );
  },

  updateSelfPassword: async (req, res) => {
    const { _id } = req.user;
    const { password } = req.body;

    const passObj = await generatePassword(password);
    const user = await User.findByIdAndUpdate(
      _id,
      {
        password: passObj.hash,
        is_password_reset: false,
      },
      { new: true }
    );
    if (!user) {
      return helpers.createResponse(
        res,
        constants.NOT_FOUND,
        MODULE_NOT_FOUND("User")
      );
    }

    return helpers.createResponse(
      res,
      constants.SUCCESS,
      MODULE_UPDATED("Password"),
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile_no: user.mobile_no,
        is_admin: user.is_admin,
        is_password_reset: user.is_password_reset,
      }
    );
  },

  getAllUsers: async (req, res) => {
    const { _id } = req.user;
    const { search } = req.query;

    const query = { _id: { $ne: _id }, is_admin: false };
    if (search) {
      query["$or"] = [
        { name: { $regex: `^${search}`, $options: "i" } },
        { email: { $regex: `^${search}`, $options: "i" } },
      ];
    }

    let data = await User.find(query, "_id name email mobile_no", {
      sort: { name: 1 },
    });
    return helpers.createResponse(
      res,
      constants.SUCCESS,
      MODULE_FOUND("User"),
      data
    );
  },

  removeUser: async (req, res) => {
    const { _id } = req.params;

    let user = await User.findOne({ _id });
    if (!user) {
      return helpers.createResponse(
        res,
        constants.NOT_FOUND,
        MODULE_NOT_FOUND("User")
      );
    }

    await user.delete();

    return helpers.createResponse(
      res,
      constants.SUCCESS,
      MODULE_DELETED("User")
    );
  },

  validateResetToken: async (req, res) => {
    let { uuid } = await verifyToken(req, true);
    if (!uuid) {
      return helpers.createResponse(res, constants.BAD_REQUEST, UNAUTHORIZED);
    }

    let user = await User.findOne({ _id: uuid, is_password_reset: true });
    if (!user) {
      return helpers.createResponse(
        res,
        constants.NOT_FOUND,
        MODULE_NOT_FOUND("User")
      );
    }

    const accessToken = generateToken({ _id: user._id });
    return helpers.createResponse(res, constants.SUCCESS, null, {
      _id: user._id,
      email: user.email,
      name: user.name,
      is_password_reset: user.is_password_reset,
      accessToken,
    });
  },
};
