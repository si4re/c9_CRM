'use strict';


myApp.controller('testCtrl', function($scope, $http, sharePO) {
    $scope.message = "testCtrl";
    $scope.PO = sharePO.getPO();


    ymaps.ready(function() {
        var myMap = new ymaps.Map('map', {
                center: [55.751574, 37.573856],
                zoom: 9,
                controls: ['mediumMapDefaultSet']
            }, {
                searchControlProvider: 'yandex#search'
            }

        );



        // Создание макета содержимого балуна.
        // Макет создается с помощью фабрики макетов с помощью текстового шаблона.
        var BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
            '<div style="margin: 10px;">' +
            '<b>{{properties.name}}</b><br />' +
            '<i id="count"></i> ' +
            '<button id="counter-button"> +1 </button>' +
            '</div>', {

                // Переопределяем функцию build, чтобы при создании макета начинать
                // слушать событие click на кнопке-счетчике.
                build: function() {
                    // Сначала вызываем метод build родительского класса.
                    BalloonContentLayout.superclass.build.call(this);
                    // А затем выполняем дополнительные действия.
                    $('#counter-button').bind('click', this.onCounterClick);
                    $('#count').html(counter);
                },

                // Аналогично переопределяем функцию clear, чтобы снять
                // прослушивание клика при удалении макета с карты.
                clear: function() {
                    // Выполняем действия в обратном порядке - сначала снимаем слушателя,
                    // а потом вызываем метод clear родительского класса.
                    $('#counter-button').unbind('click', this.onCounterClick);
                    BalloonContentLayout.superclass.clear.call(this);
                },

                onCounterClick: function() {
                    $('#count').html(++counter);
                    if (counter == 5) {
                        alert('Вы славно потрудились.');
                        counter = 0;
                        $('#count').html(counter);
                    }
                }
            });



        // Placemark(geometry[, properties[, options]])
        var placemark = new ymaps.Placemark(

            // geometry
            [56.1, 37.8],

            // properties
            {
                balloonContentLayout: BalloonContentLayout,
                balloonContentHeader: "Header",
                balloonContent: "Content",
                hintContent: "hint"
            },

            //options
            {
                draggable: true
            }); // end myPlacemark

        console.log(placemark.balloon);
        /* var buttonContent = '<button id="btn1" class="btn btn-danger btn-sm"  > Сохранить </button > ';

        $scope.testAlert = function() {
            alert('test');
        };
        $('btn1').click(function() {
            console.log('test');
        });

        */

        placemark.events.add('balloonopen', function(e) {

            // placemark.properties.set('balloonContent', "Идет загрузка данных...");
            // Имитация задержки при загрузке данных (для демонстрации примера).

            ymaps.geocode(placemark.geometry.getCoordinates(), {
                results: 1
            }).then(function(res) {
                var newContent = res.geoObjects.get(0) ?
                    res.geoObjects.get(0).properties.get('name') :
                    'Не удалось определить адрес.';

                // Задаем новое содержимое балуна в соответствующее свойство метки.
                placemark.properties.set('balloonContent', buttonContent);

                var PO = "555";
                $http.get("/notes").then(function(response) {
                    $scope.getData = response.data;
                }).then(function(response) {});

            });



        }); // end add



        placemark.events.add('dragend', function(e) {

            placemark.balloon.open();
            ymaps.geocode(placemark.geometry.getCoordinates(), {
                results: 1
            }).then(function(res) {
                var newContent = res.geoObjects.get(0) ?
                    res.geoObjects.get(0).properties.get('name') :
                    'Не удалось определить адрес.';

                // Задаем новое содержимое балуна в соответствующее свойство метки.
                placemark.properties.set('balloonContent', newContent);

                var PO = "555";
                $http.get("/notes").then(function(response) {
                    $scope.getData = response.data;
                }).then(function(response) {});

            });

        }); // end drag



        myMap.geoObjects.add(placemark);

        placemark.events
            .add('mouseenter', function(e) {
                // Ссылку на объект, вызвавший событие,
                // можно получить из поля 'target'.
                e.get('target').options.set('preset', 'islands#greenIcon');
            })
            .add('mouseleave', function(e) {
                e.get('target').options.unset('preset');
            });

    }); // end ready



}); // end controller