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
			'invoice_no': {
				column: {
					sTitle: 'invoice no',
					name: 'invoice_no',
				},
				columnDef: {
					mDataProp:'receiptNo'
				}
			},
			'roll_no': {
				column: {
					
					sTitle: 'roll no',
					name: 'roll_no',
				},
				columnDef: {
					mDataProp:'student.rollNumber'
				}
			},
			'paidfor': {
				column: {
					sTitle: 'paid for',
					name: 'paidfor',
				},
				columnDef: {
					mDataProp:'productinfo'
				}
			},
			'amount': {
				column: {
					sTitle: 'amount',
					name: 'name',
				},
				columnDef: {
					mDataProp:'amount'
				}
			},
			'date': {
				column: {
					sTitle: 'date',
					name: 'date',
				},
				columnDef: {
					mDataProp:'paymentDate'
				}
			},
			'transaction_status': {
				column: {
					sTitle: 'transaction status',
				},
				columnDef: {
					mDataProp: 'status'
				}
			},
			'view': {
				column: {
					sTitle: 'view',
				},
				columnDef: {
					render:function(data, type, row, meta) {
						return  "<button class='btn bgm-teal btn-xs' onclick=\"angular.element(this).scope().viewReceipt();$(this).addClass('selected')\"> <i class='zmdi zmdi-eye zmdi-hc-fw'></i> </button>";
					}
				}
			},
		};
	};
	var headers = {'s_no' :['ROLE_USER', 'ROLE_ADMIN'],
			'invoice_no':['ROLE_ADMIN', 'ROLE_USER'], 
			'roll_no':['ROLE_ADMIN', 'ROLE_USER'],
			'paidfor':['ROLE_ADMIN', 'ROLE_USER'],
			'amount':['ROLE_ADMIN', 'ROLE_USER'],
			'date':['ROLE_ADMIN', 'ROLE_USER'],
			'transaction_status':['ROLE_USER', 'ROLE_ADMIN'],
			'view':['ROLE_USER']}

	var PaymentByFilterTable = {
			headers: headers,
			headersDef: headersDef,
			config: function(commonService, url,formData) {
				return {
					sScrollY: '500px',
					iDisplayLength: 10,
					order: [],
					fnServerData: function(sSource, aoData, fnCallback, oSettings) {
						var start=oSettings._iDisplayStart;
						var limit=commonService.startParams();
						oSettings.jqXHR = $.ajax({
							type: 'get',
							url: url+'?start='+start+'&limit='+limit+'&fromDate='+formData.fromDate+'&toDate='+formData.toDate+'&departmentId='+formData.department+'&classYearId='+formData.classYear+'&searchValue='+commonService.filterParams('search', aoData).value || '',
							beforeSend: function(request) {
								request.setRequestHeader("Authorization", "Bearer" + localStorage.getItem('jwt-token'));
							},
							success: function(json) {
								var data = {};
								data.sEcho = commonService.filterParams('sEcho', aoData)? commonService.filterParams('sEcho', aoData).value : 0 ;
								data.iTotalDisplayRecords = json.totalCount; //Display Total Records
								data.iTotalRecords = json.entityList.length || 0;
								data.aaData = json.entityList;
								fnCallback(data);
							},
							error: function(e) {
								fnCallback({ aaData: [] });
							}
						});
					},
				};
			}
	};

	/**
	 * @name PaymentByFilterTable
	 * @module payment
	 * @description
	 *
	 *
	 * @author Gunasekaran jayaraj
	 * @copyright
	 */
	angular
	.module('cip.payment')
	.value('PaymentByFilterTable', PaymentByFilterTable);
}());