
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var contryListSchema = new Schema({
  country_code: String,
  country_name: String,
  updated_at: String
});

module.exports = mongoose.model('ContryList', contryListSchema);

