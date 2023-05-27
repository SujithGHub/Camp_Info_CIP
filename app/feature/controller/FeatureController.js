(function() {
	'use strict';
	/**
	 * @author Deepa
	 */
	angular
	.module('cip.feature')
	.controller('FeatureController', FeatureController);

	FeatureController.$inject = ['$log', '$http', 'FeatureService', '$mdDialog', '$scope','ngTableParams','CommonService'];

	/* @ngInject */
	function FeatureController($log, $http, featureService, $mdDialog, $scope,ngTableParams,commonService) {
		
		var vm = this;

		vm.init = init;
		vm.mScope = {};
		
		function init() {
			getFeatures();
			getRoles();
			featureService.initTable('featureDataTable');
		};
		
		 $scope.updateFeature = function(type) {
				setTimeout(function(){ getValue(type); }, 0);
		};
			
			//Get edit and delete data from datatable
			function getValue(type) {
				var data ={};
				var table = $('#featureDataTable').dataTable();
				$(".selected", table.fnGetNodes()).each(function() {
					data = table.fnGetData($(this).parents())
					$(this).removeClass('selected');
				});
				vm.initData = data;
				if(type == "update") {
					vm.showAdvanced(event, data);
				}
			};
		
		function getFeatures() {
			featureService.getFeatures({}, successCb, errorCb);
			function successCb(result) {

				for(var i=0;i<result.length;i++) {
					if(result[i].id == 12  ) {
						result.splice(i,3);
					}
				}

				vm.featureList =  result;
				$log.debug("SUCCESS getFeatureList:",result)
			}
			function errorCb(error) {
				$log.debug("FAILURE getFeatureList:",error)
			}
		}

		function getRoles() {
			featureService.getRoles({}, successCb, errorCb);
			function successCb(result) {
				for(var i=0;i<result.length;i++) {
					if(result[i].name == 'ROLE_SUPER_ADMIN') {
						result.splice(i,1);
					}
				}
				vm.roleList =  result;
				$log.debug("SUCCESS getRoleList:",result)
			}
			function errorCb(error) {
				$log.debug("FAILURE getRoleList:",error)
			}
		}
		
		vm.getFeaturesByRole = function(role,id) {

			var tenantId = id;
			var roleId = role.id;
			featureService.getFeaturesByRole({tenantId, roleId}, successCb, errorCb)
			function successCb(result) {
				vm.form.features = result.entity;
				$log.debug("SUCCESS getFeaturesByRole:",result)
			}
			function errorCb(error){
				$log.debug("FAILURE getFeaturesByRole:",error)
			}
		}
		
		vm.showAdvanced = function(ev, formData) {

			var tenantId = formData.id;
			formData = {};
			formData.id = tenantId;
			formData.featureList = vm.featureList;
			formData.roleList = vm.roleList;
			formData.role = vm.roleList[0];
			var roleId = vm.roleList[0].id;

			featureService.getFeaturesByRole({tenantId, roleId}, successCb, errorCb)
			function successCb(result) {
				formData.features = result.entity;
				$log.debug("SUCCESS getFeaturesByRole:",result)
			}
			function errorCb(error){
				$log.debug("FAILURE getFeaturesByRole:",error)
			}


			$mdDialog.show({
				controller: FeatureController,
				controllerAs: 'featureCtrl',
				templateUrl: '/app/feature/views/create.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				bindToController: true,
				locals: {
					form: formData
				},
				scope: $scope.$new(),
				clickOutsideToClose:false
			})
		};

		vm.cancel = function() {
			$mdDialog.cancel();
		};
		
		vm.saveOrUpdateFeature = function(form) {
			var roleFeatures = [];

			for(var i=0;i<form.features.length;i++) {
				
				var roleFeature = {};
				roleFeature.role = form.role;
				roleFeature.tenantId = form.id;
				roleFeature.features = form.features[i];
				roleFeatures.push(roleFeature);
			}

			$http.post( commonService.baseApi+'/rolefeature/save', roleFeatures)
			.success(function (data) {
				vm.cancel();
			});
		}
		
	}
})();