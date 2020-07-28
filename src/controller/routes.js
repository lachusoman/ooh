const express = require("express");
const router = express.Router();
const user = require("./user.controller");
const health = require("./health");
router.use("/", health);
router.use("/user", user);

module.exports = router;