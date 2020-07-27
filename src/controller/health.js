const express = require("express");
const router = express.Router();

router.get("/health", (request, response) => {
    response.send({ status: "Healthy", time: new Date() });
});

module.exports = router;