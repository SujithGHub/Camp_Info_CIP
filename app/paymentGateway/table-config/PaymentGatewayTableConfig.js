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
			'institute': {
				column: {
					sTitle: 'institute',
					name: 'institute',
				},
				columnDef: {
					render: function(data, type, row, meta) {
						return row.institute.instituteName;
					}
				}
			},
			'payment_gateway': {
				column: {
					sTitle: 'Payment Gateway',
					name: 'paymentGateway',
				},
				columnDef: {
					mDataProp:'paymentGateway'
				}
			},
			'payment_gateway_key': {
				column: {
					sTitle: 'Payment Gateway Key',
					name: 'merchantKey',
				},
				columnDef: {
					mDataProp:'merchantKey'
				}
			},
			'payment_gateway_salt': {
				column: {
					sTitle: 'Payment Gateway Salt',
					name: 'merchantSalt',
				},
				columnDef: {
					mDataProp:'merchantSalt'
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
						return  "<button class='btn bgm-teal btn-xs' onclick=\"angular.element(this).scope().updateOrDeletePaymentGateway('update');$(this).addClass('selected')\"> <i class='zmdi zmdi-edit zmdi-hc-fw'></i> </button>  <button onclick=\"angular.element(this).scope().updateOrDeletePaymentGateway('delete');$(this).addClass('selected')\" class='btn btn-primary btn-xs btn-delete'><i class='zmdi zmdi-delete zmdi-hc-fw' style='color: #fff;'></i></button>";
					}
				}
			},
		};
	};
	var headers = [
	               's_no',
	               'payment_gateway',
	               'payment_gateway_key',
	               'payment_gateway_salt',
	               'status',
	               'action'
	               ];
	/**
	 * @name PaymentGatewayTable
	 * @module Payment Gateway
	 * @author Gunasekaran
	 * @copyright
	 */
	angular
	.module('cip.paymentGateway')
	.value('PaymentGatewayTable', {headers: headers, headersDef: headersDef});
}());