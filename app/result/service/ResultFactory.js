(function() {
	'use strict';

    angular
        .module('cip.result')
        .factory('ResultFactory', ResultFactory);

    ResultFactory.$inject = [
        '$resource',
		'CommonService'
    ];

    function ResultFactory($resource,commonService) {
    	
        return $resource( commonService.baseApi+'/result/exam/:id', {id : '@id'}, {
           
	        getResultByExamAndRollNo: {
	        		url: commonService.baseApi+'/result/exam/rollno?examId=:id&rollNo=:rollNo',
	        		method:'GET',
	        		params:{
	        			id: '@id',
	        			rollNo: '@rollNo'
	        		}
	        },
	        $update: {
				url:  commonService.baseApi+'/result',
				method: 'PUT'
			},
			getResultImageByExamination: {
	        		url: commonService.baseApi+'/result/files/exam?id=:id',
	        		method:'GET',
	        		params:{
	        			id: '@id'
	        		}
	        },
	        getResultImageByExaminationAndRollNo: {
	        	url: commonService.baseApi+'/result/files/exam/rollno?id=:id&rollNo=:rollNo',
	        	method:'GET',
	        	params:{
	        		id: '@id',
	        		rollNo: '@rollNo'
	        	}
	        },
	        removeImage: {
                url:  commonService.baseApi+'/result/remove',
                method: 'PUT',
            }
        });
    }
})();