'use strict';

var myApp = angular.module('myApp', ['ngRoute', 'angularFileUpload', 'xeditable', 'ui.bootstrap', 'ui.bootstrap.modal', 'ngTable', 'hm.readmore', 'angular-js-xlsx', 'ymaps']);


// for auth
myApp.constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
});

// for auth
myApp.constant('USER_ROLES', {
    admin: 'admin',
    user: 'user'
});


myApp.service('Session', function () {
    this.create = function (token, email, role) {
        this.token = token;
        this.email = email;
        this.role = role;
    };
    this.destroy = function () {
        this.token = null;
        this.email = null;
        this.role = null;
    };
});



//auth service
myApp.factory('AuthService', function ($http, $location, $rootScope, Session, AUTH_EVENTS) {
    var authService = {};

    authService.login = function (credentials) {

        return $http
            .post('/api/auth/login', credentials)
            .then(function (res) {

                console.log(res);

                if (res.data.token) {

                    console.log('token was received');

                    // LocalStoradge strategy
                    // window.localStorage.setItem('CurrentUser.token', res.data.token); // store token in localstorage
                    // window.localStorage.setItem('CurrentUser.email', res.data.user.email); // store User in localstorage
                    // window.localStorage.setItem('CurrentUser.role', res.data.user.role); // store User in localstorage
                    // $http.defaults.headers.common['token'] = window.localStorage.getItem('CurrentUser.token'); // set token to default headers

                    // Session strategy
                    $http.defaults.headers.common['token'] = res.data.token; // set token to default headers

                    return res;
                }


            }, function (err) {
                console.log("AuthService factory error:");
                console.log(err);
            })
            .then(function (res) {
                Session.create(res.data.token, res.data.user.email, res.data.user.role);
                return res.data.user;
            });
    }; // end Login

    authService.logout = function () {

        $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);

        delete $http.defaults.headers.common.token;
        console.log('logout ' + $http.defaults.headers);
        Session.destroy();
        $location.path('/login'); // redirect to login

    };


    authService.isAuthorized = function (authorizedRoles) {
        if (!angular.isArray(authorizedRoles)) { // check if input data is array
            authorizedRoles = [authorizedRoles];
        }
        return (authService.isAuthenticated() && // return boolean
            authorizedRoles.indexOf(Session.role) !== -1); // check if input data = current user role
    };


    authService.isAuthenticated = function () {
        return !!Session.token;
    };


    return authService;
});

// share data between two controllers
myApp.service("sharePO", function () {

    var _PO = {};

    return {
        getPO: function () {
            return _PO;
        },
        setPO: function (value) {
            _PO = value;
        }
    };

});


// share data between two controllers
myApp.service("share1C", function () {

    var _1c = {};

    return {
        get: function () {
            return _1c;
        },
        set: function (value) {
            _1c = value;
        }
    };

});














// configure our routes
myApp.config(function ($routeProvider, USER_ROLES) {


    $routeProvider

        // route for the home page
        .when('/', {
            templateUrl: 'views/pages/PO.html',
            // controller: 'mainController' - not work with Currentuser (hide admin role not work)
        })

        .when('/login', {
            templateUrl: 'views/pages/login.html',
            // controller: '1cController'
        })

        .when('/1c', {
            templateUrl: 'views/pages/1c.html',
            controller: '1cController'
        })

        .when('/payment', {
            templateUrl: 'views/pages/payment.html',
            controller: 'contactController',
            authorize: [USER_ROLES.admin] // allow admin only
        })

        // PO -> detail
        .when('/:param1', {
            templateUrl: 'views/pages/detail.html',
            controller: 'urlattrController'
        })


        // route to maps
        .when('/:param1/:param2/:param3', {
            templateUrl: 'views/pages/maps.html',
            controller: 'ymapsCtrl'
        })

        // route to 1c
        .when('/:param1/:param2', { //https://namitamalik.github.io/routeParams-in-AngularJS/
            templateUrl: 'views/pages/1c.html',
            controller: '1cController'
        })

});





myApp.run(function ($http, $rootScope, $location, AUTH_EVENTS, AuthService, USER_ROLES, Session) {

    $rootScope.$on('$routeChangeStart', function (event, to, from) {

        if (!AuthService.isAuthenticated()) {
            $location.path('/login');
        }

        if (to.authorize) {
            console.log(to);

            if (!AuthService.isAuthorized(to.authorize)) { // if vasya was not allowed
                event.preventDefault(); // revoke action
                console.log('access denied');
                $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
            }

        }


    });
});








//  This is a container for a lot of global application logic, and an alternative to Angular’s run function
//  Controller in body
myApp.controller('mainController', function ($scope, $rootScope, $http, USER_ROLES, AuthService, Session, $location, AUTH_EVENTS, $timeout) {
    // create a message to display in our view
    $scope.messageBody = 'message from mainController';

    // For alerts:
    // 401 Unauthorized:
    $scope.Unauthorized_401 = false;

    $rootScope.$on(AUTH_EVENTS.loginFailed, function (event, data) {
        $scope.Unauthorized_401 = true;
        $timeout(function () {
            $scope.Unauthorized_401 = false;
        }, 5000);

    });

    // 403 Forbidden:
    $scope.Forbidden_403 = false;

    $rootScope.$on(AUTH_EVENTS.notAuthorized, function (event, data) {
        $scope.Forbidden_403 = true;
        $timeout(function () {
            $scope.Forbidden_403 = false;
        }, 5000);

    });


    $scope.currentUser = null;
    $scope.userRoles = USER_ROLES;
    // $scope.isAuthorized = AuthService.isAuthorized;

    $scope.isAuthenticated = false; // default

    $rootScope.$on(AUTH_EVENTS.loginSuccess, function (event, data) {
        $scope.isAuthenticated = true;
    });
    $rootScope.$on(AUTH_EVENTS.logoutSuccess, function (event, data) {
        $scope.isAuthenticated = false;
    });

    $scope.setCurrentUser = function (user) {
        $scope.currentUser = user;
    };


    $scope.logoutCurrentUser = function () {

        AuthService.logout();
        $scope.setCurrentUser(null);

        // LocalStoradge strategy
        // window.localStorage.removeItem('CurrentUser.token');
        // window.localStorage.removeItem('CurrentUser.email');
        // window.localStorage.removeItem('CurrentUser.role');
        /*
                $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
                delete $http.defaults.headers.common.token;
                console.log('logout ' + $http.defaults.headers);
                Session.destroy();
                $scope.currentUser = null;
                $location.path('/login'); // redirect to login
        */
    };


    // LocalStoradge Strategy 
    /* if (window.localStorage.getItem('CurrentUser.token')) {

         $scope.currentUser = {
             email: window.localStorage.getItem('CurrentUser.email'),
             role: window.localStorage.getItem('CurrentUser.role'),
         };

     } */

}); // end mainController






myApp.controller('1cController', function ($scope, $http, $routeParams, share1C, sharePO, $timeout, FileUploader, $window, yaApiService, testService) {
    $scope.message = 'message from 1cController';

    console.log($http.defaults.headers);



    $scope.PONumber1 = $routeParams.param1;
    $scope.one1Number = $routeParams.param2;

    var PO = $routeParams.param1;
    var oneC = $routeParams.param2;


    // update CMR
    $scope.checkboxCMRUpdate = function (boolean) {

        var data = {
            project: PO,
            oneC: oneC,
            CMR: boolean
        };

        $http.put("/api/PO/1c/CMR", data).then(function (response) {
            console.log(response);

        }, function (err) {
            console.log(err);
        }).then(function () {

        });
    };

    // read CMR statusd
    $scope.CMRStatus = false;

    $scope.getCMRStatus = function () {

        var _PO = PO;
        var _oneC = oneC;

        $timeout(function () {

            $http.get("/api/" + _PO + "/" + _oneC + "/CMR").then(function (response) {
                $scope.CMRStatus = response.data.CMR;
                // console.log($scope.CMRStatus);
            }, function (err) {
                console.log(err);
            });

        }, 10);

    }; // end get

    $scope.getCMRStatus();


    // update PNR
    $scope.checkboxPNRUpdate = function (boolean) {

        var data = {
            project: PO,
            oneC: oneC,
            PNR: boolean
        };

        $http.put("/api/PO/1c/PNR", data).then(function (response) {
            console.log(response);

        }, function (err) {
            console.log(err);
        }).then(function () {

        });
    };

    // read PNR status
    $scope.PNRStatus = false;

    $scope.getPNRStatus = function () {

        var _PO = PO;
        var _oneC = oneC;

        $http.get("/api/" + _PO + "/" + _oneC + "/PNR").then(function (response) {
            $scope.PNRStatus = response.data.PNR;
        });

    }; // end get

    $scope.getPNRStatus();

    ////////////////////////////////////////////////////////////////////////////
    // upload to ya api


    // 1. Create record in db:   filename: filename
    // 2. Get url from cloud, link alive for 30 min
    //    if ok -> nothing
    //    if error -> delete record in db
    // 3. Upload $http.put file to cloud
    //    if ok -> nothing
    //    if error -> delete record in db

    /*
     */

    /*
    $http.put("/api/PO/1c/deleteFilescloud", data1).then(function(response) {
        console.log(response);

    }, function(err) {
        console.log(err);
    }).then(function() {

    }); 
    */



    var tempToken = $http.defaults.headers.common['token']; //////  ya api restrict header token

    var uploader1C = $scope.uploader1C = new FileUploader({
        url: '/test',
        removeAfterUpload: 'true',
        method: 'PUT' // for ya.ru
        //autoUpload: 'false'
    });


    uploader1C.onAfterAddingFile = function (fileItem) {
        console.log('onAfterAddingFile');


        // 1. Get url from cloud, link alive for 30 min


        $http.defaults.headers.common['Authorization'] = 'OAuth AQAAAAADISwSAASLJ7u-pbUtLkC-s3xtYcoUUo0'; // ya token
        delete $http.defaults.headers.common['token']; /////////   ya api restrict header token
        var path = encodeURIComponent(PO + '_' + oneC + '_' + fileItem._file.name);

        $http.get('https://cloud-api.yandex.net/v1/disk/resources/upload?path=' + path + '&overwrite=true').then(function (response) {

            fileItem.url = response.data.href;
            $http.defaults.headers.common['token'] = tempToken;

        }, function (reject) {
            console.log(reject);
            $http.defaults.headers.common['token'] = tempToken;
        });

    }; // end uploader1C.onAfterAddingFile = function(fileItem)         


    uploader1C.onBeforeUploadItem(function (fileItem) {

        // $scope.hideSpinner = true;
    });




    uploader1C.onProgressItem = function (fileItem, progress) {
        $scope.hideSpinner = false;

    };

    uploader1C.onSuccessItem = function (fileItem, response, status, headers) {
        console.info(fileItem._file.name);

        // if error upload to ya disk
        if (status != 201) {

            console.log('error upload to ya disk')
        } // end if

        switch (status) {
            case 201:
                console.log('201 файл был загружен без ошибок');

                $scope.spinner = true;

                // if success item -> create record in db
                var data1 = {
                    project: PO,
                    oneC: oneC,
                    filename: fileItem._file.name
                };

                $http.put("/api/PO/1c/filescloud", data1).then(function (response) {
                    console.log(response);
                    console.log(fileItem.url);

                    // update table
                    // $http.defaults.headers.common['token'] = tempToken;
                    $scope.getListFilesFromCloud(PO, oneC);

                });


                break;
            case 202:
                console.log('202 Accepted— файл принят сервером, но еще не был перенесен непосредственно в Диск');
                break;
            case 412:
                console.log('412 Precondition Failed— при дозагрузке файла был передан неверный диапазон в заголовке Content - Range.');
                break;
            case 413:
                console.log('413 Payload Too Large— размер файла превышает 10 ГБ.');
                break;
            case 500:
                console.log('500 Internal Server Error или 503 Service Unavailable— ошибка сервера, попробуйте повторить загрузку.');
                break;
            case 507:
                console.log('507 Insufficient Storage— для загрузки файла не хватает места на Диске пользователя.');
                break;

        }


    };

    uploader1C.onErrorItem = function (fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
    };

    uploader1C.onCancelItem = function (fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };




    $scope.getListFilesFromCloud = function (PO, oneC) {

        console.log('start getListFilesFromCloud');

        $scope.ListFilesFromCloud = [];
        $http.get("/api/filescloud/" + PO + '/' + oneC).then(function (response) {

            console.log(response);

            $scope.ListFilesFromCloud = response.data;
        }, function (reject) {
            console.log(reject);
        });

    } // end getListFilesFromCloud


    $scope.getListFilesFromCloud(PO, oneC);



    $scope.deleteFileFromCloud = function (filename) {

        $http.defaults.headers.common['Authorization'] = 'OAuth AQAAAAADISwSAASLJ7u-pbUtLkC-s3xtYcoUUo0'; // ya token
        delete $http.defaults.headers.common['token']; /////////   ya api restrict header token

        $http.delete('https://cloud-api.yandex.net/v1/disk/resources?path=' + encodeURIComponent(PO + '_' + oneC + '_' + filename) + '&permanently=true').then(function (response) {
            console.log(response);



            switch (response.status) {
                case 204:
                    console.log('204 OK удален');

                    $http.defaults.headers.common['token'] = tempToken;

                    var data1 = {
                        project: PO,
                        oneC: oneC,
                        filename: filename
                    };

                    // delete record in db
                    $http.put("/api/PO/1c/deleteFilescloud", data1).then(function (response) {
                        console.log(response);

                    }, function (err) {
                        console.log(err);
                    });

                    break;
            }


        }, function (reject) {
            console.log('reject');
            console.log(reject);

            $http.defaults.headers.common['token'] = tempToken;

            switch (reject.status) {

                case 202:
                    console.log('202 Операция выполняется асинхронно');
                    break;
                case 400:
                    console.log('400 Некорректные данные');
                    break;
                case 401:
                    console.log('401 	Не авторизован');
                    break;
                case 403:
                    console.log('403 Доступ запрещён. Возможно, у приложения недостаточно прав для данного действия');
                    break;
                case 404:
                    console.log('404 Не удалось найти запрошенный ресурс');

                    var data1 = {
                        project: PO,
                        oneC: oneC,
                        filename: filename
                    };

                    // delete record in db
                    $http.put("/api/PO/1c/deleteFilescloud", data1).then(function (response) {
                        console.log(response);

                    }, function (err) {
                        console.log(err);
                    });


                    break;

                case 429:
                    console.log('507 Слишком много запросов');
                    break;

                case 503:
                    console.log('507 Сервис временно недоступен');
                    break;

            }

        });

    }; // end deleteFileFromCloud



    // download from ya api
    /*
     Запросить URL для скачивания.
     Скачать файл по полученному адресу, указав тот же OAuth-токен, что и в исходном запросе.
    */

    $scope.downloadFromYaApi = function (item) {

        yaApiService.download(PO, oneC, item).then(function (response) {
            window.open(response, '_self');
        });

    }; // end downloadFromYaApi



}); // end  1c controller

myApp.controller('contactController', function ($scope, sharePO) {

    $scope.test1 = 'message from contactController';
    $scope.message = sharePO.getPO();

    /*
    $scope.$watch(function() { return sharePO.getPO(); }, function(newValue, oldValue) {
        if (newValue != null) {
            //update Controller2's xxx value
            $scope.PONumber1 = newValue;
        }
    }, true);
*/





    $scope.searchItem = ''; // set the default search/filter term


}); // end contact controller

myApp.controller('urlattrController', function ($scope, $http, $routeParams, sharePO) {

    var PONumber1 = $routeParams.param1;

    $scope.message = "message from urlattrController"

    sharePO.setPO(PONumber1);

    // project get id data
    $scope.getIdProjectData = function (PO) {
        $scope.IdProjectData = [];
        $http.get("/projects/" + PO).then(function (response) {
            $scope.IdProjectData = response.data;
        }).then(function (response) {});
    };

    $scope.getIdProjectData(PONumber1);

    // delete file
    $scope.hideBTN = false;
    $scope.deleteFile = function (id) {
        $http.delete("/download/" + id).then(function (response) {
            $scope.deleteFileResponse = response.data;
        }).then(function (response) {

        });
    };

    // delete row

    $scope.arr = [0, 1, 2, 3, 4, 5];

    $scope.deleteItem = function (array, item) {

        var index = array.indexOf(item);
        if (index > -1) {
            $scope.ind = index;
            array.splice(index, 1);
            $scope.newArray = array;

        } else {
            alert("error from slice");
        }
    };





});






// not work with ng route
/*
myApp.run(function(editableOptions, editableThemes) {
    editableThemes.bs3.inputClass = 'input-sm';
    editableThemes.bs3.buttonsClass = 'btn-sm';
    editableOptions.theme = 'bs3';
});

*/