(function() {
	'use strict';

	angular
	.module('cip.examination')
	.factory('ExaminationFactory', ExaminationFactory);

	ExaminationFactory.$inject = [
	                              '$resource',
		'CommonService'
	                              ];

	function ExaminationFactory($resource,commonService) {

		return $resource( commonService.baseApi+'/examination', {}, {
			$save: {
				url:  commonService.baseApi+'/examination/save',
				method: 'POST'
			},
			$update: {
				url:  commonService.baseApi+'/examination/update',
				method: 'PUT'
			},
			saveExampaper: {
				url:  commonService.baseApi+'/exampaper/save',
				method: 'POST'
			},
			updateExampaper: {
				url:  commonService.baseApi+'/exampaper/update',
				method: 'PUT'
			},
			$delete: {
				url:  commonService.baseApi+'/examination/delete',
				method: 'PUT'
			},
			getExamByClassId : {
				url :  commonService.baseApi+'/examination/class/:id',
				method:'GET',
				params : {
					id : '@id'
				}
			},
			getExamByDepartmentAndClassId : {
				url :  commonService.baseApi+'/examination/class?departmentId=:depId&classId=:classId',
				method:'GET',
				params : {
					depId : '@depId',
					classId : '@classId'
				}
			},
			getExamByClassAndAcademicId : {
				url :  commonService.baseApi+'/examination/academic?id=:id&academicId=:academicId',
				method:'GET',
				params : {
					id : '@id',
					academicId :'@academicId'
				}
			},
			getExamByClassAcademicIdAndSemester : {
				url :  commonService.baseApi+'/examination/semester',
				method:'GET'
			},
			getExamByStudent : {
				url: commonService.baseApi+'/examination/student',
				method:'GET'
			},
			getExamList : {
				url: commonService.baseApi+'/examination',
				method:'GET'
			},
			getExamPaperById : {
				url: commonService.baseApi+'/exampaper/:id',
				method:'GET',
				params : {
					id : '@id'
				}
			},
			deleteExampaper : {
				url:  commonService.baseApi+'/exampaper/delete',
				method: 'PUT'
			},
			getExamPaperByExamAndSubjectId : {
				url:  commonService.baseApi+'/exampaper/subject',
				method: 'GET'
			},
			getExamByClassSectionAndAcademicId : {
				url :  commonService.baseApi+'/examination/section',
				method:'GET'
			},
			getExamByClassSectionAcademicIdAndSemester : {
				url :  commonService.baseApi+'/examination/academic/semester',
				method:'GET'
			}


		});
	}
})();