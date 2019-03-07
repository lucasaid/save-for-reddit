// app.js
const express = require("express");
import fs from "fs";
var cors = require("cors");

// Create Express app
const app = express();

const CURRENT: string = process.cwd();
let fileData = fs.readFileSync(`${CURRENT}/tmp/saved.json`, "utf8");
fileData = JSON.parse(fileData);

app.use(cors());

app.get("/", (req: any, res: any, next: any) => {
  res.json(fileData);
});

app.post("/", (req: any, res: any, next: any) => {
  // let name = JSON.parse(req.body);
  res.json({ message: "success" });
});

// Start the Express server
app.listen(3000, () => console.log("Server running on port 3000!"));
