(function() {
	'use strict';

	/**
	 * @ngdoc Service
	 * @name FeatureService
	 * @module cip.feature
	 * @require $log,
	 * @description
	 *
	 * FeatureService
	 *
	 * @author
	 * @copyright
	 */

	angular
	.module('cip.feature')
	.service('FeatureService', FeatureService);

	FeatureService.$inject = [
	                           '$log',
	                           'FeatureFactory',
	                           'FeatureTable',
	                           'CommonService',
	                           ];

	function FeatureService($log,featureFactory,featureTable, commonService) {

		this.getInstituteList = function(params,successCb,errorCb){
			featureFactory.getInstituteList(params,successCb,errorCb);
		};
		
		this.getRoles = function(params,successCb,errorCb){
			featureFactory.getRoles(params,successCb,errorCb);
		};
		
		this.getFeatures = function(params,successCb,errorCb){
			featureFactory.getFeatures(params,successCb,errorCb);
		};
		
		this.saveRoleFeatures = function(params,successCb,errorCb){
			featureFactory.saveRoleFeatures(params,successCb,errorCb);
		};
		
		this.getFeaturesByRole = function(params,successCb,errorCb){
			featureFactory.getFeaturesByRole(params,successCb,errorCb);
		};
		this.initTable=function(tableElm,paramObj) {
			commonService.setTableConfig(tableElm, featureTable, '/institute');
	  	}
	}

}());
