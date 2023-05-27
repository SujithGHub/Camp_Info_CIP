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
			'department': {
				column: {
					sTitle: 'department',
					name: 'department',
				},
				columnDef: {
					render: function(data, type, row, meta) {
						return row.department.name;
					}
				}
			},
			'year': {
				column: {
					sTitle: 'year',
					name: 'year',
				},
				columnDef: {
					render: function(data, type, row, meta) {
						return row.classYear.name;
					}
				}
			},
			'standard': {
				column: {
					sTitle: 'Standard',
					name: 'name',
				},
				columnDef: {
					mDataProp:'name',
					bSortable: true,
					render: function(data, type, row, meta) {
						return row.classYear.name;
					}
				}
			},
			'section': {
				column: {
					sTitle: 'Section',
					name: 'sectionName',
				},
				columnDef: {
					mDataProp:'sectionName',
					bSortable: true,
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
						return  "<button class='btn bgm-teal btn-xs' onclick=\"angular.element(this).scope().updateSection();$(this).addClass('selected')\"> <i class='zmdi zmdi-edit zmdi-hc-fw'></i> </button>";
					}
				}
			},
		};
	};
	var headers = {
			's_no':['School', 'College'],
			'department':['College'],
			'year':['College'],
			'standard':['School'],
			'section':['School', 'College'],
			'status':['School', 'College'],
			'action':['School', 'College']
	};

	/**
	 * @name SectionTable
	 * @module section
	 * @description
	 *
	 *
	 * @author Ashok
	 * @copyright
	 */
	angular
	.module('cip.section')
	.value('SectionTable', {headers: headers, headersDef: headersDef});
}());