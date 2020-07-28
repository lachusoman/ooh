const express = require("express");
const router = express.Router();
const user = require("./user.controller");
const shop = require("./shoppingcentre.controller");
const health = require("./health");
router.use("/", health);
router.use("/user", user);
router.use("/shop", shop);

module.exports = router;