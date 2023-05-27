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
			'attendance_date': {
				column: {
					sTitle: 'ATTENDANCE DATE',
					name: 'attendanceDate',
				},
				columnDef: {
					mDataProp:'attendanceDate'
				}
			},
			'hour': {
				column: {
					sTitle: 'Attendance Hour',
					name: 'hour',
				},
				columnDef: {
					mDataProp:'hour'
				}
			},
			'reason': {
				column: {
					sTitle: 'Reason',
					name: 'reason',
				},
				columnDef: {
					mDataProp:'reason'
				}
			},
			'student_name': {
				column: {
					sTitle: 'STUDENT NAME',
					name: 'student.firstName',
				},
				columnDef: {
					mDataProp:'student.firstName'
				}
			},
			'student_reg_no': {
				column: {
					sTitle: 'REG NO',
					name: 'student.rollNumber',
				},
				columnDef: {
					mDataProp:'student.rollNumber'
				}
			},
			'staff_name': {
				column: {
					sTitle: 'REQUEST FROM',
					name: 'from.firstName',
				},
				columnDef: {
					mDataProp:'from.firstName'
				}
			},
			'status': {
				column: {
					sTitle: 'STATUS',
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
						if(row.status =="PENDING") {
							return "<button class='btn bgm-teal btn-xs' onclick=\"angular.element(this).scope().acceptAttendanceCorrection('ACCEPTED');$(this).addClass('selected')\"> <i class='fa fa-check-square-o'></i> </button>&nbsp"
									+"<button onclick=\"angular.element(this).scope().acceptAttendanceCorrection('REJECT');$(this).addClass('selected')\" class='btn btn-primary btn-xs btn-delete'><i class='fa fa-times'></i></button>&nbsp"
									+"<button onclick=\"angular.element(this).scope().acceptAttendanceCorrection('view');$(this).addClass('selected')\" class='btn btn-cancel btn-xs waves-effect'><i class='zmdi zmdi-eye zmdi-hc-fw'></i></button>" ;
						} else {
							return "<button onclick=\"angular.element(this).scope().acceptAttendanceCorrection('view');$(this).addClass('selected')\" class='btn btn-cancel btn-xs waves-effect'><i class='zmdi zmdi-eye zmdi-hc-fw'></i></button>";
						}
					}
				}
			},
			'staff_action': {
				column: {
					sTitle: 'Action',
				},
				columnDef: {
					render: function(data, type, row, meta) {
						return "<button onclick=\"angular.element(this).scope().acceptAttendanceCorrection('view');$(this).addClass('selected')\" class='btn btn-cancel btn-xs waves-effect'><i class='zmdi zmdi-eye zmdi-hc-fw'></i></button>&nbsp" 
						      + "<button onclick=\"angular.element(this).scope().acceptAttendanceCorrection('enterAttendance');$(this).addClass('selected');\" title='Enter Attendance' class='btn btn-primary btn-xs btn-delete'><i class='fa fa-external-link'></i></button>";
					}
				}
			},
		};
	};
	var headers = {
			's_no':['ROLE_ADMIN', 'ROLE_STAFF','ROLE_STAFF_HOD'],
			'student_reg_no':['ROLE_ADMIN', 'ROLE_STAFF','ROLE_STAFF_HOD'],	
			'student_name':['ROLE_ADMIN', 'ROLE_STAFF','ROLE_STAFF_HOD'],
			'attendance_date':['ROLE_ADMIN', 'ROLE_STAFF','ROLE_STAFF_HOD'],
			'hour':['ROLE_ADMIN', 'ROLE_STAFF','ROLE_STAFF_HOD'],
			'staff_name':['ROLE_ADMIN', 'ROLE_STAFF','ROLE_STAFF_HOD'],
			'reason':['ROLE_ADMIN', 'ROLE_STAFF','ROLE_STAFF_HOD'],
			'status':['ROLE_ADMIN', 'ROLE_STAFF', 'ROLE_STAFF_HOD'],
			'action':['ROLE_ADMIN' ,'ROLE_STAFF_HOD'],
			'staff_action':['ROLE_STAFF']
	};
	
	angular.module('cip.attendanceCorrection')
	.value('AttendanceCorrectionTable', {headers: headers, headersDef: headersDef});
}());