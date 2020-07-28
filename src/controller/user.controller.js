const express = require("express");
const router = express.Router();
const { userInsert, userLogin } = require("../service/user.service");
const { validationResult } = require("express-validator");
const { validateUser } = require("../middleware/validate");

router.post("/", validateUser(), function (req, res) {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        res.status(400).send(`Validation errors: ${JSON.stringify(validationErrors.array())}`);
    } else {
        userInsert(req.body, (error, result) => {
            if (result) {
                res.status(201).send(result);
            }
            else {
                console.error(`Insert User Error: ${JSON.stringify(error)}`);
                res.status(400).send({ error });
            }
        });
    }
});

router.post("/login", (req, res) => {
    userLogin(req.body, (error, result) => {
        if (result) {
            res.setHeader("x-auth-token", result);
            res.status(200).send(result);
        } else {
            res.status(500).send({ error });
        }
    });
});

module.exports = router;