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
					name: 's_no'
				},
				columnDef: {
					render: function(data, type, row, meta) {
						return meta.row + meta.settings._iDisplayStart + 1;
					}
				}
			},
			'institute': {
				column: {
					sTitle: 'institute',
					name: 'institute'
				},
				columnDef: {
					render: function(data, type, row, meta) {
						return row.institute.instituteName;
					}
				}
			},
			'sms_gateway_api': {
				column: {
					sTitle: 'SMS Gateway Api',
					name: 'smsGatewayApi'
				},
				columnDef: {
					mDataProp:'smsGatewayApi'
				}
			},
			'status': {
				column: {
					sTitle: 'status',
					name: 'status'
				},
				columnDef: {
					mDataProp:'status'
				}
			},
			'action': {
				column: {
					sTitle: 'Action'
				},
				columnDef: {
					render:function(data, type, row, meta) {
						return  "<button class='btn bgm-teal btn-xs' onclick=\"angular.element(this).scope().updateOrDeleteSmsGateway('update');$(this).addClass('selected')\"> <i class='zmdi zmdi-edit zmdi-hc-fw'></i> </button>  <button onclick=\"angular.element(this).scope().updateOrDeleteSmsGateway('delete');$(this).addClass('selected')\" class='btn btn-primary btn-xs btn-delete'><i class='zmdi zmdi-delete zmdi-hc-fw' style='color: #fff;'></i></button>  "+
							"<button type='button' class='btn btn-default btn-info-light' onclick=\"angular.element(this).scope().updateOrDeleteSmsGateway('sms-report');$(this).addClass('selected')\" style='color: black; padding: 4px 8px; box-shadow: none;background-color: white'><i class='zmdi zmdi-trending-up'/></button>";
					}
				}
			}
		};
	};
	var headers = [
	               's_no',
	               'sms_gateway_api',
	               'status',
	               'action'
	               ];
	/**
	 * @name SmsGatewayTable
	 * @module SmsGateway
	 * @description
	 *
	 *
	 * @author Gunasekaran
	 * @copyright
	 */
	angular
	.module('cip.smsGateway')
	.value('SmsGatewayTable', {headers: headers, headersDef: headersDef});
}());