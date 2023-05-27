(function() {
	'use strict';
	/**
	 * @author Ashokrajan
	 */
	angular
	.module('cip.blog')
	.controller('BlogController', BlogController);

	BlogController.$inject = ['$log', 'BlogService', '$sce', '$mdDialog', '$scope', 'SharedService','$rootScope','$state'];

	/* @ngInject */
	function BlogController($log, blogService, $sce, $mdDialog, $scope, sharedService,$rootScope,$state) {
		var vm = this;
		vm.otherBlog 			= otherBlog;
		vm.myBlog 				= myBlog;
		vm.loggedInUser			= sharedService.userDetails;
		vm.roles				=sessionStorage.getItem('role');
		
		if(vm.roles == "ROLE_ADMIN"){
			vm.userFirstName = sessionStorage.getItem('instituteName');
		}else if(vm.roles == "ROLE_STAFF"){
			vm.userFirstName = sessionStorage.getItem('staffName');
		}else if(vm.roles == "ROLE_USER"){
			vm.userFirstName = sessionStorage.getItem('studentName');
		}
		
		
		$scope.editor = function(editorName){ 
			CKEDITOR.replace( editorName,
				{
				height:'20vh',
				language: 'en',
				toolbar : [
				           { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat' ] },
				           { name: 'insert', items: [ 'Smiley'] }
				           ]
					});
		
		};
		
		vm.clearEditor = function(editorId) {
			CKEDITOR.instances[editorId].setData('');
			CKEDITOR.instances[editorId].destroy(true);
		}

		$scope.blogEditorOptions = {resize_enabled:false,removePlugins:'elementspath', height:'30vh',language: 'en',
				toolbar: [
				          { name: 'document', items: [ 'Source', '-', 'NewPage', 'Preview', 'Print', '-', 'Templates' ] },
				          { name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
				          { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat' ] },
				          { name: 'insert', items: ['Smiley', 'Table', 'HorizontalRule', 'SpecialChar', 'PageBreak'] },
				          { name: 'styles', items: [ 'Format', 'Font', 'FontSize' ] },
				          { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
				          ]
		}
		
		vm.commentEditorOptions = {resize_enabled:false,
				removePlugins:'elementspath', height:'20vh',language: 'en',
				toolbar: [
				          { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat' ] },
				          { name: 'insert', items: [ 'Smiley'] },
				          ]
		}
		
		vm.showAdvanced = function(ev, formData) {
			$mdDialog.show({
				controller: BlogController,
				controllerAs: 'blogCtrl',
				templateUrl: '/app/blog/views/createBlog.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				bindToController: true,
				locals: {
					blogScope: formData
                },
				scope: $scope.$new(),
				clickOutsideToClose:false
			})
		};

		vm.cancel = function() {
			$mdDialog.cancel();
			$('#editor').empty();
		};

		vm.saveOrUpdateBlog = function(data) {
			$mdDialog.hide();
			if(data.id){
				blogService.updateBlog(data, successCb, errorCb);
			} 
			else {
				data.postedBy = vm.userFirstName;
				blogService.saveBlog(data, successCb, errorCb);
			}
			function successCb(result) {
				myBlog();
				$log.debug("SUCCESS saveOrUpdateBlog",result);
			}
			function errorCb(error) {
				$log.debug("FAILURE saveOrUpdateBlog:",error);
			}
		};
	
		vm.saveComment = function(formData,commentData,$event,editorId){
			if(commentData == undefined) {
				var comment = {};
			} else {
				var comment = commentData;
			}
			comment.blog=formData;
			comment.comment = CKEDITOR.instances[editorId].getData();
			var currentDiv = $event.target;
			comment.commentedBy = vm.userFirstName;
			blogService.saveComment(comment, successCb, errorCb)
			function successCb(result) {
				$("#comment").val("");
				vm.getBlogComments(formData.id);
				$(currentDiv).closest(".wc-comment").find("textarea[name='comment']").val("");
				CKEDITOR.instances[editorId].setData('');
				CKEDITOR.instances[editorId].destroy();
				$log.debug("SUCCESS saveComment",result);
			}
			function errorCb(error) {
				$log.debug("FAILURE saveComment:",error);
			}
		}
		
		vm.saveCommentReply = function(blog,comment,formData,$event,editorId){
			comment.commentReply=[];
			var commentReply={};
			commentReply.comment = CKEDITOR.instances[editorId].getData();
			if(commentReply.comment == null || commentReply.comment == ""){
				$('#commentReplyError').show();
				$scope.reply= true;
				return;
			}
			commentReply.commentedBy = vm.userFirstName;
			comment.commentReply.push(commentReply);
			
			blogService.saveComment(comment, successCb, errorCb)
			function successCb(result) {
				vm.getBlogComments(blog.id);
				vm.clearEditor(editorId);
				$log.debug("SUCCESS saveCommentReply",result);
			}
			function errorCb(error) {
				$log.debug("FAILURE saveCommentReply:",error);
			}
		}
		
		
		vm.updateCommentReply = function(blog,comment,commentReply,$event,editorId){
			commentReply.comment = CKEDITOR.instances[editorId].getData();
			var replyList = comment.commentReply;
			for(var i=0; i<replyList.length;i++) {
				if(replyList[i].id == commentReply.id) {
					replyList[i].flag = true;
				}
			}
			blogService.saveComment(comment, successCb, errorCb)
			function successCb(result) {
				vm.getBlogComments(blog.id);
				vm.clearEditor(editorId);
				$log.debug("SUCCESS updateCommentReply",result);
			}
			function errorCb(error) {
				$log.debug("FAILURE updateCommentReply:",error);
			}
		}
		 

		vm.deleteBlog = function(data){
			var confirm = $mdDialog.confirm()
			.title('Are you sure want to delete?')
			.textContent('You will not be able to recover information!')
			.ok('yes, Please it!')
			.cancel('Cancel');

			$mdDialog.show(confirm).then(function() {
				blogService.deleteBlog(data, successCb, errorCb);
				function successCb(result){
					myBlog();
					$log.debug("SUCCESS deleteBlog:",result)
				}
				function errorCb(error){
					$log.debug("FAILURE deleteBlog:",error)
				}
			});
		}

		vm.deleteComment = function(comment) {
			var confirm = $mdDialog.confirm()
			.title('Are you sure want to delete?')
			.textContent('You will not be able to recover information!')
			.ok('yes, Please it!')
			.cancel('Cancel');

			$mdDialog.show(confirm).then(function() {
				blogService.deleteComment(comment, successCb, errorCb);
				function successCb(result) {
					vm.getBlogComments(comment.blog.id);
					$log.debug("SUCCESS deleteComment",result);
				}
				function errorCb(error) {
					$log.debug("FAILURE deleteComment:",error)
				}
			});
		};

		vm.deleteCommentReply = function(comment,commentReply,blog) {

			blogService.deleteCommentReply(commentReply, successCb, errorCb);
			function successCb(result) {
				vm.getBlogComments(comment.blog.id);
				$log.debug("SUCCESS deleteCommentReply",result);
			}
			function errorCb(error) {
				$log.debug("FAILURE deleteCommentReply:",error)
			}
		};
		
		function otherBlog() {
			vm.wallCommenting = false;
			vm.addBlog = false;
			vm.blogList = [];
			blogService.getOtherBlog(successCb, errorCb);
			function successCb(result) {
				//$state.reload();
				vm.blogList = result.entityList;
				for(var i=0; i< vm.blogList.length; i++){
					vm.blogList[i].html = $sce.trustAsHtml(vm.blogList[i].content);
				}
				$rootScope.blogList = vm.blogList;
				$log.debug("SUCCESS getOtherBlog",result);
			}
			function errorCb(error) {
				$log.debug("FAILURE getOtherBlog:",error)
			}
		};
		
		function myBlog() {

			vm.wallCommenting = false;
			vm.blogList = [];
			blogService.getMyBlog(successCb, errorCb);

			function successCb(result) {
				//$state.reload();
				vm.blogList = result.entityList;
				for(var i=0; i< vm.blogList.length; i++){
					vm.blogList[i].html = $sce.trustAsHtml(vm.blogList[i].content);
				}
				$rootScope.blogList = vm.blogList;
				vm.addBlog = true;
				$log.debug("SUCCESS getMyBlog",result);
			}
			function errorCb(error) {
				$log.debug("FAILURE getMyBlog:",error)
			}
		};

		vm.getBlogComments = function(id) {
			vm.temp=id;
			blogService.getBlogComments({id}, successCb, errorCb);
			function successCb(result) {
				vm.commentId = "";
				vm.commentList=result.entityList;
				for(var i=0;i<vm.commentList.length;i++){
					vm.commentList[i].html = $sce.trustAsHtml(vm.commentList[i].comment);
					angular.forEach(vm.commentList[i].commentReply, function(value, key){
						value.html = $sce.trustAsHtml(value.comment);
					});
				}
				$log.debug("SUCCESS getBlogComments",result);
			}
			function errorCb(error) {
				$log.debug("FAILURE getBlogComments:",error)
			}
		};

	}
})();



