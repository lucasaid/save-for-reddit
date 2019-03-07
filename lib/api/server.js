"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// app.js
var express = require("express");
var fs_1 = __importDefault(require("fs"));
var cors = require("cors");
// Create Express app
var app = express();
var CURRENT = process.cwd();
var fileData = fs_1.default.readFileSync(CURRENT + "/tmp/saved.json", "utf8");
fileData = JSON.parse(fileData);
app.use(cors());
app.get("/", function (req, res, next) {
    res.json(fileData);
});
app.post("/", function (req, res, next) {
    // let name = JSON.parse(req.body);
    res.json({ message: "success" });
});
// Start the Express server
app.listen(3000, function () { return console.log("Server running on port 3000!"); });
