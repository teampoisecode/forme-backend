// Create Express App
const express = require("express");
const app = express();
var cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Load .env
require("dotenv").config();

// Environment Variables
require("dotenv").config();
env = module.exports = process.env;

// Database
require("./db/conn");

app.use(cookieParser());
app.use(cors({ credentials: true, origin: env.FRONTEND_BASE_URL }));

// Logger
logger = (req, res, next) => {
  console.log("\x1b[32m", `-------------- ${req.path} --------------`);
  console.log(
    "\x1b[33m",
    "Headers contains authorization: ",
    Object.keys(req.headers).includes("authorization")
  );
  console.log("\x1b[33m", "Method : ", req.method);
  console.log("\x1b[33m", "Path : ", req.path);
  console.log("\x1b[33m", "Body : ", JSON.stringify(req.body));
  console.log("\x1b[33m", "Query Params : ", req.query);
  console.log("\x1b[32m", "-----------------------------------------");
  console.log("");

  next();
};
app.use(logger);

// Global helpers
messages = module.exports = require("./utils/message");
constants = module.exports = require("./utils/constants");
helpers = module.exports = require("./utils/helper");
authRequired = module.exports = require("./utils/authentication").authRequired;

// Create dirs
const fs = require("fs");
const path = require("path");

global.__staticFilesdir = path.join(__dirname, "public");
global.customImagesDir = "/images";
global.customImagesDirPath = __staticFilesdir + customImagesDir;

if (!fs.existsSync(customImagesDirPath)) {
  fs.mkdirSync(customImagesDirPath, { recursive: true });
}

// Enable static files
app.use("/static", express.static(__staticFilesdir));

// API Version
const API_VERSION = "/api/v1/";

// App Routes
const userRouter = require("./routes/user.route");
const customerRouter = require("./routes/customer.route");
const miscRouter = require("./routes/misc.route");
const designRouter = require("./routes/design.route");
const orderRouter = require("./routes/order.route");
app.use(API_VERSION + "users", userRouter);
app.use(API_VERSION + "customers", customerRouter);
app.use(API_VERSION + "misc", miscRouter);
app.use(API_VERSION + "designs", designRouter);
app.use(API_VERSION + "orders", orderRouter);

// 404 Not found routes
app.use((req, res) => {
  console.log(
    "\x1b[35m",
    `-------------- 404 - Not Found - ${req.path} --------------`
  );
  console.log(
    "\x1b[35m",
    "Headers contains authorization: ",
    Object.keys(req.headers).includes("authorization")
  );
  console.log("\x1b[35m", "Method : ", req.method);
  console.log("\x1b[35m", "Path : ", req.path);
  console.log("\x1b[35m", "Body : ", JSON.stringify(req.body));
  console.log("\x1b[35m", "Query Params : ", req.query);
  console.log("\x1b[35m", "-----------------------------------------");

  helpers.createResponse(res, constants.NOT_FOUND, messages.URL_NOT_FOUND);
});

// Listen
app.listen(env.PORT || 7400, () => {
  console.log("Server is running on port 7400");
});
