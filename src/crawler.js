
const puppeteer = require('puppeteer');
const CONFIG = require('../config/config.json')

/* https://www.timeanddate.com/holidays/south-korea/2019 */

const holidayCrawler = async (countryCode, year) => {

  console.log(`crawling start (country: ${countryCode} / year: ${year})`)
  console.log('url is: ', `${CONFIG.BASE_URL}${countryCode}/${year}`);



  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(`https://www.timeanddate.com/holidays/${countryCode}/${year}`);

  const holidayList = await page.evaluate(() => {

    const _array = [];
    const YEAR = document.querySelector('#year').value;
    const holidayAllEle = document.querySelector('tbody').querySelectorAll("[id*='tr']")


    for (let ele of holidayAllEle) {
      let obj = {};
      obj.name = ele.querySelector('a').textContent
      obj.type = ele.querySelectorAll('td')[2].textContent
      obj.year = YEAR
      obj.day_date = ele.querySelector('th').textContent
      obj.day_of_week = ele.querySelector('td.nw').textContent
      _array.push(obj);
    }

    return _array;

  })
  console.log(holidayList);
  browser.close();

  return holidayList;

}


const countryCrawler = async () => {

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(`${CONFIG.BASE_URL}`);

  const countryList = await page.evaluate(() => {
    const _array = [];
    const countryAllEle = document.querySelectorAll('.category-list__list');

    for (let ulList of countryAllEle) {
      let multipleCountry = ulList.querySelectorAll('li');
      for (let singleCountry of multipleCountry) {
        let obj = {};
        obj.country_code = singleCountry.querySelector('a').getAttribute('href').split('/')[2]
        obj.country_name = singleCountry.querySelector('a').textContent;
        _array.push(obj);
      }
    }
    return _array;
  })

  browser.close();
  return countryList;

}

module.exports.holidayCrawler = holidayCrawler;
module.exports.countryCrawler = countryCrawler;

// holidayCrawler('south-korea', 2020)
//   .then(res => console.log(res))
//   .catch(err => console.log(err));

// countryCrawler()
//   .then(res => {
//     // return res.map(country => country.countryCode)
//     return res
//   })
//   .then(result => console.log(result))
//   .catch(err => console.log(err))
