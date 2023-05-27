(function() {
	'use strict';

    angular
        .module('cip.homeWork')
        .factory('HomeWorkFactory', HomeWorkFactory);

    HomeWorkFactory.$inject = [
        '$resource',
        'CommonService'
    ];

    function HomeWorkFactory($resource,commonService) {
    	
        return $resource( commonService.baseApi+'/homework', {}, {
            $save: {
                url:  commonService.baseApi+'/homework',
                method: 'POST'
            },
            $update: {
                url:  commonService.baseApi+'/homework',
                method: 'PUT'
            },
            $delete: {
                url:  commonService.baseApi+'/homework/delete',
                method: 'PUT'
            },
            removeImage: {
                url:  commonService.baseApi+'/homework/remove',
                method: 'PUT',
            },
            getHomeworkPicture:{
            	url: commonService.baseApi+'/homework/:id',
            	method:'GET',
            	params : {
            		id :'@id'
        		},
            },
            getSubmittedHomeworkByHomeworkId:{
            	url: commonService.baseApi+'/homework/submitted/:id',
            	method:'GET',
            	params : {
            		id :'@id'
        		},
            },
        });
    }
})();