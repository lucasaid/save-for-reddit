#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
var snoowrap_1 = __importDefault(require("snoowrap"));
var fs_1 = __importDefault(require("fs"));
var cli_spinner_1 = require("cli-spinner");
// Clear screen
process.stdout.write("\x1b[2J");
process.stdout.write("\x1b[0f");
var CURRENT = process.cwd();
var r = new snoowrap_1.default({
    userAgent: "reddit-saved-node",
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    username: process.env.REDDIT_USER,
    password: process.env.REDDIT_PASS
});
var spinner = new cli_spinner_1.Spinner("processing.. %s");
spinner.setSpinnerString("|/-\\");
spinner.start();
r.getMe()
    .getSavedContent({ limit: 100 })
    .fetchAll()
    .then(function (data) {
    console.log("\n" + data.length);
    var jsondata = JSON.stringify(data);
    fs_1.default.writeFile(CURRENT + "/saved.json", jsondata, function () {
        spinner.stop();
    });
});
