(function() {
    'use strict';

    /**
     * @ngdoc Service
     * @name fileDownloadService
     * @module cip.common
     * @description
     *
     * fileDownloadService
     */
  
    angular
        .module('cip.common')
        .service('FileDownloadService', FileDownloadService);

    FileDownloadService.$inject = ['$http', '$q','$mdDialog','CommonService'];

    function FileDownloadService($http, $q, $mdDialog,commonService) {
    	
    	this.downloadTemplate = function (formData, instituteType) {

    		/*$http.post('/download/template', formData)
    		.success(function (data) {
				if(formData.name == 'Class' && instituteType == 'College')
					formData.name = 'Year';
				else if(formData.name == 'Class' && instituteType == 'School')
					formData.name = 'Standard';
				downloadCsv(data.entityList, formData.name)
			});*/
            var deferred = $q.defer();
            $http.post( commonService.baseApi+'/download/template', formData, { responseType: "arraybuffer" }).then(
                function (data) {
                    var type        = data.headers('Content-Type');
                    var disposition = data.headers('Content-Disposition');
                    var fileName;
                    if (disposition) {
                        var match = disposition.match(/.*filename=\"?([^;\"]+)\"?.*/);
                        if (match[1])
                            fileName = match[1];
                    }
                    fileName = fileName.replace(/[<>:"\/\\|?*]+/g, '_');
                    const blob = new Blob([data.data], { type: type });
                    const url = window.URL.createObjectURL(blob);

                    const tempLink = document.createElement("a");
                    document.body.appendChild(tempLink);
                    tempLink.href = url;
                    tempLink.target = "_self";
                    tempLink.download = fileName;
                    tempLink.click();
                    document.body.removeChild(tempLink);
                }, function (data, status) {
                    var e = deferred.reject(e);
                });
            deferred.promise;
    	};
    	
    	function downloadCsv(inputValue, fileName) {
    		var anchor = angular.element('<a/>');
			anchor.attr({
				href: 'data:attachment/csv,' + encodeURI(inputValue),
				target: '_blank',
				download: fileName+".csv"
			})[0].click();
    	}
    	
    	this.downloadPayment = function (formData, instituteType) {

            var deferred = $q.defer();
            $http.post( commonService.baseApi+'/download/payment', formData, { responseType: "arraybuffer" }).then(
                function (data) {
                    var type        = data.headers('Content-Type');
                    var disposition = data.headers('Content-Disposition');
                    var fileName;
                    if (disposition) {
                        var match = disposition.match(/.*filename=\"?([^;\"]+)\"?.*/);
                        if (match[1])
                            fileName = match[1];
                    }
                    fileName = fileName.replace(/[<>:"\/\\|?*]+/g, '_');
                    const blob = new Blob([data.data], { type: type });
                    const url = window.URL.createObjectURL(blob);

                    const tempLink = document.createElement("a");
                    document.body.appendChild(tempLink);
                    tempLink.href = url;
                    tempLink.target = "_self";
                    tempLink.download = fileName;
                    tempLink.click();
                    document.body.removeChild(tempLink);
                    $mdDialog.cancel();
                }, function (data, status) {
                    var e = deferred.reject(e);
                });
            deferred.promise;
    	};
    	
    }

}());
