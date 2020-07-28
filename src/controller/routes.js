const express = require("express");
const router = express.Router();
const user = require("./user.controller");
const shop = require("./shoppingcentre.controller");
const asset = require("./asset.controller");
const health = require("./health");
router.use("/", health);
router.use("/user", user);
router.use("/shop", shop);
router.use("/asset", asset);

module.exports = router;