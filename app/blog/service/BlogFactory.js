(function() {
	'use strict';

    angular
        .module('cip.blog')
        .factory('BlogFactory', BlogFactory);

    BlogFactory.$inject = [
        '$resource',
        'CommonService'
    ];

    function BlogFactory($resource,commonService) {
    	
        return $resource( commonService.baseApi+'/blog', {}, {
        	$save: {
                url:  commonService.baseApi+'/blog/save',
                method: 'POST'
            },
            $update: {
                url:  commonService.baseApi+'/blog/update',
                method: 'POST'
            },
            saveComment: {
                url:  commonService.baseApi+'/blog/comment',
                method: 'POST'
            },
        	getOtherBlog: {
                url:  commonService.baseApi+'/blog/other',
                method: 'GET'
            },
            getMyBlog: {
                url:  commonService.baseApi+'/blog/my',
                method: 'GET'
            },
            deleteComment : {
            	url:  commonService.baseApi+'/blog/comment',
                method: 'PUT'
            },
            deleteBlog : {
            	url:  commonService.baseApi+'/blog/delete',
                method: 'PUT'
            },
            deleteCommentReply : {
            	url:  commonService.baseApi+'/blog/comment/reply',
                method: 'PUT'
            },
            getBlogComments : {
            	url:  commonService.baseApi+'/blog/comments/:id',
            	method:'GET',
            	params : {
            		id : '@id'
            	}
            }
        });
    }
})();