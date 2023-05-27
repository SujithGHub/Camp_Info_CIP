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
			'driver_name': {
				column: {
					sTitle: 'Driver Name',
					name: 'driverName',
				},
				columnDef: {
					mDataProp:'driverName',
				}
			},
			'bus_number': {
				column: {
					sTitle: 'Bus Number',
					name: 'busNumber',
				},
				columnDef: {
					mDataProp:'busNumber',
				}
			},
			'registration_number': {
				column: {
					sTitle: 'Registration Number',
					name: 'registrationNumber',
				},
				columnDef: {
					mDataProp:'registrationNumber',
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
						return "<button class='btn bgm-teal btn-xs' onclick=\"angular.element(this).scope().updateVehicle('update');$(this).addClass('selected')\"> <i class='zmdi zmdi-edit zmdi-hc-fw'></i> </button>" +
						"  <button class='btn btn-xs' style='background-color: deepskyblue' onclick=\"angular.element(this).scope().updateVehicle('upload');$(this).addClass('selected')\"> <i class='zmdi zmdi-upload zmdi-hc-fw'></i> </button>"+
						"  <button onclick=\"angular.element(this).scope().updateVehicle('delete');$(this).addClass('selected')\" class='btn btn-primary btn-xs btn-delete'><i class='zmdi zmdi-delete zmdi-hc-fw' style='color: #fff;'></i></button>";
					}
				}
			},
		};
	};
	var headers = [ 
	               's_no',
	               'bus_number',
	               'registration_number',
	               'driver_name',
	               'status',
	               'action'
	               ];

	/**
	 * @name VehicleTable
	 * @module vehicle
	 * @description
	 *
	 *
	 * @author Gunasekaran Jayaraj
	 * @copyright
	 */
	angular
	.module('cip.vehicle')
	.value('VehicleTable', { headers: headers, headersDef: headersDef});
}());