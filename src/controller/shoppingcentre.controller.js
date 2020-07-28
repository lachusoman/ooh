const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { shopcntrInsert, shopcntrGetAll } = require("../service/shoppingcentre.service");
const { validationResult } = require("express-validator");
const { validateShoppingCentre } = require("../middleware/validate");

router.post("/", auth, validateShoppingCentre(), function (req, res) {
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

router.get("/", auth, (req, res) => {
    shopcntrGetAll(req.query, (error, result) => {
        if (result) {
            res.send(result);
        } else {
            console.error(`Error: ${JSON.stringify(error)}`);
            res.status(400).send({ message: error.errors });
        }
    });
});

module.exports = router;