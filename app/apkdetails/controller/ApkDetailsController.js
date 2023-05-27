(function() {
	'use strict';
	/**
	 * @author Krishna
	 */
	angular
	.module('cip.apkDetails')
	.controller('ApkDetailsController', ApkDetailsController);

	ApkDetailsController.$inject = ['$log', '$scope', '$mdDialog','ApkDetailsService','$http','ngTableParams'];

	/* @ngInject */
	function ApkDetailsController($log, $scope, $mdDialog, apkDetailsService,$http,ngTableParams) {
		var vm = this;

		vm.init 						= init;
		vm.mScope 						= {};
		vm.saveOrUpdateApkDetails		= saveOrUpdateApkDetails;
		function init() {
			apkDetailsService.initTable('ApkDetailsDataTable');
		};

		function saveApkDetails(form) {
			apkDetailsService.saveApkDetails(form, successCb, errorCb);
			function successCb(result) {
				init();
			}
			function errorCb(error) {
				$log.debug("FAILURE saveApkDetails:",error)
			}
		}

		function updateApkDetails(form) {
		
			apkDetailsService.updateApkDetails(form, successCb, errorCb);
			function successCb(result) {
				init();
			}
			function errorCb(error) {
				$log.debug("FAILURE updateApkDetails:",error)
			}
		}

		function saveOrUpdateApkDetails(form) {

			if(form.id) {
				updateApkDetails(form);
			}else{
				saveApkDetails(form);
			}

		}
		
		$scope.updateOrDeleteApkDetails = function(type) {
			setTimeout(function(){ getValue(type); }, 0);
		};
		
		//Delete Apk details
		vm.deleteApkDetails = function(data) {
			var confirm = $mdDialog.confirm()
			.title('Are you sure want to delete?')
			.textContent('You will not be able to recover information!')
			.ok('yes, Please it!')
			.cancel('Cancel');

			$mdDialog.show(confirm).then(function() {
				apkDetailsService.deleteApkDetails(data, successCb, errorCb);
				function successCb(result) {
					init();
					$log.debug("SUCCESS deleteApkDetails:",result)
				}
				function errorCb(error ){
					$log.debug("FAILURE deleteApkDetails:",error)
				}
			});
		};

		//Get edit and delete data from datatable
		function getValue(type) {
			var data ={};
			var table = $('#ApkDetailsDataTable').dataTable();
			$(".selected", table.fnGetNodes()).each(function() {
				data = table.fnGetData($(this).parents())
				$(this).removeClass('selected');
			});
			if(type == "update") {
				vm.initData = data;
				$scope.$broadcast('modelForm');
			}
			else
				vm.deleteApkDetails(data);
		};
	}
	
})();