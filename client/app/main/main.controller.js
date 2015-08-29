'use strict';

angular.module('fccNightlifeApp')
  .controller('MainCtrl', function ($scope, $http, Auth) {
    var currentUser = Auth.getCurrentUser();
    //$scope.businesses = [];
    $scope.businesses = [{name: 'test', snippet_text: 'A really long test snippet about how awesome the restaurant is. Totally the best!'}];
    $scope.city = '';
    $scope.searching = false;

    $scope.search = function() {
      $scope.searching = true;
      $http.get('/api/search/' + $scope.city).success(function(businesses) {
        $scope.businesses = businesses;
        $scope.searching = false;
      });
    };

    $scope.attend = function(business) {
      $http.post('/api/businesses/attend', {yelp_id: business.id, attending: [currentUser._id]})
      .success(function(result) {
        console.log(result);
        // Update business attending property in UI
      });
    };
  });
