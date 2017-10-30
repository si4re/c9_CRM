'use strict';


myApp.controller('yaCloudCtrl', function ($scope, $http, sharePO, yaApiService, $window, $routeParams, FileUploader) {
    $scope.message = "message from yaCloudCtrl";




    var PO = $routeParams.param1;
    var oneC = $routeParams.param2;



    ////////////////////////////////////////////////////////////////////////////
    // upload to ya api


    // 1. Create record in db:   filename: filename
    // 2. Get url from cloud, link alive for 30 min
    //    if ok -> nothing
    //    if error -> delete record in db
    // 3. Upload $http.put file to cloud
    //    if ok -> nothing
    //    if error -> delete record in db


    // section 1c.html

    var uploader = $scope.uploader1C = new FileUploader({
        url: '/test',
        removeAfterUpload: 'true',
        method: 'PUT' // for ya.ru
        //autoUpload: 'false'
    });


    var tempToken = $http.defaults.headers.common['token']; //////  ya api restrict header token


    uploader.onAfterAddingFile = function (fileItem) {
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

    uploader.onProgressItem = function (fileItem, progress) {
        $scope.hideSpinner = false;

    };

    uploader.onSuccessItem = function (fileItem, response, status, headers) {
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

    uploader.onErrorItem = function (fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
    };

    uploader.onCancelItem = function (fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };



    // end upload





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





















    // upload PO section  detail.html


    var uploaderPO = $scope.uploaderPO = new FileUploader({
        url: '/test',
        removeAfterUpload: 'true',
        method: 'PUT' // for ya.ru
        //autoUpload: 'false'
    });




    uploaderPO.onAfterAddingFile = function (fileItem) {
        console.log('onAfterAddingFile');


        // 1. Get url from cloud, link alive for 30 min


        $http.defaults.headers.common['Authorization'] = 'OAuth AQAAAAADISwSAASLJ7u-pbUtLkC-s3xtYcoUUo0'; // ya token
        delete $http.defaults.headers.common['token']; /////////   ya api restrict header token
        var path = encodeURIComponent(PO + '_' + fileItem._file.name);

        $http.get('https://cloud-api.yandex.net/v1/disk/resources/upload?path=' + path + '&overwrite=true').then(function (response) {

            fileItem.url = response.data.href;
            $http.defaults.headers.common['token'] = tempToken;

        }, function (reject) {
            console.log(reject);
            $http.defaults.headers.common['token'] = tempToken;
        });

    }; // end uploader1C.onAfterAddingFile = function(fileItem)         

    uploaderPO.onProgressItem = function (fileItem, progress) {
        $scope.hideSpinner = false;

    };

    uploaderPO.onSuccessItem = function (fileItem, response, status, headers) {
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
                    filename: fileItem._file.name
                };

                $http.put("/api/PO/filescloud", data1).then(function (response) {
                    console.log(response);
                    console.log(fileItem.url);

                    // update table
                    // $http.defaults.headers.common['token'] = tempToken;
                    $scope.getListFilesFromCloudPO(PO);

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

    uploaderPO.onErrorItem = function (fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
    };

    uploaderPO.onCancelItem = function (fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };



    // end upload



    $scope.deleteFileFromCloudPO = function (filename) {

        $http.defaults.headers.common['Authorization'] = 'OAuth AQAAAAADISwSAASLJ7u-pbUtLkC-s3xtYcoUUo0'; // ya token
        delete $http.defaults.headers.common['token']; /////////   ya api restrict header token

        $http.delete('https://cloud-api.yandex.net/v1/disk/resources?path=' + encodeURIComponent(PO + '_'  + filename) + '&permanently=true').then(function (response) {
            console.log(response);



            switch (response.status) {
                case 204:
                    console.log('204 OK удален');

                    $http.defaults.headers.common['token'] = tempToken;

                    var data1 = {
                        project: PO,
                        filename: filename
                    };

                    // delete record in db
                    $http.put("/api/PO/deleteFilescloud", data1).then(function (response) {
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
                        filename: filename
                    };

                    // delete record in db
                    $http.put("/api/PO/deleteFilescloud", data1).then(function (response) {
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





    $scope.downloadFromYaApiPO = function (item) {
        
                yaApiService.downloadPO(PO,item).then(function (response) {
                    window.open(response, '_self');
                });
        
            }; // end downloadFromYaApi





}); // end controller