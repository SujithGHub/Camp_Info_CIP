(function() {
	'use strict';

    angular
        .module('cip.events')
        .factory('EventFactory', EventFactory);

    EventFactory.$inject = [
        '$resource',
        'CommonService'
    ];

    function EventFactory($resource,commonService) {
    	
        return $resource( commonService.baseApi+'/events/latest', {}, {
            $delete: {
                url:  commonService.baseApi+'/events/delete',  
                method: 'POST'
            },
        removeEventImage: {
            url:  commonService.baseApi+'/events/remove',  
            method: 'PUT'
        },
        getEventCount: {
            url:  commonService.baseApi+'/events/eventCount',  
            method: 'GET'
        },
        autoDeleteEvent: {
            url:  commonService.baseApi+'/events/auto/delete',  
            method: 'POST'
        },
        getEventList :{
            url: commonService.baseApi+'/events',
            method:'GET',
            params : {
                start : '@start',
                limit : '@limit',
                searchValue:'@searchValue'
            }
        }

        });
    }
})();