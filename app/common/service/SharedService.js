(function() {
    'use strict';
angular.module('cip.common').factory('SharedService', function ($rootScope) {
    var sharedService = {};
    
    sharedService.resultData = {};
   
    sharedService.studentsResult = 0;
    sharedService.stdRollNo = null;
    sharedService.academicYear = {};
    sharedService.reportStatus = 0;
    sharedService.userDetails = [];
    sharedService.examDetails = {};
    sharedService.currentAcademic = '';
    sharedService.institute = {};
    sharedService.feature = {};
    sharedService.payment = {};
    sharedService.subjectName = '';
    sharedService.passPercentage = '';
    sharedService.totalCount = 0;
    sharedService.studentDetails = {};
    sharedService.subjectDetails = {};
    sharedService.attendanceCorrectionDetails = {}
    sharedService.feesStructure = {};
    
    
    sharedService.setResultData = function (resultData) {
        this.resultData = resultData;
    };
    
    sharedService.setStudentsResult = function (studentsResult) {
    	this.studentsResult = studentsResult;
    }
    
    sharedService.setStudentRollNo = function (studentRollNo) {
    	this.studentRollNo = studentRollNo;
    }
    
    sharedService.setStdRollNo = function (stdRollNo) {
    	this.stdRollNo = stdRollNo;
    }
    
    sharedService.setAcademicYear = function (academicYear) {
    	this.academicYear = academicYear;
    }
    
    sharedService.setReportStatus = function (reportStatus) {
    	this.reportStatus = reportStatus;
    }
    
    sharedService.setUserDetails = function (userDetails) {
    	this.userDetails = userDetails;
    }
    
    sharedService.setExamDetails = function (examDetails) {
    	this.examDetails = examDetails;
    }
    
    sharedService.setCurrentAcademic = function (currentAcademic) {
    	this.currentAcademic = currentAcademic;
    }
    
    sharedService.setInstitute = function (institute) {
        this.institute = institute;
    };
    
    sharedService.setFeatures = function (feature) {
        this.feature = feature;
    };
    
    sharedService.setPayment = function (payment) {
        this.payment = payment;
    };
    
    sharedService.setSubjectName = function (subjectName) {
        this.subjectName = subjectName;
    };
    
    sharedService.setPassPercentage = function (passPercentage) {
        this.passPercentage = passPercentage;
    };
    
    sharedService.setTotalCount = function (totalCount) {
        this.totalCount = totalCount;
    };
    
    sharedService.setStudentDetails = function (student) {
        this.studentDetails = student;
    };
    
    sharedService.setSubjectDetails = function (subjectDetails) {
    	this.subjectDetails = subjectDetails;
    }
    
    sharedService.setAttendanceCorrectionDetails = function (studentDetails) {
    	this.studentDetails = studentDetails;
    }
    
    sharedService.setFeesStructure =  function (feesStructure) {
    	this.feesStructure = feesStructure;
    }
    

    sharedService.clear = function () {
        //sharedService.secure_hash = {};
    };
    return sharedService;

})
})();