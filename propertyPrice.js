const request = require("request");
const newData = require("./property.json");
const fs = require("fs");
const cheerio = require("cheerio");
const PP = (country) => {
  request(
    `https://www.numbeo.com/property-investment/country_result.jsp?country=${country}`,
    (err, res, html) => {
      const indexes = [];

      let data = {};
      const keys = [];
      if ((!err, res.statusCode === 200)) {
        const $ = cheerio.load(html);
        $(".table_indices > tbody")
          .find("tr")
          .each((e, el) => {
            if (e > 0) {
              $(el)
                .find("td")
                .each((i, ele) => {
                  if (i === 0) {
                    const key = $(ele).text();
                    const value = $(ele).next().text().slice(1, 10000);
                    indexes.push({ [key]: value });
                  }
                });
            }
          });
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
                    data[header.name].push({ [key]: value });
                  }
                });
            }
          });
      }
      const placeHolder = newData;
      placeHolder.map((arrData, index) => {
        if (arrData.name === country) {
          placeHolder[index] = {
            ...placeHolder[index],
            Indexes: indexes,
            "Property price": data,
          };
        }
      });
      console.log(country);
      fs.writeFileSync("./property.json", JSON.stringify(placeHolder));
    }
  );
};
module.exports = PP;
