'use strict';


myApp.controller('httpCtrl', function ($scope, $http, $timeout, sharePO) {



    $scope.message = "httpCtrl message";
    $scope.numberPO = sharePO.getPO();


    // OK  for delete item from Row in Table (list of 1c)   
    $scope.deteteRowFromTable = function (item) {

        $http.delete("/projects/" + item).then(function (response) {

        });
    };

























});