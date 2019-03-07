"use strict";
// app.js
var express = require("express");
// Create Express app
var app = express();
// A sample route
app.get("/", function (req, res) { return res.send("Hello World!"); });
// Start the Express server
app.listen(3000, function () { return console.log("Server running on port 3000!"); });
