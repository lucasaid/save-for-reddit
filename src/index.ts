#!/usr/bin/env node

require("dotenv").config();
import snoowrap from "snoowrap";
import fs from "fs";
import { Spinner } from "cli-spinner";
import { exec } from "child_process";

// Clear screen
process.stdout.write("\x1b[2J");
process.stdout.write("\x1b[0f");

const CURRENT: string = process.cwd();

// Args
const grab: boolean = process.argv.indexOf("-g") > -1 ? true : false;

const limitIndex: number = process.argv.indexOf("-l");
let limit = null;
if (limitIndex > -1) {
  limit = process.argv[limitIndex + 1];
}

// Remove this later
let fileExists = fs.existsSync(`${CURRENT}/tmp/saved.json`);
let fileArray = [];
let fileJSON = null;
if (fileExists) {
  let fileData = fs.readFileSync(`${CURRENT}/tmp/saved.json`, "utf8");
  fileJSON = JSON.parse(fileData);
  fileArray = fileJSON.map(item => {
    return item.id;
  });
}
if (grab) {
  const r = new snoowrap({
    userAgent: "reddit-saved-node",
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    username: process.env.REDDIT_USER,
    password: process.env.REDDIT_PASS
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
        categories: [item.subreddit]
      };
    });
    if (fileJSON) {
      formattedData = formattedData.concat(fileJSON);
    }
    let jsonstring = JSON.stringify(formattedData);
    fs.writeFile(`${CURRENT}/tmp/saved.json`, jsonstring, () => {
      spinner.stop(true);
      console.log(`Running node server...`);
      exec(`yarn run server`);
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
  console.log(`Running node server...`);
  let process = exec(`yarn run server`);
  if (process.stdout) {
    process.stdout.on("data", function(data: any) {
      console.log(data);
    });
  }
}
