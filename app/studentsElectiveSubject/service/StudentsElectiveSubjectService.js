(function() {
    'use strict';

    /**
     * @ngdoc Service
     * @name StudentsElectiveSubjectService
     * @module cip.studentsElectiveSubject
     * @require $log,
     * @description
     *
     * StudentsElectiveSubjectService
     *
     * @author Jenis Ephrim
     * @copyright
     */
  
    angular
        .module('cip.studentsElectiveSubject')
        .service('StudentsElectiveSubjectService', StudentsElectiveSubjectService);

    StudentsElectiveSubjectService.$inject = [ '$log', 'StudentsElectiveSubjectFactory' ];

	function StudentsElectiveSubjectService($log, studentsElectiveSubjectFactory) {
		this.saveStudentsElectiveSubject = function(params, successCb, errorCb) {
			studentsElectiveSubjectFactory.$save(params, successCb, errorCb);
		};
    }

}());