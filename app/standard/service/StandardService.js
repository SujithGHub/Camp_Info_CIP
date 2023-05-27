(function() {
	'use strict';

	/**
	 * @ngdoc Service
	 * @name StandardService
	 * @module cip.standard
	 * @require $log,
	 * @description
	 *
	 * StandardService
	 *
	 * @author
	 * @copyright
	 */

	angular
	.module('cip.standard')
	.service('StandardService', StandardService);

	StandardService.$inject = [
	                           '$log',
	                           'StandardFactory',
	                           'CommonService',
	                           'StandardTable'
	                           ];

	function StandardService($log, standardFactory,commonService,standardTable) {

		this.saveStandard = function(params,successCb,errorCb){
			standardFactory.$save(params,successCb,errorCb);
		};
		this.updateStandard = function(params,successCb,errorCb){
			standardFactory.$update(params,successCb,errorCb);
		};
		this.getCommonStandard = function(params,successCb,errorCb){
			standardFactory.getCommonStandard(params,successCb,errorCb);
		};
		this.getActiveStandard = function(params,successCb,errorCb){
			standardFactory.getActiveStandard(params,successCb,errorCb);
		};
		this.getClassByDepartmentId = function(params,successCb,errorCb){
			standardFactory.getClassByDepartmentId(params,successCb,errorCb);
		};
		this.getClassYearByConstant = function(params,successCb,errorCb){
			standardFactory.getClassYearByConstant(params,successCb,errorCb);
		};
		this.getActiveStandardIsRestrict = function(params,successCb,errorCb){
			standardFactory.getActiveStandardIsRestrict(params,successCb,errorCb);
		};
		this.getClassYearByDepartmentIdIsRestrict = function(params,successCb,errorCb){
			standardFactory.getClassYearByDepartmentIdIsRestrict(params,successCb,errorCb);
		};
		this.getCorrespondingAndIsRestrictClassYears = function(params,successCb,errorCb){
			standardFactory.getCorrespondingAndIsRestrictClassYears(params,successCb,errorCb);
		};
        this.getClassYearByRole = function(successCb,errorCb){
            standardFactory.getClassYearByRole(successCb,errorCb);
        };
        this.getClassYearsByDepartmentAndStaff = function(params,successCb,errorCb){
            standardFactory.getClassYearsByDepartmentAndStaff(params,successCb,errorCb);
        };
        this.getClassYearByDepartmentAndRole = function(params,successCb,errorCb){
            standardFactory.getClassYearByDepartmentAndRole(params,successCb,errorCb);
        };
		this.initTable=function(tableElm) {
			commonService.setTableConfig(tableElm, standardTable, '/classyear', true);
		};
	}

}());
