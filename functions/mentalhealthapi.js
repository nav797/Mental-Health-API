const express = require("express");
const serverless = require("serverless-http");
const axios = require("axios");
const cheerio = require("cheerio");
const app = express();
const router = express.Router();
const affirmations = require("./affirmations");

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Mobile Safari/537.36",
};

router.get("/", (req, res) => {
  res.json("Welcome to the Mental Health and Wellness API");
});

app.get("/affirmation", (req, res) => {
  const random = affirmations[Math.floor(Math.random() * affirmations.length)];
  res.json({ affirmation: random });
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", true);
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

//app.use("/.netlify/functions/mentalhealthapi", router);
app.use("/", router);

//module.exports.handler = serverless(app);
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

//remove commented code from below for local testing
//module.exports = router;
