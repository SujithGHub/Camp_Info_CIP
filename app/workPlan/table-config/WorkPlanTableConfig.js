(function() {
	'use strict';


    /**
     * @author Krishna
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
			'subject_name': {
				column: {
					sTitle: 'SUBJECT NAME',
					name: 'subject.subjectName',
				},
				columnDef: {
					mDataProp:'subject.subjectName'
				}
			},
			'department': {
				column: {
					sTitle: 'DEPARTMENT',
					name: 'department',
				},
				columnDef: {
					mDataProp:'subject.department.name'
				}
			},
			'year': {
				column: {
					sTitle: 'YEAR',
					name: 'year',
				},
				columnDef: {
					mDataProp:'subject.classYear.name'
				}
			},
			
			'semester': {
				column: {
					sTitle: 'SEMESTER',
					name: 'semester',
				},
				columnDef: {
					mDataProp:'subject.semester'
				}
			},
			'plandate': {
				column: {
					sTitle: 'Plan Date',
					name: 'planDate',
				},
				columnDef: {
					mDataProp:'planDate'
				}
			},
			'action': {
				column: {
					sTitle: 'Action',
				},
				columnDef: {
					render: function(data, type, row, meta) {
						return  "<button class='btn bgm-teal btn-xs' onclick=\"angular.element(this).scope().updateWorkPlanDetail('update');$(this).addClass('selected')\"> <i class='zmdi zmdi-edit zmdi-hc-fw'></i> </button>";
					}
				}
			},
		};
	};
	var headers = [
			's_no',
			'subject_name',
			'department',
			'year',
			'semester',
			'plandate',
			'action'
	];
	
	angular
	.module('cip.workPlan')
	.value('WorkPlanTable', {headers: headers, headersDef: headersDef});
}());