(function() {
	'use strict';
	/*global angular, $*/
	/**
	 * @private
	 * @name headersDef
	 * @description
	 * It has column definition of the each header in the accuracy module.
	 *
	 * @returns {Object} - Returns column configuration object
	 * associated with header name as key.
	 */

	var headersDef = function(obj) {
		return {
			's_no': {
				column: {
					sTitle: 's.no',
					name: 's_no',
				},
				columnDef: {
					render: function(data, type, row, meta) {
						return meta.row + meta.settings._iDisplayStart + 1;
					}
				}
			},
			'institute_name': {
				column: {
					sTitle: 'institute name',
					name: 'instituteName',
				},
				columnDef: {
					mDataProp:'instituteName'
				}
			},
			'contact_no': {
				column: {
					sTitle: 'contact no',
					name: 'contactNo',
				},
				columnDef: {
					mDataProp:'phoneNumber'
				}
			},
			'email': {
				column: {
					sTitle: 'email',
					name: 'email',
				},
				columnDef: {
					mDataProp:'emailId'
				}
			},
			'status': {
				column: {
					sTitle: 'status',
					name: 'status',
				},
				columnDef: {
					mDataProp:'status'
				}
			},

			'action': {
				column: {
					sTitle: 'Action',
				},
				columnDef: {
					render:function(data, type, row, meta) {
						return  "<button class='btn bgm-teal btn-xs' onclick=\"angular.element(this).scope().updateOrDeleteInstitute('update');$(this).addClass('selected')\"> <i class='zmdi zmdi-edit zmdi-hc-fw'></i> </button>  <button onclick=\"angular.element(this).scope().updateOrDeleteInstitute('delete');$(this).addClass('selected')\" class='btn btn-primary btn-xs btn-delete'><i class='zmdi zmdi-delete zmdi-hc-fw' style='color: #fff;'></i></button>";
					}
				}
			},
		};
	};
	var headers = [
	               's_no',
	               'institute_name',         
	               'contact_no',
	               'email',
	               'status',
	               'action'
	               ];
	
	/**
	 * @name InstituteTable
	 * @module Institute
	 * @author Ashokrajan
	 * @copyright
	 */
	angular
	.module('cip.institute')
	.value('InstituteTable', {headers: headers, headersDef: headersDef});
}());