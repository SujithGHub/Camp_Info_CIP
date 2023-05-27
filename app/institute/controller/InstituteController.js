(function() {
	'use strict';
	/**
	 * @author Ashokrajan
	 */
	angular
	.module('cip.institute')
	.controller('InstituteController', InstituteController);

	InstituteController.$inject = ['$log', 'InstituteService', '$scope', '$mdDialog'];

	/* @ngInject */
	function InstituteController($log, instituteService, $scope, $mdDialog) {
		var vm = this;

		vm.init = init;
		vm.mScope = {};
		vm.saveOrUpdateInstitute = saveOrUpdateInstitute;

		function init() {
			setTimeout(function(){instituteService.initTable('instituteDataTable');},100)
		};

		// Save and update institute
		function saveOrUpdateInstitute(formData) {
			formData.prefix = formData.prefix.toUpperCase();
			formData.hoursCount = parseInt(formData.hoursCount)
			if(formData.id)
				instituteService.updateInstitute(formData, successCb, errorCb);
			else
				instituteService.saveInstitute(formData, successCb, errorCb);
			function successCb(result) {
				init();
				$log.debug("SUCCESS saveOrUpdateInstitute:",result)
			}
			function errorCb(error) {
				$log.debug("FAILURE saveOrUpdateInstitute:",error)
			}
		};
		
		$scope.updateOrDeleteInstitute = function(type) {
			setTimeout(function(){ getValue(type); }, 0);
		};
		
		//Delete academic
		vm.deleteInstitute = function(data) {
			var confirm = $mdDialog.confirm()
			.title('Are you sure want to delete?')
			.textContent('You will not be able to recover information!')
			.ok('yes, Please it!')
			.cancel('Cancel');

			$mdDialog.show(confirm).then(function() {
				instituteService.deleteInstitute(data, successCb, errorCb);
				function successCb(result) {
					init();
					$log.debug("SUCCESS deleteInstitute:",result)
				}
				function errorCb(error ){
					$log.debug("FAILURE deleteInstitute:",error)
				}
			});
		};

		//Get edit and delete data from datatable
		function getValue(type) {
			var data ={};
			var table = $('#instituteDataTable').dataTable();
			$(".selected", table.fnGetNodes()).each(function() {
				data = table.fnGetData($(this).parents())
				$(this).removeClass('selected');
			});
			if(type == "update") {
				vm.initData = data;
			
				$scope.$broadcast('modelForm');
			}
			else
				vm.deleteInstitute(data);
		};
	}
})();