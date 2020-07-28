const express = require("express");
const router = express.Router();
const { userInsert } = require("../service/user.service");
const { validationResult } = require("express-validator");
const { validate } = require("../middleware/validate");

router.post("/", validate(), function (req, res) {
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

module.exports = router;