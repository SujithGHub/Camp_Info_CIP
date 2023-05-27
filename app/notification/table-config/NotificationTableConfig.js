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
             'posted_date': {
				column: {
					sTitle: 'posted date',
					name: 'postedDate',
				},
				columnDef: {
					mDataProp:'createdDate'
				}
			},
			'title': {
				column: {
					sTitle: 'title',
					name: 'title',
				},
				columnDef: {
					mDataProp:'title'
				}
			},
			'description': {
				column: {
					sTitle: 'description',
					name: 'description',
				},
				columnDef: {
					mDataProp:'description',
					render: function(data, type, row, meta){
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
						return "<button onclick=\"angular.element(this).scope().updateOrDeleteNotification('view');$(this).addClass('selected')\" class='btn bgm-teal btn-xs'><i class='zmdi zmdi-eye zmdi-hc-fw'></i></button>";
					}
				}
			},
			'action': {
				column: {
					sTitle: 'Action',
					width:'12%'
				},
				columnDef: {
					width:'12%',
					render: function(data, type, row, meta) {
						return  "<button onclick=\"angular.element(this).scope().updateOrDeleteNotification('view');$(this).addClass('selected')\" class='btn bgm-teal btn-xs'><i class='zmdi zmdi-eye zmdi-hc-fw'></i></button> <button onclick=\"angular.element(this).scope().updateOrDeleteNotification('delete');$(this).addClass('selected')\" class='btn btn-primary btn-xs btn-delete'><i class='zmdi zmdi-delete zmdi-hc-fw' style='color: #fff;'></i></button>";
					}
				}
			},
		};
	};
	var headers = {'s_no':['ROLE_USER','ROLE_ADMIN', 'ROLE_STAFF', 'ROLE_STAFF_HOD'],
	               'posted_date':['ROLE_USER','ROLE_ADMIN', 'ROLE_STAFF', 'ROLE_STAFF_HOD'],
	               'title':['ROLE_USER','ROLE_ADMIN', 'ROLE_STAFF', 'ROLE_STAFF_HOD'],
	               'description':['ROLE_USER','ROLE_ADMIN', 'ROLE_STAFF', 'ROLE_STAFF_HOD'],
	               'view':['ROLE_USER', 'ROLE_STAFF', 'ROLE_STAFF_HOD'],
	               'action':['ROLE_ADMIN']
	};

	/**
	 * @name NotificationTable
	 * @module notification
	 * @description
	 *
	 * @author Ashok
	 * @copyright
	 */
	angular
	.module('cip.notification')
	.value('NotificationTable', {headers: headers, headersDef: headersDef});
}());