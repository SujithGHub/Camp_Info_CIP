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
			'route_name': {
				column: {
					sTitle: 'Route Name',
					name: 'routeName',
				},
				columnDef: {
					mDataProp:'name',
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
						return "<button class='btn bgm-teal btn-xs' onclick=\"angular.element(this).scope().updateVehicleRoute('update');$(this).addClass('selected')\"> <i class='zmdi zmdi-edit zmdi-hc-fw'></i> </button>" +
						"  <button class='btn btn-xs' style='background-color: deepskyblue' onclick=\"angular.element(this).scope().updateVehicleRoute('upload');$(this).addClass('selected')\"> <i class='zmdi zmdi-bus zmdi-hc-fw'></i> </button>"+
						"  <button onclick=\"angular.element(this).scope().updateVehicleRoute('delete');$(this).addClass('selected')\" class='btn btn-primary btn-xs btn-delete'><i class='zmdi zmdi-delete zmdi-hc-fw' style='color: #fff;'></i></button>";
					}
				}
			},
		};
	};
	var headers = [ 
	               's_no',
	               'route_name',
	               'status',
	               'action'
	               ];

	/**
	 * @name VehicleRouteTable
	 * @module vehicle
	 * @description
	 *
	 * @author ashokrajan
	 * @copyright
	 */
	angular
	.module('cip.vehicle')
	.value('VehicleRouteTable', { headers: headers, headersDef: headersDef});
}());