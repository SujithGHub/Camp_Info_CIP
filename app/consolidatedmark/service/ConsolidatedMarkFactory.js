(function() {
	'use strict';

	angular
	.module('cip.consolidatedMark')
	.factory('ConsolidatedMarkFactory', ConsolidatedMarkFactory);

	ConsolidatedMarkFactory.$inject = [
	                         '$resource',
		                     'CommonService'
	                         ];

	function ConsolidatedMarkFactory($resource,commonService) {

		return $resource( commonService.baseApi+'/consolidate', {}, {
	
			getStudentConsolidatedMark: {
				url:  commonService.baseApi+'/consolidate',
				method: 'GET',
				isArray:true
			}
	
			
		});
	}
})();