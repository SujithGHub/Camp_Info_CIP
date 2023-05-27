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
			'subject_code': {
				column: {
					sTitle: 'subject code',
					name: 'code',
				},
				columnDef: {
					mDataProp:'code',
					bSortable: true
				}
			},
			'subject_name': {
				column: {
					sTitle: 'subject name',
					name: 'subjectName',
				},
				columnDef: {
					render : function(data, type, row, meta) {
						return row.subjectName.length>10 ? row.subjectName.substr(0,10-1)+'...' : row.subjectName;
					}
				}
			},
			'standard': {
				column: {
					sTitle: 'standard',
					name: 'subjectName',
				},
				columnDef: {
					mDataProp:'subjectName',
					render : function(data, type, row, meta) {
						return row.classYear.name;
					}
				}
			},
			'department': {
				column: {
					sTitle: 'department',
					name: 'department',
				},
				columnDef: {
					render : function(data, type, row, meta) {
						return row.department.name.length>10 ? row.department.name.substr(0,10-1)+'...' : row.department.name;
					}
				}
			},
			'year': {
				column: {
					sTitle: 'year',
					name: 'year',
				},
				columnDef: {
					render : function(data, type, row, meta) {
						return row.classYear.name;
					}
				}
			},
			'semester': {
				column: {
					sTitle: 'semester',
					name: 'semester',
				},
				columnDef: {
					render : function(data, type, row, meta) {
						return row.semester;
					}
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
						if (row.isElective) {
							return  "<button class='btn bgm-teal btn-xs' onclick=\"angular.element(this).scope().updateOrDeleteSubject('update');$(this).addClass('selected')\"> <i class='zmdi zmdi-edit zmdi-hc-fw'></i> </button>&nbsp"+
							"<button onclick=\"angular.element(this).scope().updateOrDeleteSubject('delete');$(this).addClass('selected')\" class='btn btn-primary btn-xs btn-delete'><i class='zmdi zmdi-delete zmdi-hc-fw' style='color: #fff;'></i></button>&nbsp"+
							"<button onclick=\"angular.element(this).scope().updateOrDeleteSubject('view');$(this).addClass('selected')\" class='btn btn-cancel btn-xs waves-effect'><i class='zmdi zmdi-eye zmdi-hc-fw'></i></button>";
						}
						return  "<button class='btn bgm-teal btn-xs' onclick=\"angular.element(this).scope().updateOrDeleteSubject('update');$(this).addClass('selected')\"> <i class='zmdi zmdi-edit zmdi-hc-fw'></i> </button>&nbsp"+
						"<button onclick=\"angular.element(this).scope().updateOrDeleteSubject('delete');$(this).addClass('selected')\" class='btn btn-primary btn-xs btn-delete'><i class='zmdi zmdi-delete zmdi-hc-fw' style='color: #fff;'></i></button>";
					}
				}
			}
		};
	};
	var headers = {
			's_no':['School', 'College'],
			'subject_code':['School', 'College'],       
			'subject_name':['School', 'College'],
			'standard':['School'],
			'department':['College'],
			'year':['College'],
			'semester':['College'],
			'status':['School', 'College'],
			'action':['School', 'College']
	};

	/**
	 * @name SubjectTable
	 * @module subject
	 * @author Ashokrajan
	 * @copyright
	 */
	angular
	.module('cip.subject')
	.value('SubjectTable', {headers: headers, headersDef: headersDef});
}());