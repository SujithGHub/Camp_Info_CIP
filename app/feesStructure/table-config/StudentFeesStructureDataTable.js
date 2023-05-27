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
			'fees_name': {
				column: {
					sTitle: 'Fees Name',
					name: 'name',
				},
				columnDef: {
					mDataProp:'name'
				}
			},
			'amount': {
				column: {
					sTitle: 'amount',
					name: 'fee',
				},
				columnDef: {
					mDataProp:'fee'
				}
			},
			'last_date': {
				column: {
					sTitle: 'last date',
					name: 'lastDate',
				},
				columnDef: {
					mDataProp:'lastDate'
				}
			},
			'pay' : {
				column: {
					sTitle: 'pay',
				},
				columnDef: {
					render: function(data, type, row, meta) {
						return  "<button class='btn bgm-teal btn-xs'  onclick=\"angular.element(this).scope().payFees('view');$(this).addClass('selected')\"> <i class='fa fa-money'></i> </button>";
					}
				}
			}
		}; 
	};
	var headers = {
			's_no':['ROLE_USER'],
			'fees_name':['ROLE_USER'],
			'amount':['ROLE_USER'],
			'last_date':['ROLE_USER'],
			'pay':['ROLE_USER']
	};

	/**
	 * @name StudentFeesStructureTable
	 * @module homeWork
	 * @author Ashokrajan
	 * @copyright
	 */
	angular
	.module('cip.feesStructure')
	.value('StudentFeesStructureTable', {headers: headers, headersDef: headersDef});
}());