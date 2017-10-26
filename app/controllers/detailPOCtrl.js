myApp.controller('detailPOCtrl', function ($scope, $http, $timeout, sharePO) {






    $scope.getPODetailsOrderSumm = function (numberPO) {

        console.log('_____________________ getPODetailsOrderSumm ____________________');


        function isNumeric(n) {
            return !isNaN(parseFloat(n)) && isFinite(n) && n.length >= 2 && n.length <= 20;
        }


        if (isNumeric(numberPO)) { // check if input is number 

            $http.get("/api/" + numberPO + "/detailsOrderSumm/").then(function (response) {


                if (response.data.error) { // all error check

                    console.log('error:  ', response.data.error);
                }

                $scope.orderNokiaVk.status = response.data[0].orderVkNokia;
                $scope.orderADVNokia.status = response.data[0].orderADVNokia;
                $scope.totalSummADV.status = response.data[0].totalSummADV;
                $scope.totalSummSub.status = response.data[0].totalSummSub;


            }, function (reject) {
                console.log(reject);
            });

        } // end if
        else {

            console.log('getOrderVkNokia: PO not number')
        }

    } // end function

    $scope.getPODetailsOrderSumm(sharePO.getPO());







    // for change:     Номер заказа ВК - Nokia      http://127.0.0.1:8080/#!/555

    $scope.orderNokiaVk = {
        value: '',
        inputColor: '',
        status: '',
        button: {
            style: 'btn-outline-primary',
            name: 'Изменить'
        }

    };


    $scope.$watch('orderNokiaVk.value', function (newValue, oldValue, scope) {
        if (newValue) {
            $scope.orderNokiaVk.button.style = 'btn-outline-primary';
            $scope.orderNokiaVk.inputColor = null;
            $scope.orderNokiaVk.button.name = 'Изменить';
        }
    });





    $scope.setOrderVkNokia = function (numberPO, orderNokiaVkFromAngular) {


        function isNumeric(n) {
            return !isNaN(parseFloat(n)) && isFinite(n) && n.length >= 2 && n.length <= 20;
        }


        if (isNumeric(numberPO)) { // check if input is number 

            var data = {
                project: numberPO,
                orderNokiaVk: orderNokiaVkFromAngular
            };

            $http.post("/api/PO/orderVkNokia", data).then(function (response) { // api_project_route.js: apiRoutes.put('/PO', requireAuth, AuthenticationController.roleAuthorization(['admin']), function(req, res) {

                if (response.data.error) { // all error check

                    $scope.errmsg = response.data.error.errmsg; // show message

                    $timeout(function () { // hide error in 3,5 sec
                        $scope.errmsg = false;
                    }, 3500);
                }
                $scope.orderNokiaVk.status = orderNokiaVkFromAngular;
                $scope.orderNokiaVk.button.style = 'btn-outline-success';
                $scope.orderNokiaVk.inputColor = 'has-success';
                $scope.orderNokiaVk.button.name = 'Готово';

            }, function (reject) {
                console.log(reject);
            });

        } // end if
        else {

            $scope.errmsg = 'введите корректный номер заказа ВК - Nokia'; // show message

            $timeout(function () { // hide error in 3,5 sec
                $scope.errmsg = false;
            }, 3500);

        }

    } // end function































    // for change:     Заказ АДВ - Nokia     http://127.0.0.1:8080/#!/555

    $scope.orderADVNokia = {
        value: '',
        inputColor: '',
        status: '',
        button: {
            style: 'btn-outline-primary',
            name: 'Изменить'
        }

    };


    $scope.$watch('orderADVNokia.value', function (newValue, oldValue, scope) {
        if (newValue) {
            $scope.orderADVNokia.button.style = 'btn-outline-primary';
            $scope.orderADVNokia.inputColor = null;
            $scope.orderADVNokia.button.name = 'Изменить';
        }
    });



    $scope.setOrderADVNokia = function (numberPO, orderADVNokiaFromAngular) {


        function isNumeric(n) {
            return !isNaN(parseFloat(n)) && isFinite(n) && n.length >= 2 && n.length <= 20;
        }


        if (isNumeric(numberPO)) { // check if input is number 

            var data = {
                project: numberPO,
                orderADVNokia: orderADVNokiaFromAngular
            };

            $http.post("/api/PO/orderADVNokia", data).then(function (response) {


                if (response.data.error) { // all error check

                    $scope.errmsg = response.data.error.errmsg; // show message

                    $timeout(function () { // hide error in 3,5 sec
                        $scope.errmsg = false;
                    }, 3500);
                }

                $scope.orderADVNokia.status = orderADVNokiaFromAngular;
                $scope.orderADVNokia.button.style = 'btn-outline-success';
                $scope.orderADVNokia.inputColor = 'has-success';
                $scope.orderADVNokia.button.name = 'Готово';

            }, function (reject) {
                console.log(reject);
            });

        } // end if
        else {

            $scope.errmsg = 'введите корректный номер заказа ВК - Nokia'; // show message

            $timeout(function () { // hide error in 3,5 sec
                $scope.errmsg = false;
            }, 3500);

        }

    } // end function






















    // for change:     Сумма АДВ с НДС     http://127.0.0.1:8080/#!/555

    $scope.totalSummADV = {
        value: '',
        inputColor: '',
        status: '',
        button: {
            style: 'btn-outline-primary',
            name: 'Изменить'
        }

    };


    $scope.$watch('totalSummADV.value', function (newValue, oldValue, scope) {
        if (newValue) {
            $scope.totalSummADV.button.style = 'btn-outline-primary';
            $scope.totalSummADV.inputColor = null;
            $scope.totalSummADV.button.name = 'Изменить';
        }
    });



    $scope.setTotalSummADV = function (numberPO, totalSummADVFromAngular) {


        function isNumeric(n) {
            return !isNaN(parseFloat(n)) && isFinite(n) && n.length >= 2 && n.length <= 20;
        }


        if (isNumeric(numberPO)) { // check if input is number 

            var data = {
                project: numberPO,
                totalSummADV: totalSummADVFromAngular
            };

            $http.post("/api/PO/totalSummADV", data).then(function (response) {


                if (response.data.error) { // all error check

                    $scope.errmsg = response.data.error.errmsg; // show message

                    $timeout(function () { // hide error in 3,5 sec
                        $scope.errmsg = false;
                    }, 3500);
                }

                $scope.totalSummADV.status = totalSummADVFromAngular;
                $scope.totalSummADV.button.style = 'btn-outline-success';
                $scope.totalSummADV.inputColor = 'has-success';
                $scope.totalSummADV.button.name = 'Готово';

            }, function (reject) {
                console.log(reject);
            });

        } // end if
        else {

            $scope.errmsg = 'введите корректный номер заказа ВК - Nokia'; // show message

            $timeout(function () { // hide error in 3,5 sec
                $scope.errmsg = false;
            }, 3500);

        }

    } // end function
















    // for change:     Сумма суб.  подряд с НДС     http://127.0.0.1:8080/#!/555

    $scope.totalSummSub = {
        value: '',
        inputColor: '',
        status: '',
        button: {
            style: 'btn-outline-primary',
            name: 'Изменить'
        }

    };


    $scope.$watch('totalSummSub.value', function (newValue, oldValue, scope) {
        if (newValue) {
            $scope.totalSummSub.button.style = 'btn-outline-primary';
            $scope.totalSummSub.inputColor = null;
            $scope.totalSummSub.button.name = 'Изменить';
        }
    });



    $scope.setTotalSummSub = function (numberPO, totalSummSubFromAngular) {


        function isNumeric(n) {
            return !isNaN(parseFloat(n)) && isFinite(n) && n.length >= 2 && n.length <= 20;
        }


        if (isNumeric(numberPO)) { // check if input is number 

            var data = {
                project: numberPO,
                totalSummSub: totalSummSubFromAngular
            };

            $http.post("/api/PO/totalSummSub", data).then(function (response) {


                if (response.data.error) { // all error check

                    $scope.errmsg = response.data.error.errmsg; // show message

                    $timeout(function () { // hide error in 3,5 sec
                        $scope.errmsg = false;
                    }, 3500);
                }

                $scope.totalSummSub.status = totalSummSubFromAngular;
                $scope.totalSummSub.button.style = 'btn-outline-success';
                $scope.totalSummSub.inputColor = 'has-success';
                $scope.totalSummSub.button.name = 'Готово';

            }, function (reject) {
                console.log(reject);
            });

        } // end if
        else {

            $scope.errmsg = 'введите корректный номер заказа ВК - Nokia'; // show message

            $timeout(function () { // hide error in 3,5 sec
                $scope.errmsg = false;
            }, 3500);

        }

    } // end function




















}); // end Ctrl