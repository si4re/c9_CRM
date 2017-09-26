//     nervgh/angular-file-upload


'use strict';

myApp.controller('fileCtrl', function($scope, $http, FileUploader, sharePO) {

    $scope.idPO = sharePO.getPO();


    var uploader = $scope.uploader = new FileUploader({
        url: 'upload',
        removeAfterUpload: 'true',
        // method: 'PUT'  for ya.ru
        // autoUpload: 'false'
    });



    // FILTERS

    // a sync filter
    uploader.filters.push({
        name: 'syncFilter',
        fn: function(item /*{File|FileLikeObject}*/ , options) {
            console.log('syncFilter');
            return this.queue.length < 10;
        }
    });

    // an async filter
    uploader.filters.push({
        name: 'asyncFilter',
        fn: function(item /*{File|FileLikeObject}*/ , options, deferred) {
            console.log('asyncFilter');
            setTimeout(deferred.resolve, 1e3);
        }
    });

    // CALLBACKS

    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
        //console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function(fileItem) {
        // console.info('onAfterAddingFile', fileItem);

    };
    uploader.onAfterAddingAll = function(addedFileItems) {
        //console.info('onAfterAddingAll', addedFileItems);
    };


    uploader.onBeforeUploadItem = function(item) {

        console.log('!!!!!!!!onBeforeUploadItem');
        item.formData.push({ PO: sharePO.getPO() }); // get PO number from routecontroller
        console.info('onBeforeUploadItem', item);

    };
    uploader.onProgressItem = function(fileItem, progress) {
        // console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress) {
        //console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        console.info('!!!!!!!!!!!!!!!!!!!!!!!!!!');
        console.info(fileItem._file.name);
        console.info(response);
        console.info('!!!!!!!!!!!!!!!!!!!!!');

    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function(fileItem, response, status, headers) {
        // console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
        //  console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function() {
        // console.info('onCompleteAll');
        var completeAll = $scope.completeAll = "complete all";
        $scope.getIdProjectData(sharePO.getPO()); //update table
    };

    //  console.info('uploader', uploader);
});