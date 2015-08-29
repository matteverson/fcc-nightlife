'use strict';

var config = require('../../config/environment');
var yelp = require("node-yelp");

var client = yelp.createClient({
  oauth: config.yelp,

  // Optional settings:
  httpClient: {
    maxSockets: 25  // ~> Default is 10
  }
});

exports.search = function(req, res) {
  client.search({
    category_filter: "nightlife",
    sort: 2, // best rating (The default, 0, returns best match)
    location: req.params.city
  }).then(function (data) {
    return res.json(data.businesses);
  }).catch(function (err) {
    return res.status(404).send(err.type);
  });
};
