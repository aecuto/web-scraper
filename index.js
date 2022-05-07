const request = require("request");
const cheerio = require("cheerio");

const timer = (ms) => new Promise((res) => setTimeout(res, ms));

const scraper = async (form) => {
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

      $("table b").remove();

      const data = $("table").text().split("  ");

      if (data[2] === "คัมภีร์ ต้นอ้อย") {
        console.log(data);
      }
    }
  );
};

const main = async () => {
  for (let index = 1; index <= 358; index++) {
    console.log("scraper: #", index);
    const form = {
      ID_CHECK: index,
      YOM_CHECK: 2565,
    };
    scraper(form);
    await timer(1000);
  }
};

main();
