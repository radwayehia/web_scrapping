const fs = require("fs");
const request = require("request");
const newData = require("./costOfLiving.json");

const cheerio = require("cheerio");
const qol = (country) => {
  let goOn = true;

  if (goOn) {
    request(
      `https://www.numbeo.com/cost-of-living/country_result.jsp?country=${country}&displayCurrency=SAR`,
      (err, res, html) => {
        if (!err && res.statusCode === 200) {
          let data = {};
          const keys = [];
          const $ = cheerio.load(html);
          var header = { index: 0, name: "Restaurants" };
          $(".data_wide_table > tbody")
            .find("tr")
            .each((i, el) => {
              $(el)
                .find("th")
                .each((e, ele) => {
                  if (e === 0) {
                    header = { index: i, name: $(ele).text().slice(2, 1000) };
                  }
                });
              if (i === header.index) {
                const key = header.name;
                data[key] = [];
              } else {
                $(el)
                  .find("td")
                  .each((j, elem) => {
                    if (j === 0) {
                      const key = $(elem).text();
                      const value = $(elem).next().text();
                      data[header.name].push([{ [key]: value }]);
                    }
                  });
              }
            });
          const placeHolder = newData;
          placeHolder.map((arrData, index) => {
            if (arrData.name === country) {
              placeHolder[index] = {
                ...placeHolder[index],
                "Cost of Living": data,
              };
            }
          });
          fs.writeFileSync("./costOfLiving.json", JSON.stringify(placeHolder));
        }
      }
    );
  } else {
  }
};
module.exports = qol;
