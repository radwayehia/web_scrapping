const cheerio = require("cheerio");
const request = require("request");
const fs = require("fs");
request(
  "https://developers.google.com/public-data/docs/canonical/countries_csv",
  (err, res, html) => {
    if (!err && res.statusCode === 200) {
      const $ = cheerio.load(html);
      const coords = [];
      $("table > tbody")
        .find("tr")
        .each((i, e) => {
          const country = {};
          if (i === 0) {
            return;
          } else {
            $(e)
              .find("td")
              .each((j, el) => {
                if (j === 1) {
                  country.latitude = $(el).text();
                }
                if (j === 0) {
                  country.country = $(el).text();
                }
                if (j === 2) {
                  country.longitude = $(el).text();
                }
                if (j === 3) {
                  country.name = $(el).text();
                }
              });
          }
          coords.push(country);
        });
      fs.writeFileSync("./countries_data.json", JSON.stringify(coords));
    }
  }
);
