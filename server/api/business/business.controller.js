'use strict';

var _ = require('lodash');
var Business = require('./business.model');

// Get list of businesss
exports.index = function(req, res) {
  Business.find(function (err, businesss) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(businesss);
  });
};

// Get a single business
exports.show = function(req, res) {
  Business.findById(req.params.id, function (err, business) {
    if(err) { return handleError(res, err); }
    if(!business) { return res.status(404).send('Not Found'); }
    return res.json(business);
  });
};

// Marks a user as attending a business.
exports.attend = function(req, res) {
  Business.findOne()
  .where('yelp_id').equals(req.body.yelp_id)
  .exec(function (err, business) {
    if(err) { return handleError(res, err); }
    if(!business) {
      Business.create(req.body, function(err, newBusiness) {
        if(err) { return handleError(res, err); }
        return res.status(201).json(newBusiness);
      });
    }
    else {
      var updated = _.merge(business, req.body);
      updated.save(function (err) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(updated);
      });
    };
  });
};

// Marks a user as NOT attending a business.
exports.unattend = function(req, res) {
  Business.findOne()
  .where('yelp_id').equals(req.body.yelp_id)
  .exec(function (err, business) {
    if(err) { return handleError(res, err); }
    if(business) {
      var updated = _.merge(business, req.body);
      updated.save(function (err) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(updated);
      });
    }
    else {
      return res.status(200);
    };
  });
};

// Creates a new business in the DB.
exports.create = function(req, res) {
  Business.create(req.body, function(err, business) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(business);
  });
};

// Updates an existing business in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Business.findById(req.params.id, function (err, business) {
    if (err) { return handleError(res, err); }
    if(!business) { return res.status(404).send('Not Found'); }
    var updated = _.merge(business, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(business);
    });
  });
};

// Deletes a business from the DB.
exports.destroy = function(req, res) {
  Business.findById(req.params.id, function (err, business) {
    if(err) { return handleError(res, err); }
    if(!business) { return res.status(404).send('Not Found'); }
    business.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
