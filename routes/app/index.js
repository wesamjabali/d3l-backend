// required modules
const express = require("express");
const router = express.Router();

// controller files imports
const non_auth_routes = require("./non_auth");
const admin_routes = require("./admin");
const faculty_routes = require("./faculty");
const user_routes = require("./user");

// auth middleware
const auth_middleware = require("../../middleware/authMiddleware");
const roles_middleware = require("../../middleware/rolesMiddleware");

// routers attached
router.use("/non_auth", non_auth_routes);
// protected subrouter
router.use(
  "/admin",
  auth_middleware,
  roles_middleware(["admin"]),
  admin_routes
);
router.use(
  "/faculty",
  auth_middleware,
  roles_middleware(["faculty"]),
  faculty_routes
);
router.use("/user", auth_middleware, user_routes);

// export router
module.exports = router;
