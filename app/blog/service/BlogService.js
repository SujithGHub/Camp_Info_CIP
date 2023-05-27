(function() {
    'use strict';

    /**
     * @ngdoc Service
     * @name BlogService
     * @module cip.blog
     * @require $log,
     * @description
     *
     * BlogService
     *
     * @author
     * @copyright
     */
  
    angular
        .module('cip.blog')
        .service('BlogService', BlogService);

    BlogService.$inject = [
        '$log',
        'BlogFactory'
     ];

    function BlogService($log,blogFactory) {
    	
    	this.saveBlog = function(params,successCb,errorCb){
    		blogFactory.$save(params,successCb,errorCb);
    	};
    	this.saveComment = function(params,successCb,errorCb){
    		blogFactory.saveComment(params,successCb,errorCb);
    	};
    	this.updateBlog = function(params,successCb,errorCb){
    		blogFactory.$update(params,successCb,errorCb);
    	};
    	this.getOtherBlog = function(params,successCb,errorCb){
    		blogFactory.getOtherBlog(params,successCb,errorCb);
    	};
    	this.getMyBlog = function(params,successCb,errorCb){
    		blogFactory.getMyBlog(params,successCb,errorCb);
    	};
    	this.deleteComment = function(params,successCb,errorCb){
    		blogFactory.deleteComment(params,successCb,errorCb);
    	};
    	this.deleteBlog = function(params,successCb,errorCb){
    		blogFactory.deleteBlog(params,successCb,errorCb);
    	};
    	this.deleteCommentReply = function(params,successCb,errorCb){
    		blogFactory.deleteCommentReply(params,successCb,errorCb);
    	};
    	this.getBlogComments = function(params,successCb,errorCb){
    		blogFactory.getBlogComments(params,successCb,errorCb);
    	};
    }

}());
