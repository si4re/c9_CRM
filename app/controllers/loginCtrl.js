'use strict';


myApp.controller('loginCtrl', function($rootScope, $scope, $location, $http, AUTH_EVENTS, myService, AuthService, Session, myFactory) {

    $scope.credentials = {
        email: '',
        password: ''
    };

    $scope.login = function(credentials) {

        AuthService.login(credentials).then(function(user) {
            // console.log("user ");
            // console.log(user);
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            $scope.setCurrentUser(user);
            $location.path('/');


        }, function() {
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        });
    };


    $scope.getAfterAuth = function() {
        // console.log($http.defaults.headers.common);
        // console.log('AuthService.isAuthenticated(): ' + AuthService.isAuthenticated());
        // console.log('Session:');
        // console.log(Session.token, Session.email, Session.role);

        $http.get('/api/todos').then(function(resp) {
            console.log(resp);
            $scope.respGetAfterAuth = resp;
        }, function(err) {
            $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
            console.log(err.data);
        }).then();
    };

}); // end controller