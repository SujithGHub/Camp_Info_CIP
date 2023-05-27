(function() {
    'use strict';
angular.module("cip.common").directive('examFormModal', ['$http', '$compile',
                                                     function($http, $compile) {
	return {
		scope: {
			mScope: '=',
			initData: '=',
			mTitle: '@',
			template: '=',
			templateUrl: '@',
			okButtonText: '@',
			cancelButtonText: '@',
			closeOnSubmit: '@',
			formSubmit: '&',
			formInit: '&',
			formCancel: '&',
			showModelForm: '@'
		},
		compile: function(element, cAtts) {
			var template, $element, loader;

			template =  "<div class='md-dialog-container fade' data-backdrop='static' id='myModal' tabindex='-1' role='dialog' aria-label='Class' aria-labelledby='myModalLabel' aria-hidden='true' >"+
			"<div class='md-dialog md-transition-in md-content-overflow' style='width:750px'>"+
			"<form name='modelForm' role='form' novalidate style='overflow: hidden;'>" +
			"<div ng-show='mTitle' class='md-toolbar-tools modal-header' style='height: 50px'>" +
			"<h2 style='color: white;'>{{::mTitle}}</h2>" +
			"<span flex></span>"+
			"<button type='button' class='md-icon-button md-button md-dark-teal-theme md-ink-ripple' data-dismiss='modal' aria-hidden='true' ng-click='close()'> <i class='zmdi zmdi-close zmdi-hc-fw ' style='color: white;'></i></button>" +
			"</div>" +
			"<div ng-include='templateUrl? templateUrl: null' style='overflow: auto;'></div>" +
			"<div class='md-actions'>" +
			"<button type='submit' ng-click='modelForm.$valid ? submit(mScope.mForm) : null;' class='btn btn-danger' data-ng-show='okButtonText'>{{::okButtonText}}</button>" +
			"<button type='button' class='btn btn-cancel' ng-click='close()'>" +
			"<span>CANCEL</span></button>" +
			"</div>" +
			"</form>" +
			"<div>"+
			"</div>";
			// return the Link function
			return function(scope, element, lAtts) {
				
				$element = null
				scope.modelForm = true;

				scope.submit = function (mForm) {
					scope.formSubmit({mForm:mForm});
					if (scope.closeOnSubmit==undefined && scope.closeOnSubmit !='false'){
						scope.close()
					}
				};
				scope.close = function() {
					scope.mScope.upload = "";
					scope.mScope.ImageList = "";
					scope.initData = {};
					$element.modal('hide');
					$element.remove();
				};

				scope.init_mForm = function (mForm) {
					scope.mScope.mForm ={};
					scope.$watch("scope.initData",function() {
						if(scope.initData && (scope.initData.id || scope.initData.department))
							scope.mScope.mForm=angular.copy(scope.initData)
						else
							scope.mScope.mForm.status = 'ACTIVE';
					});
				};
				
				scope.showModel = function(mForm) {
					scope.init_mForm();
					$element = $($compile(template)(scope));
					if (scope.template) {
						$element.find('.modal-body').append($compile(scope.template)(scope));
						scope.modalWidth = { 'width': '40%' };
					}
					$element.modal('show');
				}

				scope.$on('examModelForm', function(e) {
					scope.showModel();
				});

				element.on('click', function(e) {
					e.preventDefault();
					scope.showModel();
				});
				
			};
		}
	};
}
])
})();