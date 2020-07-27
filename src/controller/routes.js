const express = require("express");
const router = express.Router();
const misc = require("./health");
router.use("/", misc);

module.exports = router;