(function() {
	'use strict';

    angular
        .module('cip.holiday')
        .factory('HolidayFactory', HolidayFactory);

    HolidayFactory.$inject = [
        '$resource',
        'CommonService'
    ];

    function HolidayFactory($resource,commonService) {
    	
        return $resource( commonService.baseApi+'/holiday', {}, {
            $save: {
                url:  commonService.baseApi+'/holiday/save',
                method: 'POST'
            },
            $update: {
                url:  commonService.baseApi+'/holiday/update',
                method: 'PUT'
            },
            $delete: {
                url:  commonService.baseApi+'/holiday/delete',
                method: 'PUT'
            },
            getHolidayList: {
                url:  commonService.baseApi+'/holiday/active',
                method: 'GET'
            }
        });
    }
})();