const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { assetInsert, assetGetAll, assetUpdate } = require("../service/asset.service");
const { validationResult } = require("express-validator");
const { validateAsset } = require("../middleware/validate");

router.post("/", auth, validateAsset(), function (req, res) {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        res.status(400).send(`Validation errors: ${JSON.stringify(validationErrors.array())}`);
    } else {
        const user_id = req.user.email_id;
        assetInsert(req.body, user_id, (error, result) => {
            if (result) {
                res.status(201).send(result);
            }
            else {
                console.log(`Internal Error:${JSON.stringify(error)}`);
                res.status(400).send(error.msg);
            }
        });
    }
});

router.get("/", auth, (req, res) => {
    assetGetAll(req.query, (error, result) => {
        if (result) {
            res.send(result);
        } else {
            console.error(`Error: ${JSON.stringify(error)}`);
            res.status(400).send({ message: error.errors });
        }
    });
});

router.put("/:asset_id", auth, validateAsset(), (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        res.status(400).send(`Validation errors: ${JSON.stringify(validationErrors.array())}`);
    } else {
        const user_id = req.user.email_id;
        assetUpdate(req.params, req.body, user_id, (error, result) => {
            if (result) {
                res.status(201).json(result);
            }
            else {
                console.error(`Error: ${JSON.stringify(error)}`);
                res.status(400).send({ message: error });
            }
        });
    }
});
module.exports = router;