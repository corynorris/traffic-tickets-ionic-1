function serialize(obj) {
    var str = [];
    for (var p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
};

var app = angular.module('parker.controllers', [])

app.controller('MapCtrl', function($scope, $http, localStorageService) {

    var map;
    var heatmap;
    var points = [];
    // google.maps.event.addDomListener(window, 'load', initialize);
    google.maps.event.addDomListener(window, 'load', initialize());

    // $scope.$on('$ionicView.loaded', initialize());
    $scope.$on('$ionicView.beforeEnter', function() {
        setOptions();
    });



    function initialize() {

        // Toronto
        var startingLocation = new google.maps.LatLng(
            43.7000, -79.4000
        );

        map = new google.maps.Map(document.getElementById('map'), {
            center: startingLocation,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true
        });

        heatmap = new google.maps.visualization.HeatmapLayer({
            data: points,
            map: map,
        });

        // google.maps.event.addListener(map, 'dragend', function() {
        //     getHeatmapData(map);
        // });

        google.maps.event.addListener(map, 'idle', function() {
            getHeatmapData(map);
        });

        console.log('initialization complete');
    }

    function setOptions() {
        // Heatmap color
        if (localStorageService.get('options').heatmapColor === "Cool") {
            heatmap.set('gradient', [
                'rgba(0, 255, 255, 0)',
                'rgba(54, 215, 183, 1)',
                'rgba(54, 180, 170, 1)',
                'rgba(54, 140, 160, 1)',
                'rgba(54, 100, 150, 1)',
                'rgba(51, 94, 130, 1)'
            ])
        } else {
            heatmap.set('gradient', null);
        }

    }


    // Heatmap data: 500 Points
    function getHeatmapData() {
        bounds = map.getBounds();

        var southWest = bounds.getSouthWest();
        var northEast = bounds.getNorthEast();

        var data = {
            'minLatitude': southWest.lat(),
            'maxLatitude': northEast.lat(),
            'minLongitude': southWest.lng(),
            'maxLongitude': northEast.lng()
        };


        $http.jsonp(
            'https://traffic-tickets.herokuapp.com/get-tickets-mobile?' +
            'callback=JSON_CALLBACK&' +
            serialize(data)
        ).then(function(response) {

                var data = response.data;
                points = [];

                for (var i = 0; i < data.length; i++) {
                    points[i] = new google.maps.LatLng(data[i].latitude, data[i].longitude);

                }


                heatmap.setData(points);

            },
            function(xhr, status, error) {
                console.log('error');
            });
    }
});

app.controller('AppCtrl', function($scope, $ionicPlatform) {
    $scope.rateUs = function() {
        if ($ionicPlatform.is('ios')) {
            window.open('itms-apps://itunes.apple.com/us/app/domainsicle-domain-name-search/id511364723?ls=1&mt=8', '_system'); // or itms://
        } else if ($ionicPlatform.is('android')) {
            window.open('market://details?id=<package_name>', '_system');
        }
    }

    $scope.tweetUs = function() {
        window.open('https://twitter.com/intent/tweet?text=Find%20safe%20places%20to%20park%20by%20heat%20mapping%20traffic%20tickets!%20%23parker-app', '_system');
    }
});

app.controller('AddTicketCtrl', function($scope, $http) {
    $scope.formData = {
        fee: 50,
        date: new Date(),
        location: "",
        latitude: 43.7000,
        longitude: -79.4000
    };


    $scope.addTicket = function() {

        // convert location to latitude and longitude

        $http.get(
            'https://traffic-tickets.herokuapp.com/new-ticket',
            $scope.formData
        ).success(function(data) {
            if (data.success) {
                // if successful, bind success message to message
                $scope.message = data.message;
            }
        });
    };

});

app.controller('OptionsCtrl', function($scope, localStorageService) {

    $scope.colors = ['Warm', 'Cool'];

    $scope.options = localStorageService.get('options') || {
        heatmapColor: 'Cool',
        displayAds: true
    };

    $scope.$watch("options", function() {
        localStorageService.set('options', $scope.options);
    }, true);
});
