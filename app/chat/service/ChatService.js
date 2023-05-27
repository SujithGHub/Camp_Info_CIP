(function() {
    'use strict';

    angular
        .module('cip.chat')
        .service('ChatService', ChatService);

    ChatService.$inject = [
        'ChatFactory',
    ];

    function ChatService(chatFactory) {
        this.getFriends = function (successCb,errorCb) {
            chatFactory.getFriends(successCb,errorCb);
        };
        this.requestUser = function (params,successCb,errorCb) {
            chatFactory.requestUser(params,successCb,errorCb);
        };
        this.sendMessage = function (params,successCb,errorCb) {
            chatFactory.sendMessage(params,successCb,errorCb);
        };
        this.getMessageById = function (params,successCb,errorCb) {
            chatFactory.getMessageById(params,successCb,errorCb);
        };
        this.acceptUser = function (params,successCb,errorCb) {
            chatFactory.acceptUser(params,successCb,errorCb);
        };
        this.updateStatus = function (successCb,errorCb) {
            chatFactory.updateStatus(successCb,errorCb);
        };
        this.getGroup = function (successCb,errorCb) {
            chatFactory.getGroup(successCb,errorCb);
        };
        this.joinGroup = function (successCb,errorCb) {
            chatFactory.joinGroup(successCb,errorCb);
        };
        this.getGroupChatMessage = function (successCb,errorCb) {
            chatFactory.getGroupChatMessage(successCb,errorCb);
        };
        this.getUserGroupStatus = function (params,successCb,errorCb) {
            chatFactory.getUserGroupStatus(params,successCb,errorCb);
        };
        this.createUser = function (params,successCb,errorCb) {
             chatFactory.createUser(params,successCb,errorCb);
        }
        this.getLoggedInUser = function (params,successCb,errorCb) {
            chatFactory.getLoggedInUser(params,successCb,errorCb);
        };
        this.denyUser = function (params,successCb,errorCb) {
             chatFactory.denyUser(params,successCb,errorCb);
        };
        this.getChatUrl = function (successCb,errorCb) {
            chatFactory.getChatUrl(successCb,errorCb);
        };
        this.getFriend = function (params,successCb,errorCb) {
             chatFactory.getFriend(params,successCb,errorCb);
        };
    }
}());