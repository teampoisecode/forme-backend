const jwt = require("jsonwebtoken");
const { PASSWORD_KEYS } = require("./constants");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

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
          messages.SERVER_ERROR
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
      found = !usedId.includes(designId);
    }
    return designId;
  },

  deleteFileFromStorage: (url) => {
    if (url) {
      const fileName = url.split("/").pop();
      const filePath = path.join(customImagesDirPath, fileName);
      if (fs.existsSync(filePath)) {
        fs.rmSync(filePath);
        return true;
      }
    }
    return false;
  },
};
