(function() {
	'use strict';
	/**
	 * @author Ashokrajan
	 */
	angular
	.module('cip.section')
	.controller('SectionController', SectionController);

	SectionController.$inject = ['$log', 'SectionService', 'DepartmentService', 'StandardService', 'SharedService', '$scope', '$mdDialog'];

	/* @ngInject */
	function SectionController($log, sectionService, departmentService, standardService, sharedService, $scope, $mdDialog) {
		var vm = this;

		vm.init 	= init;
		vm.mScope = [];
		vm.mScope.departmentList = {};
		vm.saveOrUpdateSection = saveOrUpdateSection;
		vm.mScope.getClassByDepartmentId = getClassByDepartmentId;
		vm.initDataTable = initDataTable;
		
		function init() {
			vm.mScope.instituteType = sharedService.institute.instituteType;
			if(vm.mScope.instituteType == 'College')
				getActiveDepartmentList();
			else
				getActiveStandard();
			initDataTable();
		};
		
		function initDataTable(){
			sectionService.initTable('sectionDataTable');
		}
		
		// Save and update section
		function saveOrUpdateSection(data) {
			data.sectionName = data.sectionName.toUpperCase();
			if(data.id)
				sectionService.updateSection(data, successCb, errorCb);
			else
				sectionService.saveSection(data, successCb, errorCb);
			function successCb(result) {
				initDataTable();
				$log.debug("SUCCESS saveOrUpdateSection:",result)
			}
			function errorCb(error) {
				$log.debug("FAILURE saveOrUpdateSection:",error)
			}
		};

		$scope.updateSection = function() {
			setTimeout(function(){ getValue(); }, 0);
		};

		function getValue() {
			var data ={};
			var table = $('#sectionDataTable').dataTable();
			$(".selected", table.fnGetNodes()).each(function() {
				data = table.fnGetData($(this).parents());
				$(this).removeClass('selected');
			});
			vm.initData = data;
			$scope.$broadcast('modelForm');
		}

		//Get active department list if institute type as college
		function getActiveDepartmentList() {
        	departmentService.getActiveDepartment(successCb, errorCb);
        	function successCb(result) {
        		vm.mScope.departmentList = result.entityList;
        		$log.debug("SUCCESS getActiveDepartmentList",result);
        	}
        	function errorCb(error) {
        		$log.debug("FAILURE getActiveDepartmentList:",error)
        	}
        };

		// Get active standard list if institute type as school
		function getActiveStandard() {
			standardService.getActiveStandard(successCb, errorCb);
			function successCb(result) {
				vm.mScope.yearAndStandardList = result.entityList;
				$log.debug("SUCCESS getActiveStandard",result);
			}
			function errorCb(error) {
				$log.debug("FAILURE getActiveStandard:",error)
			}
		};
		
		// Get active class year list by deparment id
		function getClassByDepartmentId(id) {
			standardService.getClassByDepartmentId({id}, successCb, errorCb);
			function successCb(result) {
				vm.mScope.yearAndStandardList = result.entityList;
				$log.debug("SUCCESS getClassByDepartmentId",result);
			}
			function errorCb(error) {
				$log.debug("FAILURE getClassByDepartmentId:",error)
			}
		};
	}
})();