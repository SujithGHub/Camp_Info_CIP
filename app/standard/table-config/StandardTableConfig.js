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
                     width:'10%'
                 },
                 columnDef: {
                     width:'10%',
 					render: function(data, type, row, meta) {
 						return meta.row + meta.settings._iDisplayStart + 1;
 					}
 				}
             },
             'department': {
 				column: {
 					sTitle: 'department',
 					name: 'department',
                    width:'29%'
 				},
 				columnDef: {
 					mDataProp:'department',
                    width:'29%',
 					render: function(data, type, row, meta) {
 						return row.department.name;
 					}
 				}
 			},
             'standard': {
				column: {
					sTitle: 'Standard',
					name: 'standard',
                    width:'30%'
				},
				columnDef: {
                    width:'30%',
					mDataProp:'name'
				}
			},
			  'year': {
					column: {
						sTitle: 'year',
						name: 'year',
                        width:'16%'
					},
					columnDef: {
                        width:'16%',
						mDataProp:'name'
					}
				},
            'display_order': {
                column: {
                    sTitle: 'displayOrder',
                    name: 'displayOrder',
                    width:'15%'
                },
                columnDef: {
                    width:'15%',
                    mDataProp:'displayOrder'
                }
            },
			'status': {
				column: {
					sTitle: 'status',
					name: 'status',
                    width:'10%'
				},
				columnDef: {
                    width:'10%',
					mDataProp:'status'
				}
			},

			'action': {
				column: {
					sTitle: 'Action',
                    width:'10%'
				},
				columnDef: {
                    width:'10%',
					render: function(data, type, row, meta) {
						return  "<button class='btn bgm-teal btn-xs' onclick=\"angular.element(this).scope().updateStandard();$(this).addClass('selected')\"> <i class='zmdi zmdi-edit zmdi-hc-fw'></i> </button>";
					}
				}
			},
		};
	};
	var headers = {
	               's_no':['School','College'],
	               'department':['College'],
	               'standard': ['School'],
	               'year':['College'],
		           'display_order':['School', 'College'],
	               'status':['School','College'],
	               'action':['School','College']
};

	/**
	 * @name StandardTable
	 * @module standard
	 * 
	 * @author Ashok
	 * @copyright
	 */
	angular
	.module('cip.standard')
	.value('StandardTable', {headers: headers, headersDef: headersDef});
}());