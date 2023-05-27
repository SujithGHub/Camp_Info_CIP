(function() {
    'use strict';

    /**
     * SubjectAllotmentService
     *
     * @author Deepa
     * @copyright
     */
  
    angular
        .module('cip.subjectAllotment')
        .service('SubjectAllotmentService', SubjectAllotmentService);

    SubjectAllotmentService.$inject = [
        '$log',
        'SubjectAllotmentFactory'
     ];

    function SubjectAllotmentService($log,subjectAllotmentFactory) {
    	
    	this.deleteSubjectAllotment = function(params,successCb,errorCb){
    		subjectAllotmentFactory.$delete(params, successCb, errorCb);
    	};
    	this.getAllottedSubjectbyStaff = function(params, successCb,errorCb){
    		subjectAllotmentFactory.getAllottedSubjectbyStaff(params, successCb, errorCb);
    	};

    }

}());
