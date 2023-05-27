(function() {
    'use strict';
    
    angular
        .module('cip.studentHomework')
        .service('StudentHomeworkService', StudentHomeworkService);

    StudentHomeworkService.$inject = [
        'StudentHomeWorkTable',
        'CommonService',
        'StudentHomeworkFactory'
     ];

    function StudentHomeworkService(StudentHomeWorkTable,commonService,studentHomeworkFactory) {
    	
    	this.initTable = function(tableElm, searchInfo) {
    		commonService.setTableConfig(tableElm, StudentHomeWorkTable, '/homework/submitted/homework', true, 'searchInfo='+searchInfo);
		};
        this.updateStatus = function(params,successCb,errorCb){
            studentHomeworkFactory.updateStatus(params,successCb,errorCb);
        };
    }
}());