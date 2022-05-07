const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");

const timer = (ms) => new Promise((res) => setTimeout(res, ms));

const json = { data: [] };
let empty = 0;

const scraper = (form) => {
  let scraperData;
  const url = "http://www.oservicethai.com/tonpao/check_popup.php?checkit=on";
  request.post(
    {
      url,
      form,
    },
    (err, httpResponse, body) => {
      if (err) {
        console.log(err);
      }
      const $ = cheerio.load(body);

      const status = $("table b font").text();

      $("table b").remove();
      const data = $("table").text().split("  ");
      if (data[2]) {
        scraperData = {
          no: data[1],
          name: data[2],
          date: data[3],
          time: data[4],
          title: data[5],
          details: data[6],
          status,
        };
        json.data.push(scraperData);
      } else {
        empty += 1;
      }
    }
  );

  return scraperData;
};

const main = async () => {
  for (let index = 1; index <= 1000; index++) {
    console.log("scraper: #", index);
    const form = {
      ID_CHECK: index,
      YOM_CHECK: 2565,
    };
    scraper(form);
    await timer(250);

    if (empty > 2) {
      fs.writeFile("data.json", JSON.stringify(json), function (err) {
        if (err) throw err;
        console.log("complete");
      });
      break;
    }
  }
};

main();
