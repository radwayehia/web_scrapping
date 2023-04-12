const request = require("request");
const cheerio = require("cheerio");
const data = require("./pollution.json");
const fs = require("fs");
const getSecCrime = (country) => {
  let goOn = true;

  if (goOn) {
    request(
      `https://www.numbeo.com/pollution/country_result.jsp?country=${country}`,
      (err, res, html) => {
        const crime = [];
        const safety = [];
        const CrimeIndex = [];
        const SafetyIndex = [];
        if (!err && res.statusCode === 200) {
          const $ = cheerio.load(html);
          //   const columnName = $(".table_builder_with_value_explanation ")
          //     .find("td[class='columnWithName']")
          //     .text();
          //   console.log(columnName);
          $(".table_builder_with_value_explanation > tbody ").each((i, el) => {
            $(el)
              .find("td[class='columnWithName']")
              .each((e, el) => {
                const td = $(el).text();
                const th = $(el).next().next().text();
                const word = $(el).next().next().next().text();
                if (i === 0) {
                  crime.push({ [td]: [th, word.slice(1, word.length)] });
                  return;
                }
                safety.push({ [td]: [th, word.slice(1, word.length)] });
              });
          });
          $(".table_indices > tbody ").each((i, el) => {
            $(el)
              .find("tr")
              .each((e, el) => {
                $(el)
                  .find("td")
                  .each((j, elem) => {
                    if (e === 1) {
                      const data = $(elem).next().text();
                      CrimeIndex.push(data.slice(1, 1000));
                    }
                    if (e === 2) {
                      const data = $(elem).next().text();

                      SafetyIndex.push(data.slice(1, 1000));
                    }
                  });
              });
          });

          const newData = data;
          newData.map((data, index) => {
            if (data.name === country) {
              newData[index] = {
                ...newData[index],
                indexes: [CrimeIndex[0], SafetyIndex[0]],
                pollution: crime,
                Cleanliness: safety,
              };
            }
          });

          fs.writeFileSync("./pollution.json", JSON.stringify(newData));
          console.log(country);
        } else console.log(err);
      }
    );
  } else {
  }
};
module.exports = getSecCrime;
