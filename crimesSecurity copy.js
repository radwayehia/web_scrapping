const request = require("request");
const cheerio = require("cheerio");
const data = require("./indexCs.json");
const fs = require("fs");
const getSecCrime = (country) => {
  let goOn = true;
  // data.forEach((data) => {
  //   if (data.name === country) {
  //     if (data.crime) {
  //       goOn = false;
  //     }
  //   }
  //   return goOn;
  // });
  if (goOn) {
    request(
      `https://www.numbeo.com/crime/country_result.jsp?country=${country}`,
      (err, res, html) => {
        const CrimeIndex = [];
        const SafetyIndex = [];
        if (!err && res.statusCode === 200) {
          const $ = cheerio.load(html);
          //   const columnName = $(".table_builder_with_value_explanation ")
          //     .find("td[class='columnWithName']")
          //     .text();
          //   console.log(columnName);
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
        }
        const newData = data;
        newData.map((data, index) => {
          if (data.name === country) {
            newData[index] = {
              ...newData[index],
              crimeIndex: CrimeIndex[0],
              safetyIndex: SafetyIndex[0],
            };
          }
        });
        fs.writeFileSync("./indexCs.json", JSON.stringify(newData));
      }
    );
  } else {
    // console.log("done");
  }
};
module.exports = getSecCrime;
