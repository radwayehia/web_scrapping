const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const data = require("./qualityOfLive.json");

const qol = (country) => {
  request(
    `https://www.numbeo.com/quality-of-life/country_result.jsp?country=${country}`,
    (err, res, html) => {
      const $ = cheerio.load(html);
      const qualityOfLiveIndex = [];
      const qualityOfLiving = [];
      if (!err && res.statusCode === 200) {
        $(".table_indices")
          .find("tbody > tr")
          .each((i, el) => {
            if (i === 1) {
              $(el)
                .find("td")
                .each((e, ele) => {
                  if (e === 1) {
                    qualityOfLiveIndex.push($(ele).text().slice(1, 10000));
                  }
                });
            }
          });
        $("table").each((i, el) => {
          if (i === 2) {
            $(el)
              .find("tbody > tr")
              .each((e, ele) => {
                $(ele)
                  .find("td")
                  .each((j, elem) => {
                    if (j === 0) {
                      const th = $(elem).text().split(`'\'`)[0];
                      const td = $(elem).next().text();
                      const word = $(elem)
                        .next()
                        .next()
                        .find("span")
                        .text()
                        .slice(1, 1000);
                      if (th.startsWith("ƒ")) {
                        qualityOfLiving.push({
                          [th.slice(2, 10000)]: [qualityOfLiveIndex[0], word],
                        });
                        return;
                      }
                      if (th) {
                        qualityOfLiving.push({
                          [th.slice(0, th.length - 1)]: [td, word],
                        });
                      }
                      //   console.log(word);
                    }
                  });
              });
          }
        });
      }
      const newData = data;
      newData.map((data, index) => {
        if (data.name === country) {
          newData[index] = {
            ...newData[index],
            "Quality of Living": qualityOfLiving,
          };
        }
      });
      if (newData) {
        fs.writeFileSync("qualityOfLive.json", JSON.stringify(newData));
      } else {
        console.log("error");
      }
    }
  );
};
module.exports = qol;
