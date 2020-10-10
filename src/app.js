const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
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
app.get('/add/countries', (req, res) => {
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

// holidayCrawler('south-korea', 2020)
//   .then(res => console.log(res))
//   .catch(err => console.log(err));
