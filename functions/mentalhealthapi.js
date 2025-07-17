const express = require("express");
const serverless = require("serverless-http");

const app = express();
const router = express.Router();

const fs = require("fs");

const affirmationsPath = path.join(__dirname, "affirmations.json");
const affirmationsData = JSON.parse(fs.readFileSync(affirmationsPath, "utf-8"));
const allAffirmations = affirmationsData.flatMap((theme) => theme.affirmations);

router.get("/", (req, res) => {
  res.json("Welcome to the Affirmations API");
});

// get random affirmation from list
app.get("/affirmations/random", (req, res) => {
  const randomAffirmation =
    allAffirmations[Math.floor(Math.random() * allAffirmations.length)];
  res.json({ affirmation: randomAffirmation });
});

//get all themes
app.get("/affirmations/themes", (req, res) => {
  const themes = affirmationsData.map((item) => item.theme);
  res.json({ themes });
});

// get random affirmation from paticular theme
app.get("/affirmations/random/:theme", (req, res) => {
  const theme = req.params.theme;
  const themeData = affirmationsData.find(
    (item) => item.theme.toLowerCase() === theme.toLowerCase()
  );

  if (!themeData) {
    return res.status(404).json({ error: "Theme not found" });
  }

  // Get a random affirmation from the theme
  const randomAffirmation =
    themeData.affirmations[
      Math.floor(Math.random() * themeData.affirmations.length)
    ];

  res.json({ theme: themeData.theme, affirmation: randomAffirmation });
});

app.get("/affirmations/search", (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ error: "Query parameter is required." });
  }

  const results = [];

  affirmationsData.forEach((themeObj) => {
    themeObj.affirmations.forEach((affirmation) => {
      if (affirmation.toLowerCase().includes(query.toLowerCase())) {
        results.push(affirmation);
      }
    });
  });

  if (results.length === 0) {
    return res
      .status(404)
      .json({ message: "No affirmations found matching your query." });
  }

  res.json({ query, affirmations: results });
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

app.use("/.netlify/functions/mentalhealthapi", router);

module.exports.handler = serverless(app);
