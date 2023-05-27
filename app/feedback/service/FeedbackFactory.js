(function() {
	'use strict';

    angular
        .module('cip.feedback')
        .factory('FeedbackFactory', FeedbackFactory);

    FeedbackFactory.$inject = [
        '$resource',
        'CommonService'
    ];

    function FeedbackFactory($resource,commonService) {
    	
        return $resource( commonService.baseApi+'/feedback/latest/:id', {id : '@id'}, {
            saveFeedback: {
                url:  commonService.baseApi+'/feedback/save',
                method: 'POST'
            },
            updateFeedback: {
                url:  commonService.baseApi+'/feedback/update',
                method: 'POST'
            }
        	
        });
    }
})();