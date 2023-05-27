(function() {
	'use strict';

	angular
	.module('cip.timeTable')
	.factory('TimeTableFactory', TimeTableFactory);

	TimeTableFactory.$inject = [
	                         '$resource',
		'CommonService'
	                         ];

	function TimeTableFactory($resource,commonService) {

		return $resource( commonService.baseApi+'/timetable', {}, {
	
			getTimeTable: {
				url:  commonService.baseApi+'/timetable',
				method: 'GET'
			},
			getTimeTableByStaff: {
				url:  commonService.baseApi+'/timetable/staff',
				method: 'GET'
			}

		});
	}
})();