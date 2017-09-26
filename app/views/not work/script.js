var myApp = angular
    .module('myApp', ['yaMap'])
    .controller("myController", function($scope) {
        var _map;

        $scope.message = "message from controller";

        $scope.afterMapInit = function(map) {
            _map = map;
        };
        $scope.del = function() {
            _map.destroy();
        };

    });