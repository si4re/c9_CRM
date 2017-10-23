myApp.service('myService', function () {
    this.summ = function (a) {
        return a + a;
    }
    this.publicProperty = "public";
    var privateProperty = "private";
    this.getPrivateProperty = function () {
        return privateProperty;
    }
});

myApp.factory('myFactory', function () {

    var factory = {};

    factory.method1 = function () {
        return 1;
    }

    factory.method2 = function () {
        return 2;
    }

    return factory;
});




myApp.factory('testService', function ($http) {

    var testService = {};

    testService.token = 'OAuth AQAAAAADISwSAASLJ7u-pbUtLkC-s3xtYcoUUo0';

    var tempToken = $http.defaults.headers.common['token'];



    testService.test = function () {


        $http.defaults.headers.common['Authorization'] = testService.token; // set ya token
        delete $http.defaults.headers.common['token']; //  ya api restrict header token


        return $http
            .get('https://cloud-api.yandex.net/v1/disk/resources/download?path=' + 'node-v6.11.4-x64.msi')
            .then(function (response) {

                $http.defaults.headers.common['token'] = tempToken;
                return response.data.href;

            }, function (reject) {
                console.log(reject);
                $http.defaults.headers.common['token'] = tempToken;
                return reject;
            });


    }

    return testService;


});


/*
myApp.factory('testService', function ($http) {

    return {
        getMethod: function(){
           return $http.get('https://google.com'); 
        }

    } // end return

});
*/
myApp.factory('yaApiService', function ($http) {


    var yaApiService = {};

    yaApiService.token = 'OAuth AQAAAAADISwSAASLJ7u-pbUtLkC-s3xtYcoUUo0';

    var tempToken = $http.defaults.headers.common['token'];


    yaApiService.upload = function () {

    } // end yaApiService.upload




    // download method - return  url or error
    yaApiService.download = function (PO, oneC, item) {

        $http.defaults.headers.common['Authorization'] = yaApiService.token; // set ya token
        delete $http.defaults.headers.common['token']; //  ya api restrict header token

        var path = encodeURIComponent(PO + '_' + oneC + '_' + item);

        return $http
            .get('https://cloud-api.yandex.net/v1/disk/resources/download?path=' + path)
            .then(function (response) {

                $http.defaults.headers.common['token'] = tempToken;
                return response.data.href;

            }, function (reject) {
                console.log(reject);
                $http.defaults.headers.common['token'] = tempToken;
                return reject;
            });

    }; //end yaApiService.download



    return yaApiService;
}); // end myApp.factory('yaApiService'