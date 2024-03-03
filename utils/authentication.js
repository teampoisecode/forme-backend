const User = require("../model/User.model");

const authRequired = async (req, res, next) => {
  try {
    var decoded = await helpers.verifyToken(req);

    if (decoded) {
      const { _id } = decoded;
      const targetUser = await User.findById(_id);
      if (targetUser) {
        req.user = targetUser;
      } else {
        return helpers.createResponse(
          res,
          constants.UNAUTHORIZED,
          messages.UNAUTHORIZED
        );
      }
      next();
    } else {
      return helpers.createResponse(
        res,
        constants.UNAUTHORIZED,
        messages.UNAUTHORIZED
      );
    }
  } catch (err) {
    return helpers.createResponse(
      res,
      constants.FORBIDDEN,
      messages.UNAUTHORIZED
    );
  }
};

const adminAuthRequired = async (req, res, next) => {
  try {
    var decoded = await helpers.verifyToken(req);

    if (decoded) {
      const { _id } = decoded;
      const targetUser = await User.findById(_id);
      if (targetUser && targetUser.is_admin) {
        req.user = targetUser;
      } else {
        return helpers.createResponse(
          res,
          constants.UNAUTHORIZED,
          messages.UNAUTHORIZED
        );
      }
      next();
    } else {
      return helpers.createResponse(
        res,
        constants.UNAUTHORIZED,
        messages.UNAUTHORIZED
      );
    }
  } catch (err) {
    return helpers.createResponse(
      res,
      constants.FORBIDDEN,
      messages.UNAUTHORIZED
    );
  }
};

module.exports = {
  authRequired,
  adminAuthRequired,
};
