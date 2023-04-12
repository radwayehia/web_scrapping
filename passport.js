const cheerio = require("cheerio");
const fs = require("fs");
const request = require("request");
const passport = () => {
  request("https://visaindex.com/", (err, res, html) => {
    if (!err && res.statusCode === 200) {
      const rating = {};
      const $ = cheerio.load(html);
      var first = { index: 0, place: 1, destination: 196 };
      $(".list-group.list-group-flush")
        .find("a")
        .each((i, el) => {
          const data = { ...$(el).attr() };
          const arrayName = data.href.split("/")[4].split("-");
          arrayName.splice(2, 10);
          const newName = arrayName.filter(
            (el) => el !== "ranking" && el !== "passport"
          );
          const name = newName.join(" ");
          const score = data.score;
          const ranking = data.rank;
          rating[name] = { score, ranking };
        });
      //   fs.writeFileSync("./passport.json", JSON.stringify(rating));
    }
  });
};
module.exports = passport;
