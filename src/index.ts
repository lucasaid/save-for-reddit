#!/usr/bin/env node

import snoowrap from "snoowrap";
import fs from "fs";
import { Spinner } from "cli-spinner";
import readlineSync from "readline-sync";
import { execSync } from "child_process";

import { styleText } from "./scripts/helpers";

// Clear screen
process.stdout.write("\x1b[2J");
process.stdout.write("\x1b[0f");

const CURRENT: string = __dirname;

require("dotenv").config();

// Args
const grab: boolean = process.argv.indexOf("-g") > -1 ? true : false;

const grabAll: boolean = process.argv.indexOf("-ga") > -1 ? true : false;

const limitIndex: number = process.argv.indexOf("-l");
let limit = null;
if (limitIndex > -1) {
  limit = process.argv[limitIndex + 1];
}

// Remove this later
let fileExists = fs.existsSync(`${CURRENT}/../tmp/saved.json`);
let fileArray = [];
let fileJSON = null;
if (fileExists && !grabAll) {
  let fileData = fs.readFileSync(`${CURRENT}/../tmp/saved.json`, "utf8");
  fileJSON = JSON.parse(fileData);
  fileArray = fileJSON.map(item => {
    return item.id;
  });
}
if (grab || grabAll || !fileExists) {
  let clientId, clientSecret, username, password;
  let envExists = fs.existsSync(`${CURRENT}/../.env`);
  if (
    !process.env.CLIENT_ID ||
    !process.env.CLIENT_SECRET ||
    !process.env.REDDIT_USER ||
    !process.env.REDDIT_PASS ||
    !envExists
  ) {
    console.log(
      styleText(
        `Reddit data is not present, please fill out reddit credentials`,
        "red"
      )
    );
    clientId = readlineSync.question(
      styleText(`Please enter reddit Client ID: `, "yellow")
    );
    clientSecret = readlineSync.question(
      styleText(`Please enter reddit Client Secret: `, "yellow")
    );
    username = readlineSync.question(
      styleText(`Please enter reddit Username: `, "yellow")
    );
    password = readlineSync.question(
      styleText(`Please enter reddit Password: `, "yellow"),
      {
        hideEchoBack: true
      }
    );
    fs.writeFileSync(
      `${CURRENT}/../.env`,
      `CLIENT_ID=${clientId}\nCLIENT_SECRET=${clientSecret}\nREDDIT_USER=${username}\nREDDIT_PASS=${password}`
    );
  } else {
    clientId = process.env.CLIENT_ID;
    clientSecret = process.env.CLIENT_SECRET;
    username = process.env.REDDIT_USER;
    password = process.env.REDDIT_PASS;
  }
  const r = new snoowrap({
    userAgent: "reddit-saved-node",
    clientId,
    clientSecret,
    username,
    password
  });

  var spinner = new Spinner("processing.. %s");
  spinner.setSpinnerString("|/-\\");
  spinner.start();

  const processData = (data: any): any => {
    console.log(`\nSaved Posts: ${data.length}\n`);
    let filteredData = data.filter((item: any) => {
      return !fileArray.includes(item.id);
    });
    let formattedData = filteredData.map((item: any) => {
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
    let jsonstring = JSON.stringify(formattedData);
    fs.writeFile(`${CURRENT}/../tmp/saved.json`, jsonstring, () => {
      spinner.stop(true);
      runServer();
    });
  };
  if (limit) {
    console.log(limit);
    r.getMe()
      .getSavedContent({ limit: parseInt(limit, 10) })
      .then(processData);
  } else {
    r.getMe()
      .getSavedContent()
      .fetchAll()
      .then(processData);
  }
} else {
  runServer();
}

function runServer() {
  console.log(`Running node server...`);
  let buildExists = fs.existsSync(`${CURRENT}/../build`);
  if (!buildExists) {
    console.log(`Building front end...`);
    execSync(
      `cd ${CURRENT} && cd "../src/server" && yarn install && yarn build`,
      {
        stdio: "inherit"
      }
    );
  }

  execSync(`cd ${CURRENT} && yarn run server`, { stdio: "inherit" });
}
