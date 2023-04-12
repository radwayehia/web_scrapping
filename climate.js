const request = require("request");
const fs = require("fs");
const data = require("./climate.json");
const cheerio = require("cheerio");
const climate = (country) => {
  request(
    `https://www.numbeo.com/climate/country_result.jsp?country=${country}`,
    (err, res, html) => {
      const climate = [];
      if (!err && res.statusCode === 200) {
        const $ = cheerio.load(html);
        $("table").each((t, tEl) => {
          if (t === 2) {
            $(tEl)
              .find("tbody > tr")
              .each((e, el) => {
                if (e > 0) {
                  $(el)
                    .find("td")
                    .each((i, ele) => {
                      if (i === 0) {
                        const key = $(ele).text().slice(1, 1000000000);
                        const value = $(ele).next().text().slice(1, 1000000000);
                        climate.push({ [key]: value });
                      }
                    });
                }
              });
          }
        });
      }
      const placeHolder = data;
      placeHolder.map((arrData, index) => {
        if (arrData.name === country) {
          placeHolder[index] = {
            ...placeHolder[index],
            Climate: climate,
          };
        }
      });
      fs.writeFileSync("./climate.json", JSON.stringify(placeHolder));
    }
  );
};
module.exports = climate;
