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
             'category': {
				column: {
					sTitle: 'category',
					name: 'category',
				},
				columnDef: {
					mDataProp:'category',
				}
			},
			'title': {
				column: {
					sTitle: 'title',
					name: 'title',
				},
				columnDef: {
					mDataProp:'title',
					render: function (data, type, row, meta){
						return row.title.length>20 ? row.title.substr(0,20-1)+'...' : row.title;
					}
				}
			},
			'postedby': {
				column: {
					sTitle: 'posted by',
					name: 'postedby',
				},
				columnDef: {
						render: function (data, type, row, meta){
							if(row.user.staff) {
								return row.user.staff.firstName.length>10 ? row.user.staff.firstName.substr(0,10-1)+'...' : row.user.staff.firstName;
							}
							else if(row.user.Student) {
								return row.user.Student.firstName.length>10 ? row.user.Student.firstName.substr(0,10-1)+'...' : row.user.Student.firstName;
							}
							return row.user.institute.instituteName;
						}	
				}
			},
			'postedon': {
				column: {
					sTitle: 'posted on',
					name: 'postedon',
				},
				columnDef: {
					mDataProp:'createdDate',
				}
			},
			'status': {
				column: {
					sTitle: 'status',
					name: 'status',
					width:'8%'
				},
				columnDef: {
					mDataProp:'status',
					width:'8%'
				}
			},

			'action': {
				column: {
					sTitle: 'Action',
					width:'18%'
				},
				columnDef: {
					width:'18%',
					render: function(data, type, row, meta) {
						return "<button class='btn bgm-teal btn-xs' onclick=\"angular.element(this).scope().updateOrDeleteClassified('update');$(this).addClass('selected')\"> <i class='zmdi zmdi-edit zmdi-hc-fw'></i> </button>&nbsp"+   
						"<button onclick=\"angular.element(this).scope().updateOrDeleteClassified('delete');$(this).addClass('selected')\" class='btn btn-primary btn-xs btn-delete'><i class='zmdi zmdi-delete zmdi-hc-fw' style='color: #fff;'></i></button>&nbsp"+
						"<button onclick=\"angular.element(this).scope().updateOrDeleteClassified('view');$(this).addClass('selected')\" class='btn btn-cancel btn-xs waves-effect'><i class='zmdi zmdi-eye zmdi-hc-fw'></i></button>"
					}
				}
			},
		};
	};
	var headers = [
	               's_no',
	               'category',  
	               'title',
	               'postedby',
	               'postedon',
	               'status',
	               'action'
	               ];

	/**
	 * @name ClassifiedTable
	 * @module classifieds
	 * @description
	 *
	 *
	 * @author Ashok
	 * @copyright
	 */
	angular
	.module('cip.classifieds')
	.value('ClassifiedTable', {headers: headers, headersDef: headersDef});
}());