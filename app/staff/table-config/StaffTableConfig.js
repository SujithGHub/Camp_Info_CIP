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
                     name: 's_no'
                 },
                 columnDef: {
 					render: function(data, type, row, meta) {
 						return meta.row + meta.settings._iDisplayStart + 1;
 					}
 				}
             },
             
             'staff_Id': {
 				column: {
 					sTitle: 'Staff ID',
 					name: 'staffId'
 				},
 				columnDef: {
 					mDataProp:'staffId'
 				}
 			},
 			
             'name': {
				column: {
					sTitle: 'Name',
					name: 'firstName'
				},
				columnDef: {
					mDataProp:'firstName'
				}
			},
			'qualification': {
				column: {
					sTitle: 'qualification',
					name: 'qualification'
				},
				columnDef: {
					mDataProp:'qualification'
				}
			},
			
			'role': {
				column: {
					sTitle: 'Role',
					name: 'role'
				},
				columnDef: {
					render: function(data, type, row, meta) {
						if(row.role[0].name==="ROLE_STAFF_HOD") {
							return "HOD"
						} else {
							return "STAFF"
						}
					}
				}
			},			
			'department': {
				column: {
					sTitle: 'Department',
					name: 'department'
				},
				columnDef: {
					mDataProp:'department.name'
				}
			},	
			
			
			'martial_status': {
				column: {
					sTitle: 'Martial status',
					name: 'maritalStatus'
				},
				columnDef: {
					mDataProp:'maritalStatus'
				}
			},
			'contact_no': {
				column: {
					sTitle: 'contact no',
					name: 'phoneNumber'
				},
				columnDef: {
					mDataProp:'phoneNumber'
				}
			},
			'status': {
				column: {
					sTitle: 'status',
					name: 'status'
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
						return "<button class='btn bgm-teal btn-xs' onclick=\"angular.element(this).scope().updateOrDeleteStaff('update');$(this).addClass('selected')\"> <i class='zmdi zmdi-edit zmdi-hc-fw'></i> </button>";
					}
				}
			}
		};
	};
	var headers = {
	               's_no':['School','College'],
	               'staff_Id':['School','College'],
	               'name':['School','College'], 
	               'department':['College'],
	               'qualification':['School','College'],
	               'contact_no':['School','College'],
	               'role':['School','College'],
	               'status':['School','College'],
	               'action':['School','College']
	};

	/**
	 * @name StaffTable
	 * @module staff
	 * @author Ashokrajan
	 * @copyright
	 */
	angular
	.module('cip.staff')
	.value('StaffTable', {headers: headers, headersDef: headersDef});
}());