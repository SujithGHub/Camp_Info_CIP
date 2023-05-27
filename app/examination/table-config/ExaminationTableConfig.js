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
			'exam_name': {
				column: {
					sTitle: 'exam name',
					name: 'examName',
				},
				columnDef: {
					mDataProp:'examName'
				}
			},
			'department': {
				column: {
					sTitle: 'Department',
					name: 'department',
				},
				columnDef: {
					mDataProp:'department.name'
				}
			},
			'standard': {
				column: {
					sTitle: 'Standard',
					name: 'standard',
				},
				columnDef: {
					mDataProp:'classYear.name'
				}
			},
			'year': {
				column: {
					sTitle: 'year',
					name: 'year',
				},
				columnDef: {
					mDataProp:'classYear.name'
				}
			},
			'semester': {
				column: {
					sTitle: 'semester',
					name: 'semester',
				},
				columnDef: {
					mDataProp:'semester'
				}
			},
			'section': {
				column: {
					sTitle: 'Section',
					name: 'section',
				},
				columnDef: {
					mDataProp:'section.sectionName'
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
						return "<button class='btn bgm-teal btn-xs' onclick=\"angular.element(this).scope().updateOrDeleteExamination('update');$(this).addClass('selected')\"> <i class='zmdi zmdi-edit zmdi-hc-fw'></i> </button>&nbsp"+   
						"<button style='background-color: deepskyblue' onclick=\"angular.element(this).scope().updateOrDeleteExamination('view');$(this).addClass('selected')\" class='btn btn-xs waves-effect'><i class='zmdi zmdi-file-text zmdi-hc-fw'></i></button>"
					}
				}
			},
			'view': {
				column: {
					sTitle: 'view',
				},
				columnDef: {
					render: function(data, type, row, meta) {
						return "<button onclick=\"angular.element(this).scope().updateOrDeleteExamination('view');$(this).addClass('selected')\" class='btn bgm-teal btn-xs'><i class='zmdi zmdi-eye zmdi-hc-fw'></i></button>";
					}
				}
			},
		};
	};
	var headers = {
			's_no':['ROLE_USER', 'ROLE_ADMIN', 'ROLE_STAFF', 'ROLE_STAFF_HOD'],
			'exam_name':['ROLE_USER', 'ROLE_ADMIN', 'ROLE_STAFF', 'ROLE_STAFF_HOD'],
			'department':['College'],
			'year':['College'],
			'standard':['School'],
			'semester':['College'],
			'section':['College','School'],
			'status':['ROLE_ADMIN', 'ROLE_STAFF', 'ROLE_STAFF_HOD'],
			'action':['ROLE_ADMIN', 'ROLE_STAFF', 'ROLE_STAFF_HOD'],
			'view':['ROLE_USER']
	};

	/**
	 * @name ExaminationTable
	 * @module examination
	 * @author Ashok
	 * @copyright
	 */
	angular
	.module('cip.examination')
	.value('ExaminationTable', {headers: headers, headersDef: headersDef})
}());