angular.module('appHome').controller('HomeController', ['$scope', '$timeout', '$modal', function ($scope, $timeout, $modal) {
    
    $scope.initialize = function() {
        // Defaults
        $scope.connecting = false;
    };

    $scope.connect = function() {
    	$scope.connecting = true;
    };

}]);