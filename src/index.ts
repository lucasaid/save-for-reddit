#!/usr/bin/env node

require("dotenv").config();
import snoowrap from "snoowrap";
import fs from "fs";
import { Spinner } from "cli-spinner";

// Clear screen
process.stdout.write("\x1b[2J");
process.stdout.write("\x1b[0f");

const CURRENT: string = process.cwd();

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

r.getMe()
  .getSavedContent({ limit: 100 })
  .fetchAll()
  .then((data: any) => {
    console.log(`\n${data.length}`);
    let jsondata = JSON.stringify(data);
    fs.writeFile(`${CURRENT}/tmp/saved.json`, jsondata, () => {
      spinner.stop();
    });
  });
