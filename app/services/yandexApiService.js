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