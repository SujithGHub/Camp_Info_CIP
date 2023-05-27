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
			'created_on': {
				column: {
					sTitle: 'Created On',
					name: 'Created On'
				},
				columnDef: {
                    render : function(data, type, row, meta) {
                        return meta.settings.oInit.fnConvertDateToIndianFormat(row.createdDate);
                    }
				}
			},
			'department': {
				column: {
					sTitle: 'department',
					name: 'department'
				},
				columnDef: {
					render : function(data, type, row, meta) {
						return row.department.name.length>7 ? row.department.name.substr(0,7-1)+'...' : row.department.name;
					}
				}
			},
			'year': {
				column: {
					sTitle: 'year',
					name: 'year'
				},
				columnDef: {
					mDataProp:'classYear.name'
				}
			},
			'standard': {
				column: {
					sTitle: 'Standard',
					name: 'standard'
				},
				columnDef: {
					mDataProp:'classYear.name'
				}
			},
			'section': {
				column: {
					sTitle: 'Section',
					name: 'section'
				},
				columnDef: {
					mDataProp:'section.sectionName'
				}
			},
			'subject': {
				column: {
					sTitle: 'Subject',
					name: 'subject'
				},
				columnDef: {
					mDataProp:'subject.subjectName',
					render: function (data, type, row, meta){
						if(row.subject.isElective) {
							return row.subjectElective.electiveSubjectName.length>15 ? row.subjectElective.electiveSubjectName.substr(0,15-1)+'...' : row.subjectElective.electiveSubjectName;
						}
						else {
							return row.subject.subjectName.length>15 ? row.subject.subjectName.substr(0,15-1)+'...' : row.subject.subjectName;
						}
					}	
				}
			},
			'title': {
				column: {
					sTitle: 'Title',
					name: 'title'
				},
				columnDef: {
					mDataProp:'title',
					render: function (data, type, row, meta){
						return row.title.length>10 ? row.title.substr(0,10-1)+'...' : row.title;
					}	
				}
			},
			'submissionDate': {
				column: {
					sTitle: 'Submission date',
					name: 'submissionDate',
				},
				columnDef: {
					mDataProp:'lastDateOfSubmission'
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
						return  "<button class='btn bgm-teal btn-xs' onclick=\"angular.element(this).scope().updateOrDeleteHomeWork('update');$(this).addClass('selected')\"> <i class='zmdi zmdi-edit zmdi-hc-fw'></i> </button>";
					}
				}
			},
			'view' : {
				column: {
					sTitle: 'view',
				},
				columnDef: {
					render: function(data, type, row, meta) {
						var col= meta.col;
						var status = meta.settings.aoColumns[col].data;
						var buttonColor;
						var today = new Date();
						today.setHours(0,0,0,0)
						var lastSubmissionDate  = new Date(row.lastDateOfSubmission);
						if( lastSubmissionDate > today) {
							buttonColor = "btn bgm-teal btn-xs";
						}
						else if (lastSubmissionDate < today ) {
							if(status == "SUBMITTED") {
                                buttonColor = "btn btn-info btn-xs";
							} else {
                                buttonColor = "btn btn-red btn-xs";
							}
						}
						else{
							buttonColor = "btn btn-delete btn-xs" 
						} 
						return  "<button class='"+buttonColor+"'  onclick=\"angular.element(this).scope().updateOrDeleteHomeWork('view');$(this).addClass('selected')\"> <i class='zmdi zmdi-eye zmdi-hc-fw'></i> </button>";
					}
				}
			}
		}; 
	};
	var headers = {
			's_no':['ROLE_USER', 'ROLE_ADMIN','ROLE_STAFF','ROLE_STAFF_HOD'],
			'created_on':['ROLE_USER', 'ROLE_ADMIN','ROLE_STAFF','ROLE_STAFF_HOD'],
			'department':['College'],
			'year':['College'],
			'standard':['School'],
			'section':['ROLE_ADMIN','ROLE_STAFF','ROLE_STAFF_HOD'],
			'subject':['ROLE_USER', 'ROLE_ADMIN','ROLE_STAFF','ROLE_STAFF_HOD'],
			'title':['ROLE_USER', 'ROLE_ADMIN','ROLE_STAFF','ROLE_STAFF_HOD'],
			'submissionDate':['ROLE_USER', 'ROLE_ADMIN','ROLE_STAFF','ROLE_STAFF_HOD'],
			'status':['ROLE_ADMIN','ROLE_STAFF','ROLE_STAFF_HOD'],
			'action':['ROLE_ADMIN','ROLE_STAFF','ROLE_STAFF_HOD'],
			'view':['ROLE_USER']
	};

	/**
	 * @name HomeWorkTable
	 * @module homeWork
	 * @author Ashok
	 * @copyright
	 */
	angular
	.module('cip.homeWork')
	.value('HomeWorkTable', {headers: headers, headersDef: headersDef});
}());