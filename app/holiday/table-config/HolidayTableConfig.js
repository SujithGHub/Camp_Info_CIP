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
             'holiday_name': {
				column: {
					sTitle: 'Holiday name',
					name: 'holidayName',
				},
				columnDef: {
					mDataProp:'holidayName',
					render: function (data, type, row, meta){
						return row.holidayName.length>10 ? row.holidayName.substr(0,10-1)+'...' : row.holidayName;
					}
				}
			},
			'from_date': {
				column: {
					sTitle: 'From date',
					name: 'fromDate',
				},
				columnDef: {
					mDataProp:'fromDate'
				}
			},
			'to_date': {
				column: {
					sTitle: 'To date',
					name: 'toDate',
				},
				columnDef: {
					mDataProp:'toDate'
				}
			},
			'description': {
				column: {
					sTitle: 'Description',
					name: 'description',
				},
				columnDef: {
					mDataProp:'description',
					render: function (data, type, row, meta){
						return row.description.length>10 ? row.description.substr(0,10-1)+'...' : row.description;
					}
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
						return "<button class='btn bgm-teal btn-xs' onclick=\"angular.element(this).scope().updateOrDeleteHoliday('update');$(this).addClass('selected')\"> <i class='zmdi zmdi-edit zmdi-hc-fw'></i> </button>&nbsp"+
						"<button onclick=\"angular.element(this).scope().updateOrDeleteHoliday('delete');$(this).addClass('selected')\" class='btn btn-primary btn-xs btn-delete'><i class='zmdi zmdi-delete zmdi-hc-fw' style='color: #fff;'></i></button>";
					}
				}
			},
		};
	};
	var headers = [
	               's_no',
	               'holiday_name',  
	               'from_date',
	               'to_date',
	               'description',
	               'status',
	               'action'
	               ];

	/**
	 * @name HolidayTable
	 * @module holiday
	 * @author Ashokrajan
	 * @copyright
	 */
	angular
	.module('cip.holiday')
	.value('HolidayTable', {headers: headers, headersDef: headersDef});
}());