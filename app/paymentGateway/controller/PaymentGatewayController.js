(function() {
	'use strict';
	/**
	 * @author Gunasekaran
	 */
	angular
	.module('cip.paymentGateway')
	.controller('PaymentGatewayController', PaymentGatewayController);

	PaymentGatewayController.$inject = ['$log', '$scope', '$mdDialog','PaymentGatewayService', 'InstituteService','$http','ngTableParams'];

	/* @ngInject */
	function PaymentGatewayController($log, $scope, $mdDialog, paymentGatewayService, instituteService,$http,ngTableParams) {
		var vm = this;

		vm.init 						= init;
		vm.mScope 						= {};
		vm.saveOrUpdatePaymentGateway   = saveOrUpdatePaymentGateway;
		vm.mScope.getInstituteList		= getInstituteList;
		vm.mScope.getInstitute			= getInstitute;

		function init() {
			getInstitute();
			paymentGatewayService.initTable('paymentGatewayDataTable');
		};

		function savePaymentGateway(form) {
			paymentGatewayService.savePaymentGateway(form, successCb, errorCb);
			function successCb(result) {
				init();
				$log.debug("SUCCESS savePaymentGateway:",result)
			}
			function errorCb(error) {
				$log.debug("FAILURE savePaymentGateway:",error)
			}
		}

		function updatePaymentGateway(form) {
		
			paymentGatewayService.updatePaymentGateway(form, successCb, errorCb);
			function successCb(result) {
				init();
				$log.debug("SUCCESS updatePaymentGateway:",result)
			}
			function errorCb(error) {
				$log.debug("FAILURE updatePaymentGateway:",error)
			}
		}

		function saveOrUpdatePaymentGateway(form) {

			if(form.id) {
				updatePaymentGateway(form);
			}else{
				savePaymentGateway(form);
			}

		}
		
		$scope.updateOrDeletePaymentGateway = function(type) {
			setTimeout(function(){ getValue(type); }, 0);
		};
		
		//Delete academic
		vm.deletePaymentGateway = function(data) {
			var confirm = $mdDialog.confirm()
			.title('Are you sure want to delete?')
			.textContent('You will not be able to recover information!')
			.ok('yes, Please it!')
			.cancel('Cancel');

			$mdDialog.show(confirm).then(function() {
				paymentGatewayService.deletePaymentGateway(data, successCb, errorCb);
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
			var table = $('#paymentGatewayDataTable').dataTable();
			$(".selected", table.fnGetNodes()).each(function() {
				data = table.fnGetData($(this).parents())
				$(this).removeClass('selected');
			});
			if(type == "update") {
				vm.initData = data;
				$scope.$broadcast('modelForm');
			}
			else
				vm.deletePaymentGateway(data);
		};
		
		function getInstituteList(searchText) {
			instituteService.getInstituteListByInstituteName({searchValue : searchText}, successCb, errorCb);
			function successCb(result) {
				vm.mScope.instituteList = result.entityList;
				$log.debug("SUCCESS getInstituteList:",result)
			}
			function errorCb(error) {
				$log.debug("FAILURE getInstituteList:",error)
			}
		}

		function getInstitute() {
			instituteService.getInstituteList(successCb, errorCb);
			function successCb(result) {
				vm.mScope.instituteList = result.entityList;
				$log.debug("SUCCESS getInstituteList:",result)
			}
			function errorCb(error) {
				$log.debug("FAILURE getInstituteList:",error)
			}
		}

	}
	
})();