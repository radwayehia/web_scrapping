const request = require("request");
const fs = require("fs");
const cheerio = require("cheerio");
const data = require("./healthCare.json");
const healthCare = (country) => {
  request(
    `https://www.numbeo.com/health-care/country_result.jsp?country=${country}`,
    (err, res, html) => {
      const healthCare = [];
      if (!err && res.statusCode === 200) {
        const $ = cheerio.load(html);
        $(".table_builder_with_value_explanation > tbody")
          .find("tr")
          .each((i, el) => {
            if (i > 0) {
              $(el)
                .find("td")
                .each((e, ele) => {
                  let key;
                  let value;
                  if (e === 0) {
                    key = $(ele).text();
                    value = [
                      $(ele).next().next().text(),
                      $(ele).next().next().next().text().slice(1, 10000),
                    ];
                    healthCare.push({ [key]: value });
                  }
                });
            }
          });
        const placeHolder = data;
        placeHolder.map((arrData, index) => {
          if (arrData.name === country) {
            placeHolder[index] = {
              ...placeHolder[index],
              "Health care": healthCare,
            };
          }
        });
        fs.writeFileSync("./healthCare.json", JSON.stringify(placeHolder));
      }
    }
  );
};
module.exports = healthCare;
