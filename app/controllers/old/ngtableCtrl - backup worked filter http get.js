'use strict';


myApp.controller('ngtableCtrl', function($scope, NgTableParams, $q, $http, $filter) {

    $scope.message = "message from ngtableCtrl";


    var data = [{ name: "Dan", type: 50 }, { name: "Mark", type: 50 }, { name: "Dan", type: 100 }, { name: "Dan", type: 100 }];
    this.names1 = [{ "id": "Dan", "title": "title1  for Dan" }];

    // this.tableParams = new NgTableParams({}, { dataset: data });

    // get table data from server async
    this.tableParams = new NgTableParams({}, { getData: getData });


    function getData(params) {
        var deferred = $q.defer();

        $http.get("/data.json").then(function(responce) {
            // succsess get gata from http get
            var filterObj = params.filter();
            var filteredData = $filter('filter')(responce.data.array, filterObj);
            deferred.resolve(filteredData);
        }, function(err) {
            // error get gata from http get
            deferred.reject(err);
        });

        return deferred.promise;
    }



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



    // remove dublicates from array

    this.deleteDublicates = function() {
            var arr = [];
            var names = [];
            angular.forEach(data, function(item) {
                if (inArray(item.name, arr) === -1) {
                    arr.push(item.name);
                    names.push({
                        'id': item.name,
                        'title': item.name
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