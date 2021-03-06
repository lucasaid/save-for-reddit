// app.js
const express = require("express");
import fs from "fs";
var cors = require("cors");
var bodyParser = require("body-parser");

// Create Express app
const app = express();

const CURRENT: string = process.cwd();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req: any, res: any) => {
  let fileData = fs.readFileSync(`${CURRENT}/tmp/saved.json`, "utf8");
  fileData = JSON.parse(fileData);
  res.json(fileData);
});

app.put("/addTag/:id", (req: any, res: any) => {
  let postId = req.params.id;
  let tags = req.body.tag.toLowerCase();
  let fileData = JSON.parse(
    fs.readFileSync(`${CURRENT}/tmp/saved.json`, "utf8")
  );
  let tagsArray = tags.split(",");
  fileData.map(post => {
    if (post.id === postId) {
      tagsArray.forEach(tag => {
        let trimmedTag = tag.trim();
        if (!post.tags.includes(trimmedTag) && trimmedTag !== "") {
          post.tags.push(trimmedTag.trim());
        }
      });
    }
    return post;
  });
  let jsonstring = JSON.stringify(fileData);
  fs.writeFile(`${CURRENT}/tmp/saved.json`, jsonstring, () => {
    res.json({ message: "success" });
  });
});

app.put("/removeTag/:id", (req: any, res: any) => {
  // let name = JSON.parse(req.body);
  res.json({ message: "success" });
});

app.put("/deletePost/:id", (req: any, res: any) => {
  let postId = req.params.id;
  let fileData = JSON.parse(
    fs.readFileSync(`${CURRENT}/tmp/saved.json`, "utf8")
  );
  fileData.map(post => {
    if (post.id === postId) {
      post.delete = true;
    }
    return post;
  });
  let jsonstring = JSON.stringify(fileData);
  fs.writeFile(`${CURRENT}/tmp/saved.json`, jsonstring, () => {
    res.json({ message: "success" });
  });
});
app.put("/restorePost/:id", (req: any, res: any) => {
  let postId = req.params.id;
  let fileData = JSON.parse(
    fs.readFileSync(`${CURRENT}/tmp/saved.json`, "utf8")
  );
  fileData.map(post => {
    if (post.id === postId) {
      post.delete = false;
    }
    return post;
  });
  let jsonstring = JSON.stringify(fileData);
  fs.writeFile(`${CURRENT}/tmp/saved.json`, jsonstring, () => {
    res.json({ message: "success" });
  });
});

// Start the Express server
app.listen(3000, () => console.log("Server running on port 3000!"));
