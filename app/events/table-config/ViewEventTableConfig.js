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
			'description': {
				column: {
					sTitle: 'description',
					name: 'description',
				},
				columnDef: {
					mDataProp:'description',
						render: function (data, type, row, meta){
							return row.description.length>50 ? row.description.substr(0,50-1)+'...' : row.description;
						}
				}
			},
			'view': {
				column: {
					sTitle: 'view',
				},
				columnDef: {
					render: function(data, type, row, meta) {
						return "<button onclick=\"angular.element(this).scope().updateOrDeleteEvent('view', '#viewEventDataTable');$(this).addClass('selected')\" class='btn bgm-teal btn-xs'><i class='zmdi zmdi-eye zmdi-hc-fw'></i></button>";
					}
				}
			}
		};
	};
	var headers = [
			's_no',
			'date',
			'event',      
			'description',
			'view',
	];

	/**
	 * @name ViewEventTable
	 * @module events
	 * @author Ashokrajan
	 * @copyright
	 */
	angular
	.module('cip.events')
	.value('ViewEventTable', {headers: headers, headersDef: headersDef});
}());