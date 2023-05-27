(function() {
    'use strict';
    angular
        .module('cip.chat')
        .controller('ChatController', ChatController);

    ChatController.$inject = ['$log','$scope','ChatService','$rootScope','SharedService',"SystemService", "$timeout", "$location"];

    /* @ngInject */
    function  ChatController($log,$scope,chatService,$rootScope,sharedService,systemService,$timeout, $location) {

    	var vm = this;
        vm.init		= init;
    	vm.messages = [];
    	vm.chatOption = true;
    	vm.chatEnabled = false;
    	vm.deny = false;
        vm.messageForm = {};
        var timer;

    	vm.openChat = function(){
    	    var chatElement = document.getElementById('chat-sidebar');
        	if(vm.chatOption) {
        	    chatElement.classList.add("chat-sidebar-width");
                vm.openContacts = true;
                vm.openGroup = true;
                vm.chatOption = false;
        	} else {
        	    chatElement.classList.remove("chat-sidebar-width");
                vm.chatOption = true;
        	}
        };

        vm.openContactChat = function(friend){
         vm.deny = false;
         vm.typing = false;
        	vm.openContacts = !vm.openContacts;
        	vm.messages = [];
        	if(!vm.openContacts) {
        	    vm.friendInitialDetails = friend;
                vm.friend = friend;
                getUserFriendStatus(friend.baseReferenceId);

            } else {
                $scope.$broadcast('setScrollStatus', false);
                vm.socket.removeListener('new-message/'+vm.messageForm.identifierId);
                vm.socket.removeListener('typing-received/'+vm.chatId);
            }
        };
        function setListenerChat(){
            vm.messageForm.identifierId = vm.friend.identifierId;
            vm.friendId = vm.friend.friendId;
            if(vm.friend.subscriptionMode == "both") {
                vm.socket.on('new-message/'+vm.messageForm.identifierId, function(message) {
                    vm.messageForm.message = "";
                    message.createdAt = new Date(message.createdAt);
                    vm.messages.unshift(message);
                    $scope.$apply();
                    $(".chat-message-body").stop().animate({ scrollTop: $(".chat-message-body")[0].scrollHeight}, 'slow');
                });
                vm.socket.on('typing-received/'+vm.chatId, function(data) {
                    vm.messageForm.message = "";
                    if(data.status == "MessageTyping"){
                        vm.typing = true;
                    }else if(data.status == "StopTyping"){
                        vm.typing = false;
                    }
                    $scope.$apply();
                });
                vm.socket.on('status/'+vm.friendId, function(data) {
                    vm.friend.status = data;
                    $scope.$apply();
                });vm.pageNo = 1;
                getMessageById(vm.messageForm.identifierId,vm.pageNo);

            }
        }
        vm.getFriends = function(searchTerm){
        	chatService.getFriends({chatId:vm.chatId},successCb,errorCb);
            function successCb(result){
                vm.friendsList = result.entityList;
                if(vm.friend != undefined) {
                    vm.friend = vm.friendsList.find(friend => vm.friend.friendId == friend.friendId);
                }
            }
            function errorCb(error){
                $log.debug("FAILURE getFriends:",error)
            }
		};
        
        vm.requestUser = function(baseUserId,baseReferenceId){
            chatService.requestUser({chatId:vm.chatId,baseUserId:baseUserId,baseReferenceId:baseReferenceId},successCb,errorCb);
            function successCb(result){
                getUserFriendStatus(baseReferenceId);
            }
            function errorCb(error){
                $log.debug("FAILURE requestUser:",error)
            }
        };

        function getUser() {
            systemService.getUser(successCb, errorCb);
            function successCb(result) {
                vm.role = result.entity.roles[0].name;
                vm.chatEnabled = $rootScope.instituteInfo.chatIsEnabled;
                vm.getLoggedInUser();
            }
            function errorCb(error) {
                $log.debug("FAILURE getUser:",error)
            }
        }

        function init(){
            if(vm.role == undefined){
                getUser();
            }
            else{
                vm.role = sharedService.userDetails.roles[0].name;
                vm.chatEnabled = $rootScope.instituteInfo.chatIsEnabled;
                vm.getLoggedInUser();
            }
		}

        vm.getLoggedInUser = function(){
            var baseReferenceId;
            if(vm.role == 'ROLE_USER'){
                baseReferenceId = $rootScope.userInfo.Student.id;
            }else if(vm.role == 'ROLE_STAFF'|| vm.role == 'ROLE_STAFF_HOD'){
                baseReferenceId = $rootScope.userInfo.staff.id;
            }
            chatService.getLoggedInUser({baseUserId:$rootScope.userInfo.id,baseReferenceId:baseReferenceId},successCb,errorCb);
            function successCb(result){
                vm.LoggedInUser = result.entity;
                vm.chatId = vm.LoggedInUser.id;
                $rootScope.chatId = vm.chatId;
                getFriendsAndGroups()
            }
            function errorCb(error){
                $log.debug("FAILURE getLoggedInUser:",error)
            }
        };

        vm.sendMessage = function(message) {
            message.fromId = vm.chatId;
            if (message.message != undefined && message.message != "") {
                vm.socket.emit('save-message',message);
            }
        };
        function getMessageById(identifierId,pageNo){
            chatService.getMessageById({identifierId:identifierId,pageNo:pageNo},successCb,errorCb);
            function successCb(result){
                vm.pageSize = result.totalCount / 50;
                if(vm.pageNo == 1) {
                    vm.messages = result.entityList.reverse();
                } else {
                    vm.messages.push.apply(vm.messages, result.entityList.reverse());
                    vm.copyMessages = angular.copy(vm.messages);
                    vm.messages = [];
                    vm.messages = vm.copyMessages;
                }
            }
            function errorCb(error){
                $log.debug("FAILURE getMessageById:",error);
            }
        }

        vm.lastDate = null;
        vm.getMessageGroupHeader = function(date, index){
            var today = new Date();
            today.setHours(0,0,0,0);
            if(index == 0){
                vm.lastDate = null;
            }
            if(index != undefined ){
                vm.currentDate = date;
                if(today < new Date(vm.currentDate).setHours(0,0,0,0) || today > new Date(vm.currentDate).setHours(0,0,0,0)) {
                    if(index != 0 && new Date(vm.lastDate).setHours(0,0,0,0) == new Date(vm.currentDate).setHours(0,0,0,0)) {
                        vm.lastDate = date;
                        return false;
                    }else{
                       vm.messageGroupHeaderName = vm.currentDate;
                        vm.lastDate = date;
                        return true;
                    }
                } else {
                    if(index != 0 && new Date(vm.lastDate).setHours(0,0,0,0) == new Date(vm.currentDate).setHours(0,0,0,0)) {
                        vm.lastDate = date;
                        return false;
                    }else{
                        vm.messageGroupHeaderName= "TODAY";
                        vm.lastDate = date;
                        return true;
                    }

                }
            }
        };

        vm.acceptUser = function(user){
            chatService.acceptUser({user:user,chatId:vm.chatId},successCb,errorCb);
            function successCb(result){
                getUserFriendStatus(vm.friendInitialDetails.baseReferenceId);
            }
            function errorCb(error){
                $log.debug("FAILURE acceptUser:",error)
            }
        };

        vm.updateStatus = function(status){
            chatService.updateStatus({status:status, chatId:vm.chatId},successCb,errorCb);
            function successCb(result){

            }
            function errorCb(error){
                $log.debug("FAILURE updateStatus:",error)
            }
        };

        vm.messageTyping = function() {
            $timeout.cancel(timer);
            var message = {};
            message.friendId = vm.friendId;
            message.status   = 'MessageTyping'
            vm.socket.emit('message-typing',message);
        };

        vm.stopTyping = function() {
           timer = $timeout(function () {
                var message = {};
                message.friendId = vm.friendId;
                message.status   = 'StopTyping';
                vm.socket.emit('message-typing',message);
             }, 5000 );
        };

       vm.dateConverter = function(date){
           if(date == 'TODAY'){
               return 'TODAY';
           } else {
               return new Date(date);
           }
       };

       vm.scrollBottom = function (){
            if(vm.pageNo == 1) {
                $(".chat-message-body").stop().animate({ scrollTop: $(".chat-message-body")[0].scrollHeight}, 'slow');
                $(".chat-group-message-body").stop().animate({ scrollTop: $(".chat-group-message-body")[0].scrollHeight}, 'slow');
                $timeout(function() {
                    $scope.$broadcast('setScrollStatus', true);
                },1000);
            } else {
                $scope.$broadcast('setScrollTop', '');
            }
       };

       vm.setSocketTenantId = function(user) {
            vm.socket = io.connect(location.origin,{ query: "tenantId=" +user.tenantId });
       };

        vm.scrollMethod = function () {
            if( Math.ceil(vm.pageSize) > vm.pageNo){
                vm.pageNo++;
                getMessageById(vm.messageForm.identifierId,vm.pageNo);
            }
        };

         vm.getGroup = function(searchTerm){
            chatService.getGroup({userId:vm.chatId},successCb,errorCb);
            function successCb(result){
                vm.groupList = result.entityList;
            }
            function errorCb(error){
                $log.debug("FAILURE getGroup:",error)
            }
         };

          vm.openGroupChat = function(group){
              vm.typing = false;
              vm.openGroup = !vm.openGroup;
              vm.messages = [];
              if(!vm.openGroup) {
                   vm.group = group;
                   getUserGroupStatus();
                    vm.messageForm.identifierId = vm.group.identifierId;
                    vm.socket.on('new-message/'+vm.messageForm.identifierId, function(message) {
                       vm.messageForm.message = "";
                       message.createdAt = new Date(message.createdAt);
                       vm.messages.unshift(message);
                       if(vm.messageGroupHeaderName != 'TODAY'){
                          vm.copyMessages = angular.copy(vm.messages);
                          vm.messages = [];
                          vm.messages = vm.copyMessages;
                       }
                      $scope.$apply();
                      $(".chat-group-message-body").stop().animate({ scrollTop: $(".chat-group-message-body")[0].scrollHeight}, 'slow');
                    });

                    vm.socket.on('group-typing-received/'+vm.group.identifierId, function(data) {
                        if(data.status == "MessageTyping"){
                            vm.typing = true;
                            vm.receiverName = data.friendName;
                        }else if(data.status == "StopTyping"){
                            vm.typing = false;
                        }
                        $scope.$apply();
                    });

              } else {
                  $scope.$broadcast('setScrollStatus', false);
                  vm.socket.removeListener('new-message/'+vm.messageForm.identifierId);
                  vm.socket.removeListener('group-typing-received/'+vm.group.identifierId);
              }

          }

          vm.joinGroup = function(){
            chatService.joinGroup({groupId: vm.group.id,userId:vm.chatId},successCb,errorCb);
            function successCb(result){
                getUserGroupStatus();
            }
            function errorCb(error){
                $log.debug("FAILURE getGroup:",error)
            }
          }

           vm.messageTypingInGroup = function() {
               $timeout.cancel(timer);
               var message = {};
               message.identifierId = vm.group.identifierId;
               message.friendName = vm.LoggedInUser.firstName;
               message.status   = 'MessageTyping'
               vm.socket.emit('group-message-typing',message);
           }

           vm.stopTypingInGroup = function() {
              timer = $timeout(function () {
                   var message = {};
                   message.identifierId = vm.group.identifierId;
                   message.friendName = vm.LoggedInUser.firstName;
                   message.status   = 'StopTyping';
                   vm.socket.emit('group-message-typing',message);
                }, 5000 );
           }

        vm.enableChat = function(){
            chatService.createUser({userId:sharedService.userDetails.id},successCb,errorCb);
            function successCb(result){
                getUser();
            }
            function errorCb(error){
                $log.debug("FAILURE enableChat:",error)
            }
        }

        function getFriendsAndGroups(){
            if((vm.role == 'ROLE_USER' || vm.role == 'ROLE_STAFF' || vm.role == 'ROLE_STAFF_HOD')&& vm.chatId ) {
                vm.updateStatus('online');
                vm.setSocketTenantId(sharedService.userDetails);
                vm.getFriends();
                vm.getGroup();
            }
        }
        vm.denyUser = function(user){
            chatService.denyUser({user:user,chatId:vm.chatId},successCb,errorCb);
            function successCb(result) {
                vm.openContactChat();
                vm.getFriends();
            }
            function errorCb(error){
            	$log.debug("FAILURE denyUser:",error);
            }
         };
         vm.openOrCloseDenyContent = function(status){
             vm.deny = status;
         }

        vm.searchUserOrGroup = function(searchTerm) {
            vm.getFriends(searchTerm);
            vm.getGroup(searchTerm);
         }

        function getUserGroupStatus() {
            chatService.getUserGroupStatus({groupId: vm.group.id, chatId:vm.chatId},successCb,errorCb);
                function successCb(result){
                    vm.isMemberOfGroup = result.entity;
                    vm.pageNo = 1;
                    if(vm.isMemberOfGroup) {
                        getMessageById(vm.messageForm.identifierId,vm.pageNo);
                    }
                }
                function errorCb(error){
                    $log.debug("FAILURE getUserGroupStatus:",error)
                }
        }

        function getUserFriendStatus(baseReferenceId) {
            chatService.getFriend({chatId: vm.chatId, baseReferenceId:baseReferenceId},successCb,errorCb);
                function successCb(result){
                     if(result.entity.subscriptionMode != undefined && result.entity.subscriptionMode != "none"){
                       vm.friend = result.entity;
                       setListenerChat();
                    } else if(result.entity.subscriptionMode != undefined && result.entity.subscriptionMode == "none"){
                        vm.friend.subscriptionMode = result.entity.subscriptionMode;
                    }
                }
                function errorCb(error){
                    $log.debug("FAILURE getUserFriendStatus:",error)
                }
        }
    }

})();