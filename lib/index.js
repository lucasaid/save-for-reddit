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
var child_process_1 = require("child_process");
// Clear screen
process.stdout.write("\x1b[2J");
process.stdout.write("\x1b[0f");
var CURRENT = process.cwd();
// Args
var grab = process.argv.indexOf("-g") > -1 ? true : false;
var limitIndex = process.argv.indexOf("-l");
var limit = null;
if (limitIndex > -1) {
    limit = process.argv[limitIndex + 1];
}
// Remove this later
var fileExists = fs_1.default.existsSync(CURRENT + "/tmp/saved.json");
var fileArray = [];
var fileJSON = null;
if (fileExists) {
    var fileData = fs_1.default.readFileSync(CURRENT + "/tmp/saved.json", "utf8");
    fileJSON = JSON.parse(fileData);
    fileArray = fileJSON.map(function (item) {
        return item.id;
    });
}
if (grab) {
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
    var processData = function (data) {
        console.log("\nSaved Posts: " + data.length + "\n");
        var filteredData = data.filter(function (item) {
            return !fileArray.includes(item.id);
        });
        var formattedData = filteredData.map(function (item) {
            return {
                id: item.id,
                name: item.name,
                title: item.title ? item.title : item.body ? item.body : "",
                selftext: item.selftext ? item.selftext : "",
                selftext_html: item.selftext_html
                    ? item.selftext_html
                    : item.body_html
                        ? item.body_html
                        : "",
                url: item.url ? item.url : "",
                permalink: item.permalink,
                subreddit: item.subreddit,
                thumbnail: item.thumbnail ? item.thumbnail : "",
                post_hint: item.post_hint ? item.post_hint : "",
                created: item.created ? item.created : "",
                over_18: item.over_18 ? item.over_18 : false,
                preview: item.preview ? item.preview : "",
                secure_media: item.secure_media ? item.secure_media : "",
                is_video: item.is_video ? item.is_video : false,
                media: item.media ? item.media : "",
                author: item.author,
                categories: [item.subreddit]
            };
        });
        if (fileJSON) {
            formattedData = formattedData.concat(fileJSON);
        }
        var jsonstring = JSON.stringify(formattedData);
        fs_1.default.writeFile(CURRENT + "/tmp/saved.json", jsonstring, function () {
            spinner.stop(true);
            console.log("Running node server...");
            child_process_1.exec("yarn run server");
        });
    };
    if (limit) {
        console.log(limit);
        r.getMe()
            .getSavedContent({ limit: parseInt(limit, 10) })
            .then(processData);
    }
    else {
        r.getMe()
            .getSavedContent()
            .fetchAll()
            .then(processData);
    }
}
else {
    console.log("Running node server...");
    var process_1 = child_process_1.exec("yarn run server");
    if (process_1.stdout) {
        process_1.stdout.on("data", function (data) {
            console.log(data);
        });
    }
}
