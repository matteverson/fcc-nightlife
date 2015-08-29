'use strict';

angular.module('fccNightlifeApp')
  .controller('MainCtrl', function ($scope, $http, Auth, $location) {
    var currentUser = Auth.getCurrentUser();
    //$scope.businesses = [];
    $scope.businesses = [];
    $scope.city = '';
    $scope.searching = false;

    $scope.search = function() {
      $scope.searching = true;
      $http.get('/api/search/' + $scope.city).success(function(businesses) {
        $scope.businesses = businesses;
        $scope.searching = false;
      });
    };

    $scope.isAttending = function(business) {
      return (business.attending && business.attending.indexOf(currentUser._id) !== -1);
    };

    $scope.attend = function(business) {
      if (!Auth.isLoggedIn()) {
        $location.path('/login');
      }

      var i = $scope.businesses.indexOf(business);
      if (!$scope.isAttending(business)) {
        $http.post('/api/businesses/attend', {yelp_id: business.id, attending: [currentUser._id]})
        .success(function(result) {
          if ($scope.businesses[i].attending) {
            $scope.businesses[i].attending.push(currentUser._id);
          }
          else {
            $scope.businesses[i].attending = [currentUser._id];
          }
        });
      }
      else {
        var newAttendees = business.attending.filter(function(user) { return user !== currentUser._id});
        $scope.businesses[i].attending = newAttendees;
        $http.post('/api/businesses/unattend', {yelp_id: business.id, attending: newAttendees});
      }
    };
  });
