(function() {
    'use strict';
    
       

    /**
     * @author Krishna
     */
    
    angular
    .module('cip.attendanceCorrection')
    .service('AttendanceCorrectionService', AttendanceCorrectionService);
    
		AttendanceCorrectionService.$inject = [
		    '$log',
		    'AttendanceCorrectionFactory',
		    'AttendanceCorrectionTable',
		    'CommonService',
		 ];
		
		function AttendanceCorrectionService($log, attendanceCorrectionFactory, attendanceCorrectionTable, commonService) {
			
			this.saveAttendanceCorrection = function(successCb,errorCb){
				attendanceCorrectionFactory.saveAttendanceCorrection(successCb,errorCb);
	    	};
	    	
	    	this.updateAttendanceCorrection = function(successCb,errorCb) {
	    		attendanceCorrectionFactory.updateAttendanceCorrection(successCb,errorCb);
	    	}
	    	
	    	this.initTable=function(tableElm){
	    		commonService.setTableConfig(tableElm, attendanceCorrectionTable, '/attendancecorrection', true);
	    	}

		}
		
}());