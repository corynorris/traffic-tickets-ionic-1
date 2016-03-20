// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('parker', ['ionic'])

app.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})

app.controller('MapCtrl', function($scope, $http, $ionicLoading, $compile) {
    
    var map;
    var heatmap;
    var points = [];

    function initialize() {

        // Toronto
        var startingLocation = new google.maps.LatLng(
            43.7000, -79.4000
        );


        var mapOptions = {
            center: startingLocation,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
    disableDefaultUI: true
        };


        var map = new google.maps.Map(document.getElementById('map'),
            mapOptions);

        var heatmap = new google.maps.visualization.HeatmapLayer({
            data: points,
            map: map,
        });



        google.maps.event.addListener(map, 'idle', function() {
            $scope.getPoints(map);
        });

        $scope.map = map;

    }

    google.maps.event.addDomListener(window, 'load', initialize);



    // Heatmap data: 500 Points
    $scope.getPoints = function() {
        bounds = $scope.map.getBounds();

        var southWest = bounds.getSouthWest();
        var northEast = bounds.getNorthEast();

        var data = {
            'min-latitude': southWest.lat(),
            'max-latitude': northEast.lat(),
            'min-longitude': southWest.lng(),
            'max-longitude': northEast.lng()
        };

        $http.post(
             'https://traffic-tickets.herokuapp.com/get-tickets',
             data
          ).then(function(response) {

                points = [];

                for (var i = 0; i < response.length; i++) {
                    var newPoint = new google.maps.LatLng(response[i].latitude, response[i].longitude);
                    points.push(newPoint);
                }

                heatmap.setData(points);

            },
            function(xhr, status, error) {
              console.log('error');
          });
    }

    // $scope.centerOnMe = function() {
    //   if(!$scope.map) {
    //     return;
    //   }

    //   $scope.loading = $ionicLoading.show({
    //     content: 'Getting current location...',
    //     showBackdrop: false
    //   });

    //   navigator.geolocation.getCurrentPosition(function(pos) {
    //     $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
    //     $scope.loading.hide();
    //   }, function(error) {
    //     alert('Unable to get location: ' + error.message);
    //   });
    // };

});