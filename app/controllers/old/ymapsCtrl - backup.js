'use strict';


myApp.controller('ymapsCtrl', function($scope, $http, sharePO) {
    $scope.message = "ya maps Ctrl";
    $scope.PO = sharePO.getPO();




    $scope.map = {
        center: [53.57, 37.13],
        zoom: 12
    };


    var test = [
        { "coordinates": [35.7104208, -81.2860607], "properties": { "balloonContent": null } },
        { "coordinates": [55.74511709999999, 36.7862771], "properties": { "balloonContent": "Одинцовский р-н, Сосновка д. " } },
        { "coordinates": [55.628937, 36.97967999999999], "properties": { "balloonContent": "Одинцовский р-н, Голицыно г, Можайское ш, д 75 " } }
    ];

    $scope.markers = [];


    addAddressesFromPOtoMap(sharePO.getPO());


    // get list of data (with addresses) from PO
    function addAddressesFromPOtoMap(PO) {
        $scope.IdProjectData = [];
        $http.get("/projects/" + PO).then(function(response) {
            var arr = [];
            arr = response.data.oneC;
            return arr;
        }).then(function(arr) {

            var addressArr = [];


            for (var i in arr) {
                addressArr.push(arr[i].address);
            }
            return addressArr;
        }).then(function(addressArr) {

            for (var i in addressArr) {
                getGeoData(addressArr[i]);
            }
        });
    };


    function getGeoData(address) {

        var URL = "https://maps.google.com/maps/api/geocode/json?address=";
        var key = "&key=AIzaSyA60pl7nin99-KeyAFHagTr3_ytn-fCndM";
        var encodeURL = encodeURI('Россия' + address);


        $http.get(URL + encodeURL + key).then(function(response) {

            var lat, lng;
            var obj = {};

            if (response.data.status == 'ZERO_RESULTS') { // address not found
                lat = 55.752023 + Math.random(); // set coordinates to Moscow Center - Kremlin
                lng = 37.617499 + Math.random();
                obj.coordinates = [lat, lng];
                // obj.properties = { balloonContent: "координаты адреса не найдены: " + address };
                obj.properties = {
                    balloonContent: "координаты адреса не найдены: " + address,
                    hintContent: "координаты адреса не найдены: " + address,
                    draggable: "true",
                    iconShadow: "true"
                };
                obj.options = { preset: 'islands#icon', iconColor: '#a5260a' };

                return obj;
            } // end if ZERO_RESULTS

            if (response.data.status == 'OK') {
                lat = response.data.results[0].geometry.location.lat;
                lng = response.data.results[0].geometry.location.lng;
                obj.coordinates = [lat, lng];
                obj.properties = {
                    balloonContent: address,
                    hintContent: address,
                    draggable: true
                };

                return obj;
            } // end if OK

        }).then(function(obj) {
            $scope.markers.push(obj);
        }).then(function() {

        });

    } // end getGeoData



}); // end controller