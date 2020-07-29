const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { auditGetAll } = require("../service/audit.service");

router.get("/", auth, (req, res) => {
    const loggedUserRole = req.user.user_type;
    console.log(`user type:${loggedUserRole}`);
    if (loggedUserRole !== "A") {
        res.status(401).send({ message: "Only Admin is authorised to View Audit Details" });
    }
    auditGetAll(req.query, (error, result) => {
        if (result) {
            res.send(result);
        } else {
            console.error(`Error: ${JSON.stringify(error)}`);
            res.status(400).send({ message: error.msg });
        }
    });
});

module.exports = router;