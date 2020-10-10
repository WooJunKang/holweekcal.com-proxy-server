
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var holidayInfoSchema = new Schema({
  name: String,
  type: String,
  year: Number,
  day_date: String,
  day_of_week: String,
  updated_at: String

});

module.exports = mongoose.model('HolidayInfo', holidayInfoSchema);

