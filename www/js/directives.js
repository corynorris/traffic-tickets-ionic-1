
var app = angular.module('parker.directives', [])

app.directive('locationPicker', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {

            var lat = scope.$eval(attrs.lat);
            var lng = scope.$eval(attrs.lng);

            // Create the autocomplete object, restricting the search to geographical
            // location types.
            autocomplete = new google.maps.places.Autocomplete(
                element[0], { types: ['geocode'] });

            // Bias autocomplete
            var circle = new google.maps.Circle({
                center: { lat, lng },
                radius: 1
            });

            autocomplete.setBounds(circle.getBounds());
   			
   			autocomplete.addListener('place_changed', function() {
   				scope.$parent.latitude = autocomplete.getPlace().geometry.location.lat;
   				scope.$parent.longitude = autocomplete.getPlace().geometry.location.lng;
   				scope.$apply();
   			});

        }
    };
});
