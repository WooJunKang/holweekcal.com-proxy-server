
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var holidayInfoSchema = new Schema({
  country_code: String,
  year: Number,
  updated_at: String,
  data: Array
});

module.exports = mongoose.model('HolidayInfo', holidayInfoSchema);

