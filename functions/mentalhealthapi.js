const express = require("express");
const serverless = require("serverless-http");
const axios = require("axios");
const cheerio = require("cheerio");
const app = express();
const router = express.Router();

router.get("/", (req, res) => {
  res.json("Welcome to the Mental Health and Wellness API");
});

router.get("/affirmation/", (req, res) => {
  const symbol = req.params.symbol;

  const url =
    "https://www.louisehay.com/101-best-louise-hay-positive-affirmations/";

  axios
    .get(url)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const affirmations = [];

      $("ol li").each((_, el) => {
        const text = $(el).text().trim();
        if (text) affirmations.push(text);
      });

      const random =
        affirmations[Math.floor(Math.random() * affirmations.length)];
      res.json({ affirmation: random });
    })
    .catch((err) => {
      console.error("Scraping failed:", err.message);
      res
        .status(500)
        .json({ error: "Scraping failed. Please try again later." });
    });
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
