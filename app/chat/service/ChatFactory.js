(function() {
    'use strict';

    angular
        .module('cip.chat')
        .factory('ChatFactory', ChatFactory);

    ChatFactory.$inject = [
        '$resource',
        'CommonService'
    ];

    function ChatFactory($resource,commonService) {

        return $resource('', {}, {
            getFriends : {
                url:  commonService.baseApi+'/chat/friends?chatId=:chatId',
                method: 'GET',
            },
            requestUser : {
                url:  commonService.baseApi+'/chat/request?chatId=:chatId&baseUserId=:baseUserId&baseReferenceId=:baseReferenceId',
                method: 'POST',
                params : {
                    chatId: '@chatId',
                    baseUserId:'@baseUserId',
                    baseReferenceId:'@baseReferenceId'
                },
            },
            sendMessage : {
                url:  commonService.baseApi+'/chat/message',
                method: 'POST',
            },
            getMessageById :{
                url:  commonService.baseApi+'/chat/message?identifierId=:identifierId&pageNo=:pageNo',
                method: 'GET',
                params : {
                    identifierId : '@identifierId',
                    pageNo      : '@pageNo'
                },
            },
            acceptUser : {
                url:  commonService.baseApi+'/chat/accept?user=:user&chatId=:chatId',
                method: 'PUT',
                params : {
                    user : '@user',
                    chatId: '@chatId',
                },
            },
            updateStatus : {
                url:  commonService.baseApi+'/chat/status?status=:status&chatId=:chatId',
                method: 'PUT',
                params : {
                    status : '@status',
                    chatId: '@chatId'
                }
            },
            getGroup : {
                url:  commonService.baseApi+'/chat/group?userId=:userId',
                method: 'GET',
                params : {
                    userId  : '@userId'
                },
            },
             joinGroup :{
                url:  commonService.baseApi+'/chat/join/?groupId=:groupId&userId=:userId',
                method: 'POST',
                params : {
                    groupId : '@groupId',
                    userId  : '@userId'
                },
             },
             getUserGroupStatus :{
                url:  commonService.baseApi+'/chat/user/group/status?groupId=:groupId&chatId=:chatId',
                method: 'GET',
                params : {
                    groupId : '@groupId',
                },
             },
             createUser :{
                 url:  commonService.baseApi+'/chat/create/user?userId=:userId',
                 method: 'PUT',
                 params : {
                     userId : '@userId',
                 },
             },
             denyUser : {
                 url:  commonService.baseApi+'/chat/deny?user=:user&chatId=:chatId',
                 method: 'PUT',
                 params : {
                     user : '@user',
                     chatId: '@chatId',
                 }
              },
             getLoggedInUser : {
                 url:  commonService.baseApi+'/chat/loggedin/user?baseUserId=:baseUserId&baseReferenceId=:baseReferenceId',
                 method: 'GET',
                 params : {
                     baseUserId       : '@baseUserId',
                     baseReferenceId  : '@baseReferenceId'
                 },
             },
             getChatUrl :{
                 url:  commonService.baseApi+'/chat/getUrl',
                 method: 'GET',
             },
             getFriend : {
                 url:  commonService.baseApi+'/chat/getFriend?chatId=:chatId&baseReferenceId=:baseReferenceId',
                 method: 'GET',
                 params : {
                      baseUserId       : '@baseUserId',
                      baseReferenceId  : '@baseReferenceId'
                 },
             }
        });
    }
})();