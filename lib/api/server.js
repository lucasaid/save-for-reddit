"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// app.js
var express = require("express");
var fs_1 = __importDefault(require("fs"));
var cors = require("cors");
var bodyParser = require("body-parser");
// Create Express app
var app = express();
var CURRENT = process.cwd();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.get("/", function (req, res) {
    var fileData = fs_1.default.readFileSync("".concat(CURRENT, "/tmp/saved.json"), "utf8");
    fileData = JSON.parse(fileData);
    res.json(fileData);
});
app.put("/addTag/:id", function (req, res) {
    var postId = req.params.id;
    var tags = req.body.tag.toLowerCase();
    var fileData = JSON.parse(fs_1.default.readFileSync("".concat(CURRENT, "/tmp/saved.json"), "utf8"));
    var tagsArray = tags.split(",");
    fileData.map(function (post) {
        if (post.id === postId) {
            tagsArray.forEach(function (tag) {
                var trimmedTag = tag.trim();
                if (!post.tags.includes(trimmedTag) && trimmedTag !== "") {
                    post.tags.push(trimmedTag.trim());
                }
            });
        }
        return post;
    });
    var jsonstring = JSON.stringify(fileData);
    fs_1.default.writeFile("".concat(CURRENT, "/tmp/saved.json"), jsonstring, function () {
        res.json({ message: "success" });
    });
});
app.put("/removeTag/:id", function (req, res) {
    // let name = JSON.parse(req.body);
    res.json({ message: "success" });
});
app.put("/deletePost/:id", function (req, res) {
    var postId = req.params.id;
    var fileData = JSON.parse(fs_1.default.readFileSync("".concat(CURRENT, "/tmp/saved.json"), "utf8"));
    fileData.map(function (post) {
        if (post.id === postId) {
            post.delete = true;
        }
        return post;
    });
    var jsonstring = JSON.stringify(fileData);
    fs_1.default.writeFile("".concat(CURRENT, "/tmp/saved.json"), jsonstring, function () {
        res.json({ message: "success" });
    });
});
app.put("/restorePost/:id", function (req, res) {
    var postId = req.params.id;
    var fileData = JSON.parse(fs_1.default.readFileSync("".concat(CURRENT, "/tmp/saved.json"), "utf8"));
    fileData.map(function (post) {
        if (post.id === postId) {
            post.delete = false;
        }
        return post;
    });
    var jsonstring = JSON.stringify(fileData);
    fs_1.default.writeFile("".concat(CURRENT, "/tmp/saved.json"), jsonstring, function () {
        res.json({ message: "success" });
    });
});
// Start the Express server
app.listen(3000, function () { return console.log("Server running on port 3000!"); });
