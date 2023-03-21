#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var snoowrap_1 = __importDefault(require("snoowrap"));
var fs_1 = __importDefault(require("fs"));
var mkdirp_1 = __importDefault(require("mkdirp"));
var cli_spinner_1 = require("cli-spinner");
var readline_sync_1 = __importDefault(require("readline-sync"));
var child_process_1 = require("child_process");
var helpers_1 = require("./scripts/helpers");
// Clear screen
process.stdout.write("\x1b[2J");
process.stdout.write("\x1b[0f");
var CURRENT = __dirname;
require("dotenv").config();
// Args
var grab = process.argv.indexOf("-g") > -1 ? true : false;
var grabAll = process.argv.indexOf("-ga") > -1 ? true : false;
var limitIndex = process.argv.indexOf("-l");
var limit = null;
if (limitIndex > -1) {
    limit = process.argv[limitIndex + 1];
}
// Remove this later
var fileExists = fs_1.default.existsSync("".concat(CURRENT, "/../tmp/saved.json"));
var fileArray = [];
var fileJSON = null;
if (fileExists && !grabAll) {
    var fileData = fs_1.default.readFileSync("".concat(CURRENT, "/../tmp/saved.json"), "utf8");
    fileJSON = JSON.parse(fileData);
    fileArray = fileJSON.map(function (item) {
        return item.id;
    });
}
if (grab || grabAll || !fileExists) {
    var clientId = void 0, clientSecret = void 0, username = void 0, password = void 0, refreshToken = void 0, accessToken = void 0;
    var envExists = fs_1.default.existsSync("".concat(CURRENT, "/../.env"));
    if (!process.env.CLIENT_ID ||
        !process.env.CLIENT_SECRET ||
        !process.env.REDDIT_USER ||
        !process.env.REDDIT_PASS ||
        !process.env.REFRESH_TOKEN ||
        !process.env.ACCESS_TOKEN ||
        !envExists) {
        console.log((0, helpers_1.styleText)("Reddit data is not present, please fill out reddit credentials", "red"));
        clientId = readline_sync_1.default.question((0, helpers_1.styleText)("Please enter reddit Client ID: ", "yellow"));
        clientSecret = readline_sync_1.default.question((0, helpers_1.styleText)("Please enter reddit Client Secret: ", "yellow"));
        username = readline_sync_1.default.question((0, helpers_1.styleText)("Please enter reddit Username: ", "yellow"));
        password = readline_sync_1.default.question((0, helpers_1.styleText)("Please enter reddit Password: ", "yellow"), {
            hideEchoBack: true
        });
        fs_1.default.writeFileSync("".concat(CURRENT, "/../.env"), "CLIENT_ID=".concat(clientId, "\nCLIENT_SECRET=").concat(clientSecret, "\nREDDIT_USER=").concat(username, "\nREDDIT_PASS=").concat(password));
    }
    else {
        clientId = process.env.CLIENT_ID;
        clientSecret = process.env.CLIENT_SECRET;
        username = process.env.REDDIT_USER;
        password = process.env.REDDIT_PASS;
        refreshToken = process.env.REFRESH_TOKEN;
        accessToken = process.env.ACCESS_TOKEN;
    }
    var r = new snoowrap_1.default({
        userAgent: "reddit-saved-node",
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
        accessToken: accessToken
        // username,
        // password
    });
    var spinner = new cli_spinner_1.Spinner("processing.. %s");
    spinner.setSpinnerString("|/-\\");
    spinner.start();
    var processData = function (data) {
        console.log("\nSaved Posts: ".concat(data.length, "\n"));
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
                parent_id: item.parent_id ? item.parent_id : false,
                link_title: item.link_title ? item.link_title : "",
                tags: [item.subreddit.display_name],
                deleted: false
            };
        });
        if (fileJSON) {
            formattedData = formattedData.concat(fileJSON);
        }
        var jsonstring = JSON.stringify(formattedData);
        (0, mkdirp_1.default)("".concat(CURRENT, "/../tmp"), function (err) {
            if (err)
                return false;
            fs_1.default.writeFile("".concat(CURRENT, "/../tmp/saved.json"), jsonstring, function () {
                spinner.stop(true);
                runServer();
            });
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
    runServer();
}
function runServer() {
    console.log("Running node server...");
    var buildExists = fs_1.default.existsSync("".concat(CURRENT, "/../build"));
    if (!buildExists) {
        console.log("Building front end...");
        (0, child_process_1.execSync)("cd ".concat(CURRENT, " && cd \"../src/server\" && yarn install && yarn build"), {
            stdio: "inherit"
        });
    }
    (0, child_process_1.execSync)("cd ".concat(CURRENT, " && yarn run server"), { stdio: "inherit" });
}
