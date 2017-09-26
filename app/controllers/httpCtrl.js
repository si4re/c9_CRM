'use strict';


myApp.controller('httpCtrl', function($scope, $http, sharePO) {



    $scope.message = "httpCtrl message";


    // project get All
    $scope.getAllProjectData = function() {
        $scope.getProjectData = [];
        $http.get("/projects").then(function(response) {
            $scope.getProjectData = response.data;
        }).then(function(response) {});
    };

    $scope.getAllProjectData();




    // note 
    $scope.getAllData = function() {
        $scope.getData = [];
        $http.get("/notes").then(function(response) {
            $scope.getData = response.data;
        }).then(function(response) {});
    };
    $scope.getAllData();




    $scope.postId = function(text) {
        var data = {
            "body": text,
            "title": "title 555"
        }
        $http.post("/notes", data).then(function(response) {
            $scope.resFromPostData = response.data;
        });
    };


    $scope.deleteAll = function() {
        $http.delete("/notes").then(function(response) {
            $scope.resFromDeleteAll = response.data;
        });
    };

    // download file from link
    $scope.downloadFile = function(filename) {
        // $scope.downloadFile = [];
        $http.get("/download/" + filename).then(function(response) {

        }).then(function(response) {});
    };

    // for delete item from Row in Table (list of 1c)
    $scope.deteteRowFromTable = function(item) {

        $http.delete("/projects/" + item).then(function(response) {

        });
    };


    // create new PO - PO.html
    $scope.postNewPO = function(numberPO) {


            function isNumeric(n) {
                return !isNaN(parseFloat(n)) && isFinite(n) && n.length >= 2 && n.length <= 20;
            }


            if (isNumeric(numberPO)) { // check if input is number 

                var data = {
                    project: numberPO
                };

                $http.post("/api/PO", data).then(function(response) {
                    console.log(response.data);
                    $scope.getAllProjectData();
                });

            } // end if
            else {
                alert('wrong input');
            }

        } // end function

    $scope.updatePO = function() {
            $scope.getAllProjectData();
        }
        // delete PO

    $scope.deletePO = function(PO) {

        var data = {
            project: PO
        };

        $http.put("/api/PO", data).then(function(response) {
            console.log(response);

        }, function(err) {
            console.log(err);
        }).then(function() {

        });
    };




});