'use strict';


myApp.controller('testCtrl', function($scope, $http, sharePO) {
    $scope.message = "testCtrl";
    $scope.PO = sharePO.getPO();


    ymaps.ready(function() {

        var map = new ymaps.Map('map', {
                center: [55.650625, 37.62708],
                zoom: 10
            }, {
                searchControlProvider: 'yandex#search'
            }),
            counter = 0,

            // Создание макета содержимого балуна.
            // Макет создается с помощью фабрики макетов с помощью текстового шаблона.
            BalloonContentLayout = ymaps.templateLayoutFactory.createClass(

                '<button id="save-button"> save </button>', {

                    // Переопределяем функцию build, чтобы при создании макета начинать
                    // слушать событие click на кнопке-счетчике.
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
                        alert('save ok');
                    }
                });

        var placemark = new ymaps.Placemark(
            [55.650625, 37.62708], { // coordinates
                hintContent: 'test' // options
            }, {
                balloonContentLayout: BalloonContentLayout, // propertues
                // Запретим замену обычного балуна на балун-панель.
                // Если не указывать эту опцию, на картах маленького размера откроется балун-панель.
                //  balloonPanelMaxMapArea: 0
            });

        map.geoObjects.add(placemark);



    }); // end ready



}); // end controller