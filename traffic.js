const request = require("request");
const cheerio = require("cheerio");
const data = require("./traffic.json");
const fs = require("fs");
const traffic = (country) => {
  request(
    `https://www.numbeo.com/traffic/country_result.jsp?country=${country}`,
    (err, res, html) => {
      const indexes = [];
      const traffic = [];
      if (!err && res.statusCode === 200) {
        console.log(country);
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
        $("h3").each((e, el) => {
          let obj;

          const key = $(el).text();
          obj = { [key]: [] };
          $(el)
            .next()
            .find("tbody > tr")
            .each((i, ele) => {
              $(ele)
                .find("td")
                .each((j, elem) => {
                  let innerKey;
                  let innerValue;
                  if (j === 0) {
                    innerKey = $(elem).text();
                    $(elem)
                      .next()
                      .each((x, eleme) => {
                        innerValue = $(eleme).text().slice(1, 10000);
                      });
                  }
                  if (innerKey && innerValue) {
                    obj[key].push({ [innerKey]: innerValue });
                  }
                });
            });
          traffic.push(obj);
        });
        const newData = data;
        newData.map((data, index) => {
          if (data.name === country) {
            newData[index] = {
              ...newData[index],
              indexes,
              traffic,
            };
          }
        });
        fs.writeFileSync("./traffic.json", JSON.stringify(newData));
      }
    }
  );
};
module.exports = traffic;
