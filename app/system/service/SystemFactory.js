(function() {
	'use strict';

	angular
	.module('cip')
	.factory('SystemFactory', SystemFactory);

	SystemFactory.$inject = [
	                         '$resource',
							'CommonService'
	                         ];

	function SystemFactory($resource,commonService) {

		return $resource( commonService.baseApi+'/user', {}, {
			getUser: {
				url: commonService.baseApi+'/user/loggedin',
				method: 'GET'
			},
			getInstitute: {
				url: commonService.baseApi+'/institute/prefix',
				method: 'GET'
			},
			getProfileImage: {
				url: commonService.baseApi+'/user/pictures',
				method: 'GET',
				isArray: true
			},
			getFeatures: {
				url: commonService.baseApi+'/feature/user',
				method: 'GET',
				isArray: true
			},
			updateProfile: {
				url: commonService.baseApi+'/user',
				method: 'PUT'
			},
			changePassword: {
				url: commonService.baseApi+'/user/password',
				method: 'PUT'
			},
			setProfilePicture: {
				url: commonService.baseApi+'/user/picture/upload',
				method: 'POST'
			},
			deleteProfilePicture: {
				url: commonService.baseApi+'/user/picture',
				method: 'POST'
			},
			loginStudentChange : {
				url: commonService.baseApi+'/user/changeuser/:id',
				method: 'GET',
				params : {id :'@id'}
			},
			sendChatRequest: {
		        url: commonService.baseApi+'/chat/request?requestUser=:requestUser',
		        method: 'POST',
		        params : {requestUser:'@requestUser'}
		    },
		    logout: {
			    url: commonService.baseApi+'/logout',
			    method: 'POST'
			},
            loginChat : {
                url: commonService.baseApi+'/chat/login/:resourceId',
                method: 'GET',
                params : {resourceId :'@resourceId'}
            },
            getBloodGroup: {
                url: commonService.baseApi+'/type/bloodgroup',
                method: 'GET'
            },
            getPaymentMode: {
                url: commonService.baseApi+'/type/payment/mode',
                method: 'GET'
            },
            logoutChat: {
                url: commonService.baseApi+'/chat/status?chatId=:chatId&status=:status',
                method: 'PUT',
                params : {
                chatId:'@chatId',
                status:'@status'
                }
            }
    });
	}
})();