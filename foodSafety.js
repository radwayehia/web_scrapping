const fs = require("fs");
const cheerio = require("cheerio");
const request = require("request");
request(
  "https://impact.economist.com/sustainability/project/food-security-index/Index",
  (err, res, html) => {
    if (!err && res.statusCode === 200) {
      const $ = cheerio.load(html);

      console.log($(".tabs-pane").text());
    }
  }
);
