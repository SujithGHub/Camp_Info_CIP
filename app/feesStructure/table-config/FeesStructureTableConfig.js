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
						return row.department.displayName;
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
			'fees_type': {
				column: {
					sTitle: 'fees type',
					name: 'feestype',
				},
				columnDef: {
					render: function(data, type, row, meta) {
						return row.name;
					}
				}
			},
			'fee': {
				column: {
					sTitle: 'fee',
					name: 'fee',
				},
				columnDef: {
					render: function(data, type, row, meta) {
						return row.fee;
					}
				}
			},
			'fromDate': {
                column: {
                    sTitle: 'From Date',
                    name: 'fromDate',
                },
                columnDef: {
                    mDataProp:'fromDate',
                    render: function(data, type, row, meta) {
                        return  row.startDate;
                    }
                }
            },
            'toDate': {
                column: {
                    sTitle: 'to Date',
                    name: 'toDate',
                },
                columnDef: {
                	mDataProp:'fromDate',
                    render: function(data, type, row, meta) {
                        return  row.lastDate;
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
					sTitle: 'Action'
				},
				columnDef: {
					render: function(data, type, row, meta) {
						return  "<button class='btn bgm-teal btn-xs' onclick=\"angular.element(this).scope().updateOrDeleteFees('update');$(this).addClass('selected')\"> <i class='zmdi zmdi-edit zmdi-hc-fw'></i> </button> <button onclick=\"angular.element(this).scope().updateOrDeleteFees('delete');$(this).addClass('selected')\" class='btn btn-primary btn-xs btn-delete'><i class='zmdi zmdi-delete zmdi-hc-fw' style='color: #fff;'></i></button>";
					}
				}
			}
		};
	};
	var headers = {
			's_no':['School', 'College'],
			'department':['College'],
			'year':['College'],
			'standard':['School'],
			'fees_type':['School', 'College'],
			'fee':['School', 'College'],
			'fromDate':['School', 'College'],
		    'toDate':['School', 'College'],
			'status':['ROLE_ADMIN'],
			'action':['ROLE_ADMIN']
	};

	/**
	 * @name FeesStructureTable
	 * @module FeesStructure
	 * @author Mariselvam
	 * @copyright
	 */
	angular
	.module('cip.feesStructure')
	.value('FeesStructureTable', {headers: headers, headersDef: headersDef});
}());