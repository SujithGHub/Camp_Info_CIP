(function() {
    'use strict';

    /**
     * @ngdoc Service
     * @name SystemService
     * @module cip.system
     * @description
     *
     * SystemService
     *
     * @author
     * @copyright
     */
  
    angular
        .module('cip')
        .service('SystemService', SystemService);

    SystemService.$inject = [
        'SystemFactory'
     ];

    function SystemService(systemFactory) {
    	
    	this.getUser = function(params,successCb,errorCb){
    		systemFactory.getUser(params,successCb,errorCb);
    	};
    	this.getInstitute = function(params,successCb,errorCb){
    		systemFactory.getInstitute(params,successCb,errorCb);
    	};
    	this.getFeatures = function(params,successCb,errorCb){
    		systemFactory.getFeatures(params,successCb,errorCb);
    	};
    	this.updateProfile = function(params,successCb,errorCb){
    		systemFactory.updateProfile(params,successCb,errorCb);
    	};
    	this.changePassword = function(params,successCb,errorCb){
    		systemFactory.changePassword(params,successCb,errorCb);
    	};
    	this.getProfileImage = function(params,successCb,errorCb){
    		systemFactory.getProfileImage(params,successCb,errorCb);
    	};
    	this.setProfilePicture = function(params,successCb,errorCb){
    		systemFactory.setProfilePicture(params,successCb,errorCb);
    	};
    	this.deleteProfilePicture = function(params,successCb,errorCb){
    		systemFactory.deleteProfilePicture(params,successCb,errorCb);
    	};
    	this.loginStudentChange = function(params,successCb,errorCb){
    		systemFactory.loginStudentChange(params,successCb,errorCb);
    	};
        this.sendChatRequest = function(params,successCb,errorCb){
            systemFactory.sendChatRequest(params,successCb,errorCb);
        };
        this.loginChat = function(params,successCb,errorCb){
            systemFactory.loginChat(params,successCb,errorCb);
        };
        this.logoutChat = function(params,successCb,errorCb){
            systemFactory.logoutChat(params,successCb,errorCb);
        };
        this.getBloodGroup = function(successCb,errorCb){
            systemFactory.getBloodGroup(successCb,errorCb);
        };
        this.getPaymentMode = function(successCb,errorCb){
            systemFactory.getPaymentMode(successCb,errorCb);
        };
        this.logoutChat = function(successCb,errorCb){
            systemFactory.logoutChat(successCb,errorCb);
        };
		this.logout = function(successCb,errorCb){
			systemFactory.logout(successCb,errorCb);
		};
    }
    
}());
