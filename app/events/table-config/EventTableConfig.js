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
			'date': {
				column: {
					sTitle: 'date',
					name: 'date',
				},
				columnDef: {
					mDataProp:'eventDate'
				}
			},
			'event': {
				column: {
					sTitle: 'event',
					name: 'event',
				},
				columnDef: {
					mDataProp:'name'
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
						return  "<button class='btn bgm-teal btn-xs' onclick=\"angular.element(this).scope().updateOrDeleteEvent('update', '#eventDataTable');$(this).addClass('selected')\"> <i class='zmdi zmdi-edit zmdi-hc-fw'></i> </button>  <button onclick=\"angular.element(this).scope().updateOrDeleteEvent('delete', '#eventDataTable');$(this).addClass('selected')\" class='btn btn-primary btn-xs btn-delete'><i class='zmdi zmdi-delete zmdi-hc-fw' style='color: #fff;'></i></button>";
					}
				}
			},
		};
	};
	var headers =[
			's_no',
			'date',
			'event',      
			'status',
			'action',
	];
	
	/**
	 * @name EventTable
	 * @module events
	 * @author Ashok
	 * @copyright
	 */
	angular
	.module('cip.events')
	.value('EventTable', {headers: headers, headersDef: headersDef});
}());