'use strict';

var config = require('../../config/environment');
var Business = require('../business/business.model');
var yelp = require('node-yelp');

var client = yelp.createClient({
  oauth: config.yelp,

  // Optional settings:
  httpClient: {
    maxSockets: 25  // ~> Default is 10
  }
});

var populateAttendees = function(yelp_item) {
  return new Promise(function (resolve, reject) {
    Business.findOne({yelp_id: yelp_item.id}, 'attending', function(err, dbBusiness) {
      if (err) {
        return reject(err);
      }

      if (!dbBusiness) {
        return resolve(yelp_item);
      }

      yelp_item.attending = dbBusiness.attending;
      return resolve(yelp_item);
    });
  });
};

exports.search = function(req, res) {
  client.search({
    category_filter: "nightlife",
    sort: 2, // best rating (The default, 0, returns best match)
    location: req.params.city
  })
  .then(function (data) {
      return Promise.all(data.businesses.map(populateAttendees));
  })
  .catch(function (err) {
    return res.status(404).send(err.type);
  })
  .done(function (data) {
    return res.json(data);
  });
};
