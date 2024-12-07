const jwt = require("jsonwebtoken");
const { PASSWORD_KEYS } = require("./constants");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const FileManager = require("./fileManager");

const fileManager = new FileManager();

module.exports = {
  generatePassword: async (password) => {
    const passwordSalt = await bcrypt.genSalt(10);
    const _password =
      password ||
      Array.from(Array(20))
        .map((x) => PASSWORD_KEYS[Math.round(Math.random() * 81)])
        .join("");
    return {
      password: _password,
      hash: await bcrypt.hash(_password, passwordSalt),
    };
  },

  createResponse: (res, status, message, payload) => {
    return res.status(status).json({
      message,
      payload,
      status,
    });
  },

  generateToken: (data, setExpiry = true, isReset) => {
    const secret = isReset ? env.RESET_SECRET : env.JWT_SECRET;
    if (!setExpiry) {
      return jwt.sign(data, secret, {
        algorithm: env.JWT_ALGORITHM,
      });
    } else {
      return jwt.sign(data, secret, {
        expiresIn: env.TOKEN_EXPIRY,
        algorithm: env.JWT_ALGORITHM,
      });
    }
  },

  verifyToken: async (req, isReset) => {
    const secret = isReset ? env.RESET_SECRET : env.JWT_SECRET;
    try {
      const auth = req.headers.authorization;
      const token = auth?.split(" ")[1] || "";
      const decoded = jwt.verify(token, secret);

      if (!decoded) {
        return false;
      }

      return decoded;
    } catch (err) {
      return false;
    }
  },

  EHW: (callback) => {
    const errorHandler = async (req, res, next) => {
      try {
        return await callback(req, res, next);
      } catch (e) {
        console.error(e);
        return helpers.createResponse(
          res,
          constants.SERVER_ERROR,
          messages.SERVER_ERROR,
        );
      }
    };
    return errorHandler;
  },

  getValidDesignId: (usedId) => {
    let found = false;
    let designId;
    while (!found) {
      designId = String(Math.round(Math.random() * 100000000));
      designId = designId.padEnd(8, "0");
      found = !usedId.includes(designId);
    }
    return designId;
  },

  deleteFileFromStorage: async (key) => {
    if (key) {
      try {
        await fileManager.deleteFile(key);
        return true;
      } catch (err) {
        console.error("Error deleting file from storage:", err.message);
        return false;
      }
    }
    return false;
  },
};
