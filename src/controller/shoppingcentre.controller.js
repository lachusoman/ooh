const express = require("express");
const router = express.Router();
const { shopcntrInsert } = require("../service/shoppingcentre.service");
const { validationResult } = require("express-validator");
const { validateShoppingCentre } = require("../middleware/validate");

router.post("/", validateShoppingCentre(), function (req, res) {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        res.status(400).send(`Validation errors: ${JSON.stringify(validationErrors.array())}`);
    } else {
        shopcntrInsert(req.body, (error, result) => {
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