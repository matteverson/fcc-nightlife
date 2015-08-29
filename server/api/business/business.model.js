'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BusinessSchema = new Schema({
  yelp_id: String,
  attending: [{type: Schema.Types.ObjectId, ref: 'User'}]
});

module.exports = mongoose.model('Business', BusinessSchema);
