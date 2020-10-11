const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const CountryList = require('../models/countryListSchema');
const HolidayInfo = require('../models/holidayInfoSchema');
const CONFIG = require('../config/config.json');
const { holidayCrawler, countryCrawler } = require('./crawler');
const { getCurDate } = require('./currentDate');
const { update } = require('../models/countryListSchema');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.listen(CONFIG.PORT, () => console.log(`proxy server is running on port: ${CONFIG.PORT}`));

mongoose.connect(CONFIG.MONGO_DB_CODE, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => console.log('connected to db'))
  .catch((err) => console.log(err));


/* input data into DB*/

/* store country list data to DB */
app.post('/add/countries', (req, res) => {
  if (CONFIG.AUTH_USER.includes(req.headers.authorization)) {
    countryCrawler()
      .then(countries => {
        const currentDate = getCurDate();
        countries = countries.map(country => ({ ...country, updated_at: currentDate }))
        // console.log(countries)
        CountryList.insertMany(countries)
          .then(() => res.send('all data is inserted!'))
          .catch((err) => console.log(err))
      })
  } else {
    res.status(401)
      .send('You are not Woojun !');
  }
})

app.get('/countries', (req, res) => {
  CountryList.find()
    .exec((err, docs) => {
      if (err) {
        console.log(err)
      } else {
        res.json(docs);
      }
    })
})

app.post('/add/holidays/year/:year/country/:country', (req, res) => {
  if (CONFIG.AUTH_USERS.includes(req.headers.authorization)) {

    const { year } = req.params;
    const { country } = req.params;

    holidayCrawler(country, year)
      .then(holidays => {
        const currentDate = getCurDate();
        const newHolidayInfo = new HolidayInfo({
          country_code: country,
          year: year,
          updated_at: currentDate,
          data: holidays
        })

        newHolidayInfo.save()
          .then((result) => {
            res.send(result)
          })
          .catch((err) => {
            console.log(err);
          })
      })

  } else {
    res.status(401)
      .send('You are not Woojun !');
  }
})

app.get('/holidays/year/:year/country/:country', (req, res) => {
  const { year } = req.params;
  const { country } = req.params;
  HolidayInfo.findOne({ country_code: country, year: year })
    .exec((err, docs) => {
      if (err) {
        console.log(err)
      } else {
        res.json(docs);
      }
    })
})