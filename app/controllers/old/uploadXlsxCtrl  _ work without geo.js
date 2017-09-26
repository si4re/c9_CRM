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
        //alert(parseXLSX(workbook));

        parseXLSX(workbook, function(arr) {


            if (arr == 'err') {
                alert('error! -  проверьте формат данных в  xlxs');
                $scope.showErrorImportFromExcelAlertMessage();


            } else {

                for (var i in arr) {
                    // Update CR'U'D
                    $http.put("/projects/" + sharePO.getPO(), arr[i]).then(function(response) {
                        $scope.resFromPostData = response.data;

                        // alert for 3 seconds
                        $scope.showSuccessHttpPutAlertMessage();
                        $scope.getIdProjectData(sharePO.getPO()); //update table
                    }, function(err) {
                        $scope.xlsxHttpPutError = true;
                        alert(err);
                    });

                }; // end i
            } // end else

        }); // end parse
    };

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

}); // end controller