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
					render : function(data, type, row, meta) {
						return row.homeWork.department.name.length>7 ? row.homeWork.department.name.substr(0,7-1)+'...' : row.homeWork.department.name;
					}
				}
			},
			'year': {
				column: {
					sTitle: 'year',
					name: 'year',
				},
				columnDef: {
					mDataProp:'homeWork.classYear.name'
				}
			},
			'standard': {
				column: {
					sTitle: 'Standard',
					name: 'standard',
				},
				columnDef: {
					mDataProp:'homeWork.classYear.name'
				}
			},
			'subject': {
				column: {
					sTitle: 'Subject',
					name: 'subject',
				},
				columnDef: {
					mDataProp:'homeWork.subject.subjectName',
					render: function (data, type, row, meta){
						if(row.homeWork.subject.isElective) {
							return row.homeWork.subjectElective.electiveSubjectName.length>15 ? row.homeWork.subjectElective.electiveSubjectName.substr(0,15-1)+'...' : row.homeWork.subjectElective.electiveSubjectName;
						}
						else {
							return row.homeWork.subject.subjectName.length>15 ? row.homeWork.subject.subjectName.substr(0,15-1)+'...' : row.homeWork.subject.subjectName;
						}
					}	
				}
			},
			'title': {
				column: {
					sTitle: 'Title',
					name: 'title',
				},
				columnDef: {
					mDataProp:'homeWork.title',
					render: function (data, type, row, meta){
						return row.homeWork.title.length>10 ? row.homeWork.title.substr(0,10-1)+'...' : row.homeWork.title;
					}	
				}
			},
			'studentName': {
				column: {
					sTitle: 'Student Name',
					name: 'standard',
				},
				columnDef: {
					mDataProp:'student.firstName'
				}
			},
			'rollNumber': {
				column: {
					sTitle: 'Roll Number',
					name: 'rollNumber',
				},
				columnDef: {
					mDataProp:'student.rollNumber'
				}
			},
			'view' : {
				column: {
					sTitle: 'view',
				},
				columnDef: {
					render: function(data, type, row, meta) {
						return  "<button class='btn bgm-teal btn-xs' onclick=\"angular.element(this).scope().viewSubmittedHomeWork('view');$(this).addClass('selected')\"> <i class='zmdi zmdi-eye zmdi-hc-fw'></i> </button>";
					}
				}
			}
		}; 
	};
	var headers = {
			's_no':['ROLE_STAFF','ROLE_STAFF_HOD'],
			'department':['College'],
			'year':['College'],
			'standard':['School'],
			'subject':['ROLE_STAFF','ROLE_STAFF_HOD'],
			'title':['ROLE_STAFF','ROLE_STAFF_HOD'],
			'studentName':['ROLE_STAFF','ROLE_STAFF_HOD'],
			'rollNumber':['ROLE_STAFF','ROLE_STAFF_HOD'],
			'view':['ROLE_STAFF','ROLE_STAFF_HOD']
	};
	
	angular
	.module('cip.studentHomework')
	.value('StudentHomeWorkTable', {headers: headers, headersDef: headersDef});
}());