require("dotenv").config();
import snoowrap from "snoowrap";

const r = new snoowrap({
  userAgent: "reddit-saved-node",
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  username: process.env.REDDIT_USER,
  password: process.env.REDDIT_PASS
});
