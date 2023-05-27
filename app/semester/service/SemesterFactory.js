(function() {
	'use strict';

	angular
	.module('cip.semester')
	.factory('SemesterFactory', SemesterFactory);

	SemesterFactory.$inject = [
	                             '$resource',
		'CommonService'
	                             ];

	function SemesterFactory($resource,commonService) {

		return $resource( commonService.baseApi+'/semester', {}, {
			$update: {
				url:  commonService.baseApi+'/semester',
				method: 'PUT'
			},
			$save: {
				url:  commonService.baseApi+'/semester',
				method: 'POST'
			}
		});
	}
})();