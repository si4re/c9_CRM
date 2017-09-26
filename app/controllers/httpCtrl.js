'use strict';


myApp.controller('httpCtrl', function($scope, $http, $timeout, sharePO) {



    $scope.message = "httpCtrl message";





    // OK   get PO from server and create table in PO.html
    $scope.getAllProjectData = function() {
        $scope.getProjectData = [];
        $http.get('/api/PO').then(function(response) { // old  $http.get("/projects").then(function(response) {
            $scope.getProjectData = response.data;

            console.log(response.data);

        }).then(function(response) {});
    };

    $scope.getAllProjectData();








    // OK  create new PO - PO.html
    $scope.postNewPO = function(numberPO) {


            function isNumeric(n) {
                return !isNaN(parseFloat(n)) && isFinite(n) && n.length >= 2 && n.length <= 20;
            }


            if (isNumeric(numberPO)) { // check if input is number 

                var data = {
                    project: numberPO
                };

                $http.post("/api/PO", data).then(function(response) { // api_project_route.js: apiRoutes.put('/PO', requireAuth, AuthenticationController.roleAuthorization(['admin']), function(req, res) {

                    if (response.data.error) { // all error check

                        $scope.errmsg = response.data.error.errmsg; // show message

                        $timeout(function() { // hide error in 3,5 sec
                            $scope.errmsg = false;
                        }, 3500);
                    }

                    console.log(response.data);
                    $scope.getAllProjectData();

                }, function(reject) {
                    console.log(reject);
                });

            } // end if
            else {

                $scope.errmsg = 'введите корректный номер проекта'; // show message

                $timeout(function() { // hide error in 3,5 sec
                    $scope.errmsg = false;
                }, 3500);

            }

        } // end function





    $scope.hideDeleteButton = true;
    $scope.confirmDeletePO = false;

    $scope.setConfirmDeletePO = function() {
        $scope.confirmDeletePO = true;
        $scope.hideDeleteButton = true;
    }



    // OK  delete item from array
    $scope.deleteItem = function(array, item) {

        var index = array.indexOf(item);

        if (index > -1) {
            $scope.ind = index;
            array.splice(index, 1);
            $scope.newArray = array;

        } else { alert("error from slice"); }


    }; // end deleteItem




    // OK delete PO
    $scope.deletePO = function(PO) {



        $http.delete("/api/" + PO).then(function(response) {
            console.log(response);

        }, function(err) {
            console.log(err);
        }).then(function() {

        });


    };



    // OK  for delete item from Row in Table (list of 1c)   
    $scope.deteteRowFromTable = function(item) {

        $http.delete("/projects/" + item).then(function(response) {

        });
    };










    //need check

    // download file from link
    $scope.downloadFile = function(filename) {
        // $scope.downloadFile = [];
        $http.get("/download/" + filename).then(function(response) {

        }).then(function(response) {});
    };


});