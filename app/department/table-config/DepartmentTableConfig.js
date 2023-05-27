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
			'department': {
				column: {
					sTitle: 'Department',
					name: 'name',
				},
				columnDef: {
					mDataProp:'name',
				}
			},
			'display_name': {
				column: {
					sTitle: 'Display Name',
					name: 'displayName',
				},
				columnDef: {
					mDataProp:'displayName',
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
					render: function(data, type, row, meta) {
						return "<button class='btn bgm-teal btn-xs' onclick=\"angular.element(this).scope().updateDepartment();$(this).addClass('selected')\"> <i class='zmdi zmdi-edit zmdi-hc-fw'></i> </button>";
					}
				}
			},
		};
	};
	var headers = [ 
	               's_no',
	               'department',         
	               'display_name',
	               'status',
	               'action'
	               ];

	/**
	 * @name DepartmentTable
	 * @module department
	 * @author Ashokrajan
	 * @copyright
	 */
	angular
	.module('cip.department')
	.value('DepartmentTable', {headers: headers, headersDef: headersDef});
}());