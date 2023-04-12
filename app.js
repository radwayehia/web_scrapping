const qol = require('./qualityOfLive')
const data = require("./countries_data.json");
data.forEach((arrData) => {
  if (!arrData["Cost of Living"]) {
    qol(arrData.name);
  } else {
  }
});
