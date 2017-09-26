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
        });

        /*
                var BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
                    '<div>' +
                    '<i id="address">test</i> ' +
                    '<button class="btn btn-outline-danger btn-sm" id="save-button"> save </button>' +
                    '<button class="btn btn-outline-danger btn-sm" id="save-button"> no </button>' +
                    '</div>', {
                        build: function() {
                            // Сначала вызываем метод build родительского класса.
                            BalloonContentLayout.superclass.build.call(this);
                            // А затем выполняем дополнительные действия.
                            $('#save-button').bind('click', this.onCounterClick);
                        },
                        // Аналогично переопределяем функцию clear, чтобы снять
                        // прослушивание клика при удалении макета с карты.
                        clear: function() {
                            // Выполняем действия в обратном порядке - сначала снимаем слушателя,
                            // а потом вызываем метод clear родительского класса.
                            $('#save-button').unbind('click', this.onCounterClick);
                            BalloonContentLayout.superclass.clear.call(this);
                        },
                        onCounterClick: function() {
                            // alert('save ok');


                        }
                    }); // end ymaps.templateLayoutFactory.createClass

        */


        function templateLayoutFactorycreateClass(PO, number1C, lat, lng, address, element) {

            // alert(address);
            console.log(element);
            var BalloonContentLayout;
            return BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
                '<div id="mydiv">' + '</div>' +
                '<button class="btn btn-outline-success btn-sm" id="save-button"> save </button>', {
                    build: function() {
                        // Сначала вызываем метод build родительского класса.
                        BalloonContentLayout.superclass.build.call(this);
                        // А затем выполняем дополнительные действия.
                        $('#save-button').bind('click', this.onCounterClick);
                        $('#mydiv').html(address);
                    },
                    // Аналогично переопределяем функцию clear, чтобы снять
                    // прослушивание клика при удалении макета с карты.
                    clear: function() {
                        // Выполняем действия в обратном порядке - сначала снимаем слушателя,
                        // а потом вызываем метод clear родительского класса.
                        $('#save-button').unbind('click', this.onCounterClick);
                        BalloonContentLayout.superclass.clear.call(this);
                    },
                    onCounterClick: function() {
                        // alert('save ok');
                        $('#mydiv').html('сохраняем...');
                        // $('#mydiv').append('test append');

                        var sendObj = {
                            "updateGeo": true, // for reason: i have many http.put for excel fo example
                            "number": number1C,
                            // "code": "VIMPELCOM BS-12120 ANGARSKAYA 20",
                            // "address": "Ангарская ул, д 20а",
                            "geoAddress": {
                                "lat": lat,
                                "lng": lng
                            }
                        };

                        // Update CR'U'D
                        $http.put("/projects/" + PO, sendObj).then(function(response) {
                            // var test = response.data;
                        }, function(err) {
                            alert(err);
                        }).then(function(response) {
                            element.get('target').options.set('preset', "islands#darkGreenIcon"); // set green color
                            element.get('target').balloon.close();
                            element.get('target').options.unset('balloonContentLayout'); // remove button save
                        }, function(err) {

                        });

                    }
                }); // end ymaps.templateLayoutFactory.createClass

        }; // end  function templateLayoutFactorycreateClass




        // get address and coorditanes from mongodb
        $http.get("/projects/" + PO).then(function(response) {
            var arr = [];
            arr = response.data.oneC; // array of 1c
            return arr;
        }).then(function(arr) {
            // we need: 
            // 1. address
            // 2. geo coordinates

            var placemarkColor;
            var randomLat;
            var randomLng;

            for (let i in arr) {

                if (arr[i].hasOwnProperty('geoAddress') && arr[i].geoAddress !== null) {

                    if (arr[i].geoAddress.lat !== null && arr[i].geoAddress.lng !== null) { //array of addresses

                        if (arr[i].geoAddress.lat == 0 && arr[i].geoAddress.lng == 0) {
                            placemarkColor = "islands#redIcon";
                            // if google api said coordinates were not found - group theese placemark near moscow 
                            randomLat = 55.752023 + Math.random(); // Kremlin + random  0 - 0,9 
                            randomLng = 37.617499 + Math.random(); // Kremlin + random  0 - 0,9

                        } //end if
                        else {
                            placemarkColor = "islands#darkGreenIcon";
                            randomLat = 0;
                            randomLng = 0;
                        }

                        var arrPlacemark = [];

                        arrPlacemark[i] = new ymaps.Placemark( // Placemark(geometry[, properties[, options]])
                            [arr[i].geoAddress.lat + randomLat, arr[i].geoAddress.lng + randomLng], { // lat, lng

                                balloonContent: arr[i].code,
                                hintContent: arr[i].address

                            }, {
                                //  balloonContentLayout: BalloonContentLayout,
                                draggable: true,
                                preset: placemarkColor
                            }); // end myPlacemark




                        arrPlacemark[i].events.add('drag', function(e) {
                            e.get('target').options.set('preset', "islands#redIcon");
                        });

                        arrPlacemark[i].events.add('dragend', function(e) {
                            var element = e;

                            e.get('target').balloon.open();

                            ymaps.geocode(e.get('target').geometry.getCoordinates(), {
                                results: 1
                            }).then(function(res) {
                                var newContent = res.geoObjects.get(0) ?
                                    res.geoObjects.get(0).properties.get('name') :
                                    'Не удалось определить адрес.';

                                // do simething  if address identofied successfully

                                var arrCoordinates = e.get('target').geometry.getCoordinates();
                                var lat = arrCoordinates[0];
                                var lng = arrCoordinates[1];

                                //PO, number1C, lat, lng
                                e.get('target').options.set('balloonContentLayout', templateLayoutFactorycreateClass(PO, arr[i].number, lat, lng, newContent, element)); //unset - delete
                                e.get('target').properties.set('hintContent', newContent);

                            });


                        }); // end drag






                        myMap.geoObjects.add(arrPlacemark[i]); //end myMap.add

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