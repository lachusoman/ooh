const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { shopcntrInsert, shopcntrGetAll, shopcntrUpdate } = require("../service/shoppingcentre.service");
const { validationResult } = require("express-validator");
const { validateShoppingCentre } = require("../middleware/validate");

router.post("/", auth, validateShoppingCentre(), function (req, res) {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        res.status(400).send(`Validation errors: ${JSON.stringify(validationErrors.array())}`);
    } else {
        const user_id = req.user.email_id;
        shopcntrInsert(req.body, user_id, (error, result) => {
            if (result) {
                res.status(201).send(result);
            } else {
                console.log(`Create ShoppingCentre Error:${JSON.stringify(error)}`);
                res.status(400).send(error.msg);
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
            res.status(400).send({ message: error.msg });
        }
    });
});

router.put("/:shop_id", auth, validateShoppingCentre(), (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        res.status(400).send(`Validation errors: ${JSON.stringify(validationErrors.array())}`);
    } else {
        const user_id = req.user.email_id;
        const { shop_id } = req.params
        const shopDetails = req.body
        shopcntrUpdate({ shop_id, ...shopDetails }, user_id, (error, result) => {
            if (result) {
                res.status(201).json(result);
            } else {
                console.error(`Error: ${JSON.stringify(error)}`);
                res.status(400).send({ message: error.msg });
            }
        });
    }
});

module.exports = router;