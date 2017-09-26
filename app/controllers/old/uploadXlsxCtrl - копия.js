// USE angular-js-xlsx
//template: '<input type="file" style="display: none" />', // style="display: none"  - added by miroshnikov

'use strict';
myApp.controller('uploadXlsxCtrl', function($scope, $http, $timeout, sharePO) {
    $scope.message = "message from uploadXlsxCtrl";

    $scope.PO = sharePO.getPO();



    $scope.successHttpPutAlertMessage = false;
    $scope.showSuccessHttpPutAlertMessage = function(value) {
        $scope.successHttpPutAlertMessage = true;
        $timeout(function() {
            $scope.successHttpPutAlertMessage = false;
        }, 5000);
    };

    $scope.errorImportFromExcelAlertMessage = false;
    $scope.showErrorImportFromExcelAlertMessage = function(value) {
        $scope.errorImportFromExcelAlertMessage = true;
        $timeout(function() {
            $scope.errorImportFromExcelAlertMessage = false;
        }, 5000);
    };


    // for angular-js-xlsx
    $scope.read = function(workbook) {
        /* DO SOMETHING WITH workbook HERE */



        parseXLSX(workbook, function(arr) { // for testing
            //  console.log(JSON.stringify(arr));

            if (arr == 'err') {
                alert('error! -  проверьте формат данных в  xlxs');
                $scope.showErrorImportFromExcelAlertMessage();


            } else {

                arrayToObj(arr, function(obj) { // arr to obj

                    for (let i in obj) {
                        // console.log(obj[i]);
                        getGeoData(obj[i].address, function(arr) { // arr = [lat, lng]
                            addPropertytoObj(obj[i], arr, function(newObj) { // add geo coordinates to each 1c object

                                // Update CR'U'D
                                $http.put("/projects/" + sharePO.getPO(), newObj).then(function(response) {
                                    $scope.resFromPostData = response.data;
                                    $scope.showSuccessHttpPutAlertMessage();
                                    $scope.getIdProjectData(sharePO.getPO()); //update table
                                }, function(err) {
                                    $scope.xlsxHttpPutError = true;
                                    alert(err);
                                });

                            });
                        });
                    } // end for


                });
            } // end else
        }); // end parse


    }; // end $scope.read

    $scope.error = function(e) {
        /* DO SOMETHING WHEN ERROR IS THROWN */
        console.log(e);
        $scope.showErrorImportFromExcelAlertMessage();
    };
    // end for angular-js-xlsx









    function parseXLSX(file, callback) {

        var workbook = file;
        var sheet_name_list = workbook.SheetNames;
        var arr = [];
        var headers = {};

        sheet_name_list.forEach(function(y) {
            var worksheet = workbook.Sheets[y];

            var data = [];
            for (var z in worksheet) {

                if (z[0] === '!') continue;
                //parse out the column, row, and value

                var col = z.substring(0, 1);

                var row = parseInt(z.substring(1));

                var value = worksheet[z].v;

                //store header names
                if (row == 1) {
                    headers[col] = value;
                    continue;
                }

                //alert(JSON.stringify(headers));
                //{"A":"number","B":"code","C":"address"}


                if (!data[row]) data[row] = {};

                data[row][headers[col]] = value;

            } // end for
            //drop those first two rows which are empty
            data.shift();
            data.shift();


            for (var i in data) {
                //arr[i] = { oneC: data[i] };
                arr[i] = data[i];
            };

        }); // end ForEach

        // check correct file data
        if ((headers.A == 'number') && (headers.B == 'code') && (headers.C == 'address')) {

            callback(arr);
        } else {
            callback('err');
        }
    } // end function



    function getGeoData(address, callback) { // https://stackoverflow.com/questions/6847697/how-to-return-value-from-an-asynchronous-callback-function

        var URL = "https://maps.google.com/maps/api/geocode/json?address=";
        var key = "&key=AIzaSyA60pl7nin99-KeyAFHagTr3_ytn-fCndM";
        var encodeURL = encodeURI('Россия' + address);

        var globalArr = [];

        return $http.get(URL + encodeURL + key).then(function(response) {

            var lat, lng;
            var arr = []; // array 

            if (response.data.status == 'ZERO_RESULTS') { // address not found
                lat = 55.752023 + Math.random(); // set coordinates to Moscow Center - Kremlin
                lng = 37.617499 + Math.random();
                arr.push(lat, lng);
                return arr; // return arr with coorditanes
            } // end if ZERO_RESULTS

            if (response.data.status == 'OK') {
                lat = response.data.results[0].geometry.location.lat;
                lng = response.data.results[0].geometry.location.lng;

                arr.push(lat, lng);
                return arr; // return arr with coorditanes
            } // end if OK

        }).then(function(arr) {
            // do something with arr
            callback(arr); // [lat,lng]
        });
    } // end getGeoData


    function arrayToObj(arr, callback) { // array to object
        var obj = {};
        for (var key in arr) {
            obj[key] = arr[key];
        }
        callback(obj);
    };

    function addPropertytoObj(obj, arrCoordinates, callback) {
        obj.geoAddress = {
            "lat": arrCoordinates[0],
            "lng": arrCoordinates[1]
        };
        callback(obj);
    };

}); // end controller