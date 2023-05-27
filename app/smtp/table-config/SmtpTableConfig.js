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
			'smtp_username': {
				column: {
					sTitle: 'user name',
					name: 'smtpUserName',
				},
				columnDef: {
					mDataProp:'smtpUserName'
				}
			},
			'smtp_servername': {
				column: {
					sTitle: 'server name',
					name: 'smtpServerName',
				},
				columnDef: {
					mDataProp:'smtpServerName'
				}
			},
			'smtp_portnumber': {
				column: {
					sTitle: 'port number',
					name: 'smtpPortNumber',
				},
				columnDef: {
					mDataProp:'smtpPortNumber'
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
						return  "<button class='btn bgm-teal btn-xs' onclick=\"angular.element(this).scope().updateOrDeleteSmtp('update');$(this).addClass('selected')\"> <i class='zmdi zmdi-edit zmdi-hc-fw'></i> </button>  <button onclick=\"angular.element(this).scope().updateOrDeleteSmtp('delete');$(this).addClass('selected')\" class='btn btn-primary btn-xs btn-delete'><i class='zmdi zmdi-delete zmdi-hc-fw' style='color: #fff;'></i></button>";
					}
				}
			},
		};
	};
	var headers = [
	               's_no',
	               'institute',
	               'smtp_username',
	               'smtp_servername',
	               'smtp_portnumber',
	               'status',
	               'action'
	               ];
	/**
	 * @name SmtpTable
	 * @module smtp
	 * @description
	 *
	 *
	 * @author Gunasekaran
	 * @copyright
	 */
	angular
	.module('cip.smtp')
	.value('SmtpTable', {headers: headers, headersDef: headersDef});
}());