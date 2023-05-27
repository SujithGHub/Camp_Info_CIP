(function() {
	'use strict';
	/**
	 * @author Gowthaman
	 */
	angular
	.module('cip.academic')
	.controller('AcademicController', AcademicController);

	AcademicController.$inject = ['$log', 'AcademicService', 'CommonService', '$scope', '$mdDialog'];

	/* @ngInject */
	function AcademicController($log, academicService, commonService, $scope, $mdDialog) {
		var vm = this;

		vm.init 				= init;
		vm.mScope 				= {};
		vm.saveOrUpdateAcademic = saveOrUpdateAcademic;
		vm.mScope.checkAcademic = checkAcademic;

		function init() {
			academicService.initTable('academicDataTable');
		};

		// Save and update academic
		function saveOrUpdateAcademic(formData) {
			formData.fromDate = commonService.convertDateFormat(formData.fromDate);
			formData.toDate = commonService.convertDateFormat(formData.toDate);
			if(formData.id) {
				academicService.updateAcademic(formData, successCb, errorCb);
			} else {
				academicService.saveAcademic(formData, successCb, errorCb);
			}
			function successCb(result) {
				init();
			}
			function errorCb(error) {
				$log.debug("FAILURE saveOrUpdateAcademic:",error)
			}
		};

		$scope.updateOrDeleteAcademic = function(type) {
			setTimeout(function(){ getValue(type); }, 0);
		};

		function checkAcademic(fromDate, toDate) {
			
			var fromDate = new Date(fromDate);
			var toDate = new Date(toDate);
			var diff_date =  toDate - fromDate;

			var num_years = diff_date/31536000000;
			var num_months = (diff_date % 31536000000)/2628000000;
			var num_days = ((diff_date % 31536000000) % 2628000000)/86400000;
			if(num_years<1 && num_months>8){
				vm.mScope.isValid  = false;
			}else{
				vm.mScope.isValid  = true;
			}
		}

		//Get edit and delete data from datatable
		function getValue(type) {
			var data ={};
			var table = $('#academicDataTable').dataTable();
			$(".selected", table.fnGetNodes()).each(function() {
				data = table.fnGetData($(this).parents())
				$(this).removeClass('selected');
			});
			data.fromDate	=	commonService.convertDatePickerFormat(data.fromDate);
			data.toDate		=	commonService.convertDatePickerFormat(data.toDate);
			vm.initData = data;
			commonService.triggerModelForm();
		};
	}
})();