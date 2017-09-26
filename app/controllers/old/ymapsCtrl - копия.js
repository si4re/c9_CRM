'use strict';


myApp.controller('ymapsCtrl', function($scope, $http, sharePO) {
    $scope.message = "ya maps Ctrl";
    var PO = sharePO.getPO();




    ymaps.ready(function() {
        var myMap = new ymaps.Map('map', {
                center: [55.751574, 37.573856],
                zoom: 9,
                controls: ['mediumMapDefaultSet']
            }, {
                searchControlProvider: 'yandex#search'
            }

        );

        // get address and coorditanes from mongodb
        $http.get("/projects/" + PO).then(function(response) {
            var arr = [];
            arr = response.data.oneC; // array of 1c
            return arr;
        }).then(function(arr) {
            // we need: 
            // 1. address
            // 2. geo coordinates

            for (let i in arr) {




                if (arr[i].hasOwnProperty('geoAddress') && arr[i].geoAddress !== null) {

                    if (arr[i].geoAddress.lat !== null && arr[i].geoAddress.lng !== null) {

                        myMap.geoObjects.add(new ymaps.Placemark( // Placemark(geometry[, properties[, options]])
                                [arr[i].geoAddress.lat, arr[i].geoAddress.lng], {

                                    balloonContentHeader: arr[i].name,
                                    balloonContent: arr[i].address,
                                    hintContent: arr[i].address

                                }, {
                                    draggable: true
                                }) // end myPlacemark
                        ); //end myMap.add


                    } else {
                        // console.log('arr[i].geoAddress.lat and lng = null');
                    }

                } // if
                else {
                    // console.log('arr[i].geoAddress not exist or null');
                }
            } // end for
            /*
            
                                */

        }).then(function(addressArr) {
            // show in map
            //  myMap.geoObjects.add(placemark);
        });







    }); // end ready


    /////////////////////////////////////////////////////////////////////////////////////////

    //    addAddressesFromPOtoMap(sharePO.getPO());


    /*

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

*/

}); // end controller