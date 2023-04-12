const encodedParams = new URLSearchParams();
encodedParams.append("q", "Hello, world!");
encodedParams.append("target", "ar");
encodedParams.append("source", "en");

const options = {
  method: "POST",
  url: "https://google-translate1.p.rapidapi.com/language/translate/v2",
  headers: {
    "content-type": "application/x-www-form-urlencoded",
    "Accept-Encoding": "application/gzip",
    "X-RapidAPI-Host": "google-translate1.p.rapidapi.com",
    "X-RapidAPI-Key": "8f84780caemsh75c2e8a1bb415d9p13cef7jsn153856910264",
  },
  data: encodedParams,
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data.data);
  })
  .catch(function (error) {
    console.error(error);
  });
