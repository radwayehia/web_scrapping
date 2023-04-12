const fs = require("fs");
const request = require("request");
const cheerio = require("cheerio");
const getCountries = () => {
  request("https://www.numbeo.com/cost-of-living", (err, res, html) => {
    const names = [];
    if (!err && res.statusCode === 200) {
      const $ = cheerio.load(html);
      const container = $(".related_links > tbody > tr ").each((i, el) => {
        $(el)
          .find("a")
          .each((e, ele) => {
            const name = $(ele).text();
            names.push(name);
          });
      });
    }
    const newName = [];
    names.forEach((Cname) => {
      newName.push({ name: Cname });
    });
    fs.writeFileSync("passport.json", JSON.stringify(newName));
  });
};
module.exports = getCountries;
