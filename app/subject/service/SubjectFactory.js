(function() {
	'use strict';

    angular
        .module('cip.subject')
        .factory('SubjectFactory', SubjectFactory);

    SubjectFactory.$inject = [
        '$resource',
        'CommonService'
    ];

    function SubjectFactory($resource,commonService) {
    	
        return $resource( commonService.baseApi+'/subject', {}, {
            $save: {
                url:  commonService.baseApi+'/subject/save',
                method: 'POST'
            },
            $update: {
                url:  commonService.baseApi+'/subject/update',
                method: 'PUT'
            },
            $delete: {
                url:  commonService.baseApi+'/subject/delete',
                method: 'PUT'
            }
           ,
           getSubjectByExamId : {
        	   url:  commonService.baseApi+'/exampaper/:id',
               method: 'GET',
               params : {
            	   id : '@id'
               }
           },
           getSubjectByClassId: {
        	 url:  commonService.baseApi+'/subject/class/:id',
        	 method: 'GET',
        	 params: {
        		 id: '@id'
        	 }
           },
           getStudentSubjectByClassYearId : {
        	   url:  commonService.baseApi+'/subject/elective/class?classYear=:classYear&semester=:semester',
               method: 'GET',
               params : {
            	   classYear : '@classYear',
            	   semester : '@semester'
               }
           },
           
           getSubjectBySemesterId : {
        	   url:  commonService.baseApi+'/subject/department/semester?departmentId=:deptId&semester=:semester',
               method: 'GET',
               params : {
            	   deptId : '@deptId',
            	   semester : '@semester'
               }
           },
           
           getSubjectByClassIdAndSemesterId : {
        	   url:  commonService.baseApi+'/subject/class/semester?classId=:classYearId&semester=:semester',
               method: 'GET',
               params : {
            	   classYearId : '@classYearId',
            	   semester : '@semester'
               },
               isArray: true
           },
           
           saveElectiveSubject: {
               url:  commonService.baseApi+'/subjectelective',
               method: 'POST'
           },
           updateElectiveSubject: {
               url:  commonService.baseApi+'/subjectelective',
               method: 'PUT'
           },
           deleteElectivesubject: {
               url:  commonService.baseApi+'/subjectelective/delete',
               method: 'PUT'
           },
           getElectiveSubjectBySubjectId: {
               url:  commonService.baseApi+'/subjectelective/subject?id=:id&semester=:semester&section=:section',
               method: 'GET',
               params : {
                   id :'@id',
                   semester : '@semester',
                   section  : '@section'
               },
               isArray: true
           },
            getSubjectBySemesterAndSectionAndStaff : {
                url:  commonService.baseApi+'/subject/semester/section/staff?semester=:semester&section=:section',
                method: 'GET',
                params : {
                    semester : '@semester',
                    section  : '@section'
                }
            },getsubjectByClassYearAndSectionAndStaff : {
                url:  commonService.baseApi+'/subject/class/section/staff?classYearId=:classYearId&section=:sectionId',
                method: 'GET',
                params : {
                    classYearId : '@classYearId',
                    section  : '@sectionId'
                }
            }
        });
    }
})();