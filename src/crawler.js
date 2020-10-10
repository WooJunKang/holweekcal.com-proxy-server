
import { BASE_URL } from '../config/base-url'


const puppeteer = require('puppeteer');



const holidayCrawler = async (countryCode) => {

  console.log('--crawling start--')

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(`${BASE_URL}${countryCode}/`);

  const holidayList = await page.evaluate(() => {

    const _array = [];
    const holidayAllEle = document.querySelector('tbody').querySelectorAll("[id*='tr']")

    for (let ele of holidayAllEle) {
      let obj = {};

      obj.holidayTitle = ele.querySelector('a').textContent
      obj.holidayType = ele.querySelectorAll('td')[2].textContent
      obj.dayDate = ele.querySelector('th').textContent
      obj.dayOfWeek = ele.querySelector('td.nw').textContent

      _array.push(obj);
    }

    return _array;

  })


  browser.close();

  return holidayList;

}


const countryCrawler = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(`${BASE_URL}`);

  const countryList = await page.evaluate(() => {
    const _array = [];
    const countryAllEle = document.querySelectorAll('.category-list__list');

    for (let ulList of countryAllEle) {
      let multipleCountry = ulList.querySelectorAll('li');
      for (let singleCountry of multipleCountry) {
        let obj = {};
        obj.countryCode = singleCountry.querySelector('a').getAttribute('href').split('/')[2]
        obj.countryTitle = singleCountry.querySelector('a').textContent;
        _array.push(obj);
      }
    }
    return _array;
  })

  browser.close();
  return countryList;

}



// holidayCrawler('south-korea')
//   .then(res => console.log(res));

countryCrawler()
  .then(res => {
    return res.map(country => country.countryCode)
  })
  .then(result => console.log(result));