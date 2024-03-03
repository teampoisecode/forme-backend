"use strict";

module.exports = {
  MODULE_LIST: (module) => {
    return module + " list";
  },

  MODULE: (module) => {
    return module;
  },
  MODULE_CREATED: (module) => {
    return module + " created successfully";
  },
  MODULE_UPDATED: (module) => {
    return module + " updated successfully";
  },
  MODULE_DELETED: (module) => {
    return module + " deleted successfully";
  },
  MODULE_LIST: (module) => {
    return module + "s list";
  },
  MODULE_NOT_FOUND: (module) => {
    return module + " not found";
  },
  MODULE_FOUND: (module) => {
    return module + " found";
  },

  SERVER_ERROR: "server error",
  GENERATION_ERROR: "something went wrong while generating",
  UNAUTHORIZED: "Invalid token found.",
  EMAIL_ALREADY_EXSIT: "This email is already in use",
  INVALID_LOGIN_CREDENTIALS: "Invalid Login Credentials",
  LOGGED_IN_SUCCESSFULLY: "Logged in Successfully",
  URL_NOT_FOUND: "Invalid URL",
  PASSWORD_UPDATED_SUCCESSFULLY: "Password updated successfully",
};
