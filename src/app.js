const routes = require("./controller/routes.js");
const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(process.env.API_PREFIX, routes);

const server = app.listen(PORT, function () {
    console.log("Server is running at Port " + PORT);
});

module.exports = app;
