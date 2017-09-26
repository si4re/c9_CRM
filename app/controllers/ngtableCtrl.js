'use strict';


myApp.controller('ngtableCtrl', function($scope, NgTableParams, $q, $http, $filter) {

    $scope.message = "message from ngtableCtrl";


    // $watch example
    $scope.wathedValue = "";

    $scope.$watch('wathedValue', function(newValue, oldValue) {
        if (newValue) {
            $scope.selectData = newValue;
        }
    });

    // for hm-read-more
    $scope.limit = 200;
    $scope.lessText = "Read less";
    $scope.moreText = "Read more";
    $scope.dotsClass = "toggle-dots-black";
    $scope.linkClass = "toggle-link-grey";




    //var data = [{ workType: "Проведение предпроектного обследования (ППО) позиций", type: 50 }, { workType: "Проектные работы", type: 50 }, { workType: "Dan555", type: 100 }, { workType: "Dan", type: 100 }];


    $scope.data5 = [{ "id": "Dan", "title": "Dan" }, { "id": "Проведение предпроектного обследования (ППО) позиций", "title": "Проведение предпроектного обследования (ППО) позиций" }, { "id": " Проектные работы", "title": " Проектные работы" }];

    function getDataWatch() {

        var def = $q.defer(),
            arr = [],
            names = [];
        $scope.data = "";

        $scope.$watch('data', function() {


            angular.forEach($scope.data, function(item) {
                if (inArray(item.workType, arr) === -1) {
                    arr.push(item.workType);
                    names.push({
                        'id': item.workType,
                        'title': item.workType
                    });

                    def.resolve(names);
                }
            });



        });


        return def.promise;
    }


    $scope.names2 = function() {

        getDataWatch().then(function(resolve) {
            $scope.wathedValue = resolve;
        }, function(reject) {

        })
    };

    $scope.names2();






    function getDataForSelect() {
        var deferred = $q.defer();

        $http.get("/data.json").then(function(responce) {
            // succsess get gata from http get
            deferred.resolve(responce.data.array);
        }, function(err) {
            // error get gata from http get
            deferred.reject(err);
        });

        return deferred.promise;
    } // end getData    


    // not work
    getDataForSelect().then(function(resolve) {
        return (JSON.stringify(resolve));

    }, function(reject) {
        return ("reject");
    });

    //  } // end getDataNames


    var inArray = Array.prototype.indexOf ?
        function(val, arr) {
            return arr.indexOf(val)
        } :
        function(val, arr) {
            var i = arr.length;
            while (i--) {
                if (arr[i] === val) return i;
            }
            return -1
        };



    function deleteDublicatesfromArr(data) {
        var arr = [];
        var names = [];
        angular.forEach(data, function(item) {
            if (inArray(item.workType, arr) === -1) {
                arr.push(item.workType);
                names.push({
                    'id': item.workType,
                    'title': item.workType
                });
            }
        });
        return names; //alert(JSON.stringify(names));

    } // end deleteDublicates







    // this.tableParams = new NgTableParams({}, { dataset: data });


    // get table data from server async
    this.tableParams = new NgTableParams({
        page: 1, // show first page
        count: 500 // count per page
    }, {
        counts: [], // hide page counts control
        total: 1, // value less than count hide pagination
        getData: getData
    });


    function getData(params) {
        var deferred = $q.defer();

        $http.get("/data.json").then(function(responce) {
            // succsess get gata from http get
            $scope.data = responce.data.array;
            var filterObj = params.filter();
            var filteredData = $filter('filter')(responce.data.array, filterObj);
            deferred.resolve(filteredData);
        }, function(err) {
            // error get gata from http get
            deferred.reject(err);
        });

        return deferred.promise;
    } // end getData



    //example asunc
    function getAsync(params) {
        var deferred = $q.defer();
        $http.get("/data.json").then(function(responce) {
            // succsess get gata from http get
            deferred.resolve(responce.data.array);
        }, function(err) {
            // error get gata from http get
            deferred.reject(err);
        });

        return deferred.promise;
    };



    getAsync().then(function(resolve) {
        alert("getAsync " + JSON.stringify(resolve));
    }, function(reject) {
        alert("getAsync " + JSON.stringify(reject));
    });


    /*

    // remove dublicates from array

    this.deleteDublicates = function() {
            var arr = [];
            var names = [];
            angular.forEach(data, function(item) {
                if (inArray(item.workType, arr) === -1) {
                    arr.push(item.workType);
                    names.push({
                        'id': item.workType,
                        'title': item.workType
                    });
                }
            });
            return names; //alert(JSON.stringify(names));

        } // end deleteDublicates
    var inArray = Array.prototype.indexOf ?
        function(val, arr) {
            return arr.indexOf(val)
        } :
        function(val, arr) {
            var i = arr.length;
            while (i--) {
                if (arr[i] === val) return i;
            }
            return -1
        };


*/









}); // end controller


/*
var tp = new NgTableParams({}, { getData: function(params){
    
    return executeQuery(params).then(function(data){
        params.total(data.inlineCount);
        return data.results;
    });
}});



    function asyncGreet(name) {
        // perform some asynchronous operation, resolve or reject the promise when appropriate.
        return $q(function(resolve, reject) {
            setTimeout(function() {
                if (name) {
                    resolve('Hello, ' + name + '!');
                } else {
                    reject('Greeting ' + name + ' is not allowed.');
                }
            }, 5000);
        });
    }

    var promise = asyncGreet('Robin Hood');

    promise.then(function(greeting) {
        alert('Success: ' + greeting);
    }, function(reason) {
        alert('Failed: ' + reason);
    });


    */