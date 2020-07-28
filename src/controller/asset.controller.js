const express = require("express");
const router = express.Router();
const { assetInsert } = require("../service/asset.service");
const { validationResult } = require("express-validator");
const { validateAsset } = require("../middleware/validate");

router.post("/", validateAsset(), function (req, res) {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        res.status(400).send(`Validation errors: ${JSON.stringify(validationErrors.array())}`);
    } else {
        assetInsert(req.body, (error, result) => {
            if (result) {
                res.status(201).send(result);
            }
            else {
                res.status(400).send(error);
            }
        });
    }
});

module.exports = router;