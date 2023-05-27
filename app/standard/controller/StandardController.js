(function() {
	'use strict';
	/**
	 * @author Ashokrajan
	 */
	angular
	.module('cip.standard')
	.controller('StandardController', StandardController);

	StandardController.$inject = ['$log', 'DepartmentService', 'StandardService', 'SharedService', '$scope', '$mdDialog'];

	/* @ngInject */
	function StandardController($log, departmentService, standardService, sharedService, $scope, $mdDialog) {
		var vm = this;

		vm.init = init;
		vm.mScope = {};
		vm.initDataTable = initDataTable;
		
		function init() {
			vm.mScope.instituteType = sharedService.institute.instituteType;
			if(vm.mScope.instituteType == 'College') {
				getDepartmentList();
				getClassYearList();
			}
			initDataTable();
		};
		
		function initDataTable() {
			standardService.initTable('standardDataTable');
		};
		
		// Save and update standard
		vm.saveOrUpdateStandard = function(data) {
			if(data.id)
				standardService.updateStandard(data, successCb, errorCb);
			else
				standardService.saveStandard(data, successCb, errorCb);
			function successCb(result) {
				initDataTable();
				$log.debug("SUCCESS saveOrUpdateStandard:",result)
			}
			function errorCb(error) {
				$log.debug("FAILURE saveOrUpdateStandard:",error)
			}
		};

		$scope.updateStandard = function() {
			setTimeout(function(){ getValue(); }, 0);
		};

		function getValue() {
			var data ={};
			var table = $('#standardDataTable').dataTable();
			$(".selected", table.fnGetNodes()).each(function() {
				data = table.fnGetData($(this).parents());
				$(this).removeClass('selected');
			});
			vm.initData = data;
			$scope.$broadcast('modelForm');
		}

		//Get department list if institute type as college
		function getDepartmentList() {
			departmentService.getActiveDepartment(successCb, errorCb);
			function successCb(result) {
				vm.mScope.departmentList = result.entityList;
				$log.debug("SUCCESS getDepartmentActive",result);
			}
			function errorCb(error) {
				$log.debug("FAILURE getDepartmentActive:",error)
			}
		}
		
		//Get classYear list if institute type as college
		function getClassYearList() {
			standardService.getClassYearByConstant(successCb, errorCb);
			function successCb(result) {
				vm.mScope.classYearList = result;
				$log.debug("SUCCESS classYear",result);
			}
			function errorCb(error) {
				$log.debug("FAILURE classYear:",error)
			}
		};
	}
})();