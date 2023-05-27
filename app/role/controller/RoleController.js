(function() {
	'use strict';
	/**
	 * @author 
	 */
	angular
	.module('cip.role')
	.controller('RoleController', RoleController);

	RoleController.$inject = ['$log', 'RoleService', 'CommonService', '$scope', '$mdDialog','$http'];

	/* @ngInject */
	function RoleController($log, roleService, commonService, $scope, $mdDialog,$http) {
		var vm = this;
		vm.init 				= init;
		vm.saveOrUpdateRole		= saveOrUpdateRole;
		vm.mScope 				= {};
		
		function init() {
			roleService.initTable('roleDataTable', {});
		};
		
/*		$scope.featureList = []; 
		$http.get('/feature')
		.success(function (data, status, headers, config) {
			$scope.featureList = data;
		});*/
		
		function saveOrUpdateRole(formData) {
			console.log(formData)
			/*$http.post('/role', formData)
			.success(function (data, status, headers, config) {
				
			});*/
		}
		
		$scope.updateRole = function(type) {
			setTimeout(function(){ getValue(type); }, 0);
		};

		function getValue(type) {
			var data ={};
			var table = $('#roleDataTable').dataTable();
			$(".selected", table.fnGetNodes()).each(function() {
				data = table.fnGetData($(this).parents())
				$(this).removeClass('selected');
			});

			vm.initData = data;
			$scope.$broadcast('modelForm');

		};
		
	}
})();