(function() {
	'use strict';

	angular
	.module('cip.subjectAllotment')
	.factory('SubjectAllotmentFactory', SubjectAllotmentFactory);

	SubjectAllotmentFactory.$inject = [
		'$resource',
		'CommonService'
		];

	function SubjectAllotmentFactory($resource,commonService) {

		return $resource( commonService.baseApi+'/subjectallotment', {}, {

			$delete: {
				url:  commonService.baseApi+'/subjectallotment/delete',
				method: 'PUT'
			},
			getAllottedSubjectbyStaff: {
				url:  commonService.baseApi+'/subjectallotment/allotted/subject?section=:section&semester=:semester',
				method: 'GET',
				params : {
					section : '@section',
					semester : '@semester'
				},
				isArray:true
			}
		});
	}
})();