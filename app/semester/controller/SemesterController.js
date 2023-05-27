(function() {
    'use strict';
    /**
     * @author Gunasekaran jayaraj
     */
    angular
        .module('cip.semester')
        .controller('SemesterController', SemesterController);

    SemesterController.$inject = ['$log', '$scope', '$mdDialog', 'SemesterService', 'CommonService', 'AcademicService', 'StandardService'];

    /* @ngInject */
    function SemesterController($log, $scope, $mdDialog, semesterService, commonService, academicService, standardService) {
        var vm = this;

        vm.init 					= init;
        vm.mScope 					= {};
        vm.saveOrUpdateSemester 	= saveOrUpdateSemester;
        vm.mScope.getSemesterByClassYear   = getSemesterByClassYear;
        
        function saveOrUpdateSemester(formData) {
        	
        	if(formData.id) {
        		semesterService.updateSemester(formData, successCb, errorCb);
        	} else {
        		semesterService.saveSemester(formData, successCb, errorCb);
        	}
        	function successCb(result) {
        		init();
        	}
        	function errorCb(error) {
        		$log.debug("FAILURE saveOrUpdateSemester:",error)
        	}
        	
        };
        
        $scope.updateSemester = function(type) {
			setTimeout(function(){ getValue(type); }, 0);
		};
		
		//Get edit and delete data from datatable
		function getValue(type) {
			var data ={};
			var table = $('#semesterDataTable').dataTable();
			$(".selected", table.fnGetNodes()).each(function() {
				data = table.fnGetData($(this).parents())
				$(this).removeClass('selected');
			});
			vm.initData = data;
			commonService.triggerModelForm();
		};

        function init() {
        	semesterService.initTable('semesterDataTable', {});
        	getClassYearByConstant();
        };
        
        function getClassYearByConstant() {
        	standardService.getClassYearByConstant(successCb, errorCb);
			function successCb(result) {
				vm.mScope.classYearList = result;
				$log.debug("SUCCESS classYear",result);
			}
			function errorCb(error) {
				$log.debug("FAILURE classYear:",error)
			}
        };
        
        function getSemesterByClassYear(year) {
        	vm.mScope.semestersLists=commonService.getSemesterByClassYear(year);
        };

    }
})();