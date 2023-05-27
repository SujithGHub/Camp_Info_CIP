(function() {
	'use strict';
	/**
	 * @author Ashokrajan
	 */
	angular
	.module('cip.album')
	.controller('AlbumController', AlbumController);

	AlbumController.$inject = ['$log', '$http', 'AlbumService', 'CommonService' , '$mdDialog', '$scope', '$compile', '$mdToast'];

	/* @ngInject */
	function AlbumController($log, $http, albumService, commonService, $mdDialog, $scope, $compile, $mdToast) {
        var vm = this;

        vm.init = init;
        vm.initViewAlbum = initViewAlbum;
        vm.mScope = {};
        vm.getAlbumById = getAlbumById;
        vm.albumImageShow = false;
        vm.albumViewHtml = albumViewHtml;

        vm.albumList = [];
        vm.viewMore = viewMore;
        var start = 0;
        var limit = 20;
        var currentView = 1;
        var recordsPerView = 20;

        function albumViewHtml(name) {
            let className = name.replace(/[^\w]/gi, '');
            $("#albumContent").empty();
            var html = "<div class='"+className+"'>" 
            for (var i = 0; i < vm.albumImageList.length; i++) {
                html += '<a class="lightbox" href="' + vm.albumImageList[i].path + '" style="margin-right: 5px;">'
                    + '<img src="' + vm.albumImageList[i].path + '"/></a>';
            }
           html+= "</div>"
            $("#albumContent").append(html);
            var content = $("#albumContent");
            $compile(content.contents())($scope);
            var script = "<script>baguetteBox.run('."+className+"')</script>"
            $("#albumContent").append(script);
            let scriptContent = $("#albumContent");
            $compile(scriptContent.contents())($scope);
        }

        $scope.updateOrDeleteAlbum = function (type) {
            setTimeout(function () {
                getValue(type);
            }, 0);
        };

        vm.saveOrUpdateAlbum = function (formData) {
            var namesArr = [];
            var data = new FormData();
            $('.fileInput').each(function () {
                var j = 1;
                for (var i = 0; i < this.files.length; i++) {
                    namesArr.push(this.files[i].name);
                    data.append("file_" + j, this.files[i]);
                    j++;
                }
            });
            if (namesArr.length == 0) {
                data.append("length", 0);
            } else {
                data.append("length", namesArr.length);
            }
            data.append("name", formData.name);
            data.append("description", formData.description);
            data.append("status", formData.status);
            if (formData.id) {
                data.append("id", formData.id);
                $http({
                    method: 'post',
                    url: commonService.baseApi +'/albums/update',
                    headers: {'Content-Type': undefined},
                    data: data,
                    transformRequest: function (data, headersGetterFunction) {
                        return data;
                    }
                }).success(function (data, status) {
                    var errorData = [];
                    errorData = data;
                    if (errorData.UploadFileSize != undefined) {
                        var confirm = $mdDialog.confirm()
                            .title('Insufficient Memory Space!')
                            .textContent("The uploaded file size is " + errorData.UploadFileSize + "MB." + " The remaining storage is " + errorData.StorageLeft + "MB" + " Click yes to perform auto delete")
                            .ok('yes')
                            .cancel('Cancel');
                        $mdDialog.show(confirm).then(function () {
                            albumService.autoDeleteAlbum(data, successCb, errorCb);

                            function successCb(result) {
                                init();
                                $log.debug("SUCCESS deleteAlbum:", result)
                            }

                            function errorCb(error) {
                                $log.debug("FAILURE deleteAlbum:", error)
                            }
                        });
                    } else {
                        $mdToast.show({
                            template: '<md-toast class="md-toast ng-scope md-dark-teal-theme md-top"><div class="md-toast-content success"><span flex="" role="alert" aria-relevant="all" aria-atomic="true" class="ng-binding flex">Album update successfully !</span></div></md-toast>',
                            hideDelay: 5000,
                            position: 'top'
                        });
                        $('.fileInput').each(function () {
                            this.value = "";
                        });
                        init();
                    }
                })
            } else {
                data.append("id", "");
                $http({
                    method: 'post',
                    url: commonService.baseApi +'/albums/save',
                    headers: {'Content-Type': undefined},
                    data: data,
                    transformRequest: function (data, headersGetterFunction) {
                        return data;
                    }
                }).success(function (data, status) {
                    var errorData = [];
                    errorData = data;
                    if (errorData.UploadFileSize != undefined) {
                        var confirm = $mdDialog.confirm()
                            .title('Insufficient Memory Space!')
                            .textContent("The uploaded total file size is " + errorData.UploadFileSize + "MB" + " The remaining storage is " + errorData.StorageLeft + "MB" + " Please remove some files")
                            .ok('yes, Please it!')
                            .cancel('Cancel');
                        $mdDialog.show(confirm).then(function () {
                            albumService.autoDeleteAlbum(data, successCb, errorCb);

                            function successCb(result) {
                                init();
                                $log.debug("SUCCESS deleteAlbum:", result)
                            }

                            function errorCb(error) {
                                $log.debug("FAILURE deleteAlbum:", error)
                            }
                        });
                    } else {
                        $mdToast.show({
                            template: '<md-toast class="md-toast ng-scope md-dark-teal-theme md-top"><div class="md-toast-content success"><span flex="" role="alert" aria-relevant="all" aria-atomic="true" class="ng-binding flex">Album save successfully !</span></div></md-toast>',
                            hideDelay: 5000,
                            position: 'top'
                        });
                        $('.fileInput').each(function () {
                            this.value = "";
                        });
                        init();
                    }
                })
            }
        }

        vm.deleteAlbum = function (data) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure want to delete?')
                .textContent('You will not be able to recover information!')
                .ok('yes, Please it!')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function () {
                albumService.deleteAlbum(data.id, successCb, errorCb);

                function successCb(result) {
                    init();
                    $log.debug("SUCCESS deleteAlbum:", result)
                }

                function errorCb(error) {
                    $log.debug("FAILURE deleteAlbum:", error)
                }
            });
        }

        function getValue(type) {
            var data = {};
            var table = $('#albumDataTable').dataTable();
            $(".selected", table.fnGetNodes()).each(function () {
                data = table.fnGetData($(this).parents())
                $(this).removeClass('selected');
            });
            if (type == "update") {
                getAlbumById(data.id,data.name);
                vm.initData = data;
                $scope.$broadcast('modelForm');
            }
            else {
                vm.deleteAlbum(data);
            }
        }

        function getAlbumById(id,name) {
            albumService.getAlbumById({id}, successCb, errorCb)

            function successCb(result) {
                vm.albumImageShow = true;
                vm.mScope.ImageList = result.entityList;
                vm.albumImageList = result.entityList;
                albumViewHtml(name);
                $log.debug("SUCCESS getAlbumById:", result)
            }

            function errorCb(error) {
                $log.debug("FAILURE getAlbumById:", error)
            }
        }


        vm.mScope.removeImage = function (albumPicture, albumId) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure want to delete?')
                .textContent('You will not be able to recover information!')
                .ok('yes, Please it!')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function () {
                albumService.removeImage(albumPicture, successCb, errorCb)

                function successCb(result) {
                    getAlbumById(albumId)
                    $log.debug("SUCCESS removeImage:", result)
                }

                function errorCb(error) {
                    $log.debug("FAILURE removeImage:", error)
                }
            });
        }

        function initViewAlbum() {
            vm.noOfRecords ="";
            albumService.getViewAlbumList({start : start, limit : limit},successCb, errorCb);
            function successCb(result) {
                vm.totalCount = result.totalCount;
                vm.albumList.push.apply(vm.albumList, result.entityList);
                vm.noOfRecords += vm.albumList.length;
                $log.debug("SUCCESS getViewAlbumList:", result)

            }

            function errorCb(error) {
                $log.debug("FAILURE getViewAlbumList:", error)
            }
        }

        vm.mScope.readFile = function (element) {
            $scope.$apply(function (scope) {
                if ($(element)[0].target.files.length) {
                    vm.mScope.upload = {
                        fileName: $(element)[0].target.files[0].name,
                        fileLength: $(element)[0].target.files.length
                    };
                }
            });
        };

        vm.mScope.clearFile = function () {
            vm.mScope.upload = "";
            $("#fileInput").val('');
        };

        function init() {
            albumService.initTable('albumDataTable');
        };

        function viewMore() {
            if (currentView < numOfViews()) {
                currentView++;
            }
            start = ((currentView-1) * recordsPerView);
            initViewAlbum();
        }

        function numOfViews() {
            return Math.ceil(vm.totalCount / recordsPerView);
        }

    }

})();