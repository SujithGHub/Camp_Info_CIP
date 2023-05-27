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
			
			'roll_no': {
				column: {
					sTitle: 'Roll no',
					name: 'rollNumber',
				},
				columnDef: {
					mDataProp:'rollNumber'
				}
			},
			
			'reg_no': {
				column: {
					sTitle: 'Reg no',
					name: 'rollNumber',
				},
				columnDef: {
					mDataProp:'rollNumber'
				}
			},

			'name': {
				column: {
					sTitle: 'Name',
					name: 'firstName',
				},
				columnDef: {
					mDataProp:'firstName'
				}
			},
			
			'department': {
				column: {
					sTitle: 'department',
					name: 'classYear.name',
				},
				columnDef: {
					render : function(data, type, row, meta) {
						return row.department.name.length > 20 ? row.department.name.substr(0,20-1)+'...' : row.department.name;
					}
				}
			},
			'year': {
				column: {
					sTitle: 'Year',
					name: 'classYear.name',
				},
				columnDef: {
					mDataProp:'classYear.name'
				}
			},
			'standard': {
				column: {
					sTitle: 'Standard',
					name: 'classYear.name',
				},
				columnDef: {
					mDataProp:'classYear.name'
				}
			},
			'section': {
				column: {
					sTitle: 'Section',
					name: 'section.sectionName',
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
						return  "<button class='btn bgm-teal btn-xs' onclick=\"angular.element(this).scope().updateStudent('update');$(this).addClass('selected')\"> <i class='zmdi zmdi-edit zmdi-hc-fw'></i> </button>";
					}
				}
			},
		};
	};
	var headers = {
			's_no':['School', 'College'],
			'roll_no':['School'],
			'reg_no':['College'],
			'name':['School', 'College'], 			
			'department':['College'],
			'year':['College'],
			'standard':['School'],
			'section':['School', 'College'],
			'status':['School', 'College'],
			'action':['School', 'College']
	};

	/**
	 * @name StudentTable
	 * @module student
	 * @author Ashokrajan
	 * @copyright
	 */
	angular
	.module('cip.student')
	.value('StudentTable', {headers: headers, headersDef: headersDef});
}());