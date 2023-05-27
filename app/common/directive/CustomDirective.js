(function() {
    'use strict';
    /**
     * @author Ashokrajan
     */
    angular
        .module('cip.common')
        .directive(
            'toggleSubmenu',
            function() {

                return {
                    restrict: 'A',
                    link: function(scope, element, attrs) {
                        element.click(function() {
                            element.parent().toggleClass('toggled');
                            element.parent().find('ul').stop(true,
                                false).slideToggle(200);
                        })
                    }
                }
            })
        .directive('sglclick', ['$parse', function($parse) {
            return {
                restrict: 'A',
                link: function(scope, element, attr) {
                    var fn = $parse(attr['sglclick']);
                    var delay = 250,
                        clicks = 0,
                        timer = null;
                    element.on('click', function(event) {
                        clicks++; // count clicks
                        if (clicks === 1) {
                            timer = setTimeout(function() {
                                scope.$apply(function() {
                                    fn(scope, {
                                        $event: event
                                    });
                                });
                                clicks = 0; // after action performed, reset
                                // counter
                            }, delay);
                        } else {
                            clearTimeout(timer); // prevent single-click
                            // action
                            clicks = 0; // after action performed, reset
                            // counter
                        }
                    });
                }
            };
        }])
        .directive(
            'initializeOwl',
            function() {
                return {
                    restrict: 'A',
                    link: function(scope, element, attr) {
                        if (scope.$last === true) {
                            element
                                .ready(function() {
                                    $("#" + attr.initializeOwl)
                                        .owlCarousel({
                                            autoPlay: false, // Set
                                            // AutoPlay
                                            // to 3
                                            // seconds
                                            items: 5,
                                            itemsDesktop: [
                                                1199,
                                                3
                                            ],
                                            itemsDesktopSmall: [
                                                979,
                                                3
                                            ],
                                            pagination: false,
                                            navigation: true,
                                            navigationText: [
                                                '<i class="zmdi zmdi-chevron-left zmdi-hc-3x"></i>',
                                                '<i class="zmdi zmdi-chevron-right zmdi-hc-3x"></i>'
                                            ]
                                        });
                                });
                        }
                    }
                }
            })
        .directive(
            'numbersOnly',
            function() {
                return {
                    require: 'ngModel',
                    link: function(scope, element, attr, ngModelCtrl) {
                        function fromUser(text) {
                            if (text) {
                                var transformedInput = text.replace(
                                    /[^0-9]/g, '');

                                if (transformedInput !== text) {
                                    ngModelCtrl
                                        .$setViewValue(transformedInput);
                                    ngModelCtrl.$render();
                                }
                                return transformedInput;
                            }
                            return undefined;
                        }
                        ngModelCtrl.$parsers.push(fromUser);
                    }
                };
            })
        .directive('loading', ['$http', '$location', function($http, $location) {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    scope.isLoading = function() {
                        return $http.pendingRequests.length > 0;
                    };
                    scope.$watch(scope.isLoading, function(status) {
                        if (status) {
                            element.show();
                        } else {
                            element.hide();
                            $(".content").mCustomScrollbar({
                                theme: "dark-3",
                                axis: "y"
                            });
                        }
                    });
                }
            };
        }])
        .directive('datepicker', function($parse) {
            return function(scope, element, attrs, controller) {
                var ngModel = $parse(attrs.ngModel);
                $(function() {
                    element.Zebra_DatePicker({
                        format: 'd/M/Y',
                        default_position: "below",
                        show_icon: false,
                        onClear: function() {
                            scope.$apply(function(scope) {
                                ngModel.assign(scope, '');
                            });
                        },
                        onSelect: function(dateText, inst) {
                            scope.$apply(function(scope) {
                                ngModel.assign(scope, dateText);
                            });
                        }
                    });
                });
            }
        })
        .directive('fullCalendar', function() {
            return {
                restrict: 'A',
                link: function(scope, element) {
                    element.fullCalendar({
                        contentHeight: 'auto',
                        theme: true,
                        header: {
                            right: '',
                            center: 'prev, title, next',
                            left: ''
                        },
                        defaultDate: '2014-06-12',
                        editable: true,
                        events: [{
                            title: 'All Day',
                            start: '2014-06-01',
                            className: 'bgm-cyan'
                        }, {
                            title: 'Long Event',
                            start: '2014-06-07',
                            end: '2014-06-10',
                            className: 'bgm-orange'
                        }, {
                            id: 999,
                            title: 'Repeat',
                            start: '2014-06-09',
                            className: 'bgm-lightgreen'
                        }, {
                            id: 999,
                            title: 'Repeat',
                            start: '2014-06-16',
                            className: 'bgm-blue'
                        }, {
                            title: 'Meet',
                            start: '2014-06-12',
                            end: '2014-06-12',
                            className: 'bgm-teal'
                        }, {
                            title: 'Lunch',
                            start: '2014-06-12',
                            className: 'bgm-gray'
                        }, {
                            title: 'Birthday',
                            start: '2014-06-13',
                            className: 'bgm-pink'
                        }, {
                            title: 'Google',
                            url: 'http://google.com/',
                            start: '2014-06-28',
                            className: 'bgm-bluegray'
                        }]
                    });
                }
            }
        })

    // =========================================================================
    // MAIN CALENDAR
    // =========================================================================

    .directive(
        'calendar',
        function($compile) {
            return {
                restrict: 'A',
                scope: {
                    select: '&',
                    actionLinks: '=',
                },
                link: function(scope, element, attrs) {

                    var date = new Date();
                    var d = date.getDate();
                    var m = date.getMonth();
                    var y = date.getFullYear();

                    // Generate the Calendar
                    element.fullCalendar({
                        header: {
                            right: '',
                            center: 'prev, title, next',
                            left: ''
                        },

                        theme: true, // Do not remove this as it
                        // ruin the
                        // design
                        selectable: true,
                        selectHelper: true,
                        editable: true,

                        // Add Events
                        events: [{
                            title: 'Hangout with friends',
                            start: new Date(y, m, 1),
                            allDay: true,
                            className: 'bgm-cyan'
                        }, {
                            title: 'Meeting with client',
                            start: new Date(y, m, 10),
                            allDay: true,
                            className: 'bgm-red'
                        }, {
                            title: 'Repeat Event',
                            start: new Date(y, m, 18),
                            allDay: true,
                            className: 'bgm-blue'
                        }, {
                            title: 'Semester Exam',
                            start: new Date(y, m, 20),
                            allDay: true,
                            className: 'bgm-green'
                        }, {
                            title: 'Soccor match',
                            start: new Date(y, m, 5),
                            allDay: true,
                            className: 'bgm-purple'
                        }, {
                            title: 'Coffee time',
                            start: new Date(y, m, 21),
                            allDay: true,
                            className: 'bgm-orange'
                        }, {
                            title: 'Job Interview',
                            start: new Date(y, m, 5),
                            allDay: true,
                            className: 'bgm-dark'
                        }, {
                            title: 'IT Meeting',
                            start: new Date(y, m, 5),
                            allDay: true,
                            className: 'bgm-cyan'
                        }, {
                            title: 'Brunch at Beach',
                            start: new Date(y, m, 1),
                            allDay: true,
                            className: 'bgm-purple'
                        }, {
                            title: 'Live TV Show',
                            start: new Date(y, m, 15),
                            allDay: true,
                            className: 'bgm-orange'
                        }, {
                            title: 'Software Conference',
                            start: new Date(y, m, 25),
                            allDay: true,
                            className: 'bgm-blue'
                        }, {
                            title: 'Coffee time',
                            start: new Date(y, m, 30),
                            allDay: true,
                            className: 'bgm-orange'
                        }, {
                            title: 'Job Interview',
                            start: new Date(y, m, 30),
                            allDay: true,
                            className: 'bgm-dark'
                        }, ],

                        // On Day Select
                        select: function(start, end, allDay) {
                            scope.select({
                                start: start,
                                end: end
                            });
                        }
                    });

                    // Add action links in calendar header
                    element.find('.fc-toolbar').append(
                        $compile(scope.actionLinks)(scope));
                }
            }
        })

    // Change Calendar Views
    .directive(
            'calendarView',
            function() {
                return {
                    restrict: 'A',
                    link: function(scope, element, attrs) {
                        element.on('click', function() {
                            $('#calendar').fullCalendar('changeView',
                                attrs.calendarView);
                        })
                    }
                }
            })
        .directive(
            'customOnChange',
            function() {
                return {
                    restrict: 'A',
                    link: function(scope, element, attrs) {
                        var onChangeHandler = scope
                            .$eval(attrs.customOnChange);
                        element.bind('change', onChangeHandler);
                    }
                };
            })
        .filter('to_trusted', ['$sce', function($sce) {
            return function(text) {
                return $sce.trustAsHtml(text);
            };
        }])

    .directive('ngMax', function() {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function(scope, elem, attr, ctrl) {
                    scope.$watch(attr.ngMax, function() {
                        ctrl.$setViewValue(ctrl.$viewValue);
                    });
                    var maxValidator = function(value) {
                        var max = scope.$eval(attr.ngMax) || Infinity;
                        if (!isEmpty(value) && value > max) {
                            ctrl.$setValidity('ngMax', false);
                            return undefined;
                        } else {
                            ctrl.$setValidity('ngMax', true);
                            return value;
                        }
                    };

                    ctrl.$parsers.push(maxValidator);
                    ctrl.$formatters.push(maxValidator);
                }
            };
        })
        .directive('ngMin', function() {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function(scope, elem, attr, ctrl) {
                    scope.$watch(attr.ngMin, function() {
                        ctrl.$setViewValue(ctrl.$viewValue);
                    });
                    var minValidator = function(value) {
                        var min = scope.$eval(attr.ngMin) || 0;
                        if (!isEmpty(value) && value < min) {
                            ctrl.$setValidity('ngMin', false);
                            return undefined;
                        } else {
                            ctrl.$setValidity('ngMin', true);
                            return value;
                        }
                    };

                    ctrl.$parsers.push(minValidator);
                    ctrl.$formatters.push(minValidator);
                }
            };
        })
        .directive(
            "fileDragAndDrop",
            function($parse) {
                return {
                    restrict: 'A',
                    scope: {
                        onDrop: '&onDrop'
                    },
                    link: fileDropzoneLink
                };

                function fileDropzoneLink(scope, element, attrs) {
                    element.bind('dragover', processDragOverOrEnter);
                    element.bind('dragenter', processDragOverOrEnter);
                    element.bind('dragend', endDragOver);
                    element.bind('dragleave', endDragOver);
                    element.bind('drop', dropHandler);
                    element.bind('click', clickHandler);
                    var filesExtensions = [];
                    $("#dragAndDropError").remove();
                    // When a file is dropped
                    function loadFile(files) {
                        if (attrs.acceptFormat) {
                            if (fileValidation(files)) {
                                scope.onDrop({
                                    el: files
                                });
                            }
                        } else {
                            scope.onDrop({
                                el: files
                            });
                        }
                    };

                    function fileValidation(files) {
                        var count = 0;
                        var filesLength = files.length;
                        var acceptFormat = attrs.acceptFormat
                            .split(",");
                        for (var fileIndex = 0; fileIndex < files.length; fileIndex++) {
                            for (var index = 0; index < acceptFormat.length; index++) {
                                if (files[fileIndex].type === acceptFormat[index]) {
                                    count += 1;
                                }
                            }
                        }
                        if (count == filesLength) {
                            $("#dragAndDropError").remove();
                            return true;
                        } else {
                            $("#dragAndDropError").remove();
                            $('#dropzone')
                                .after(
                                    '<div id="dragAndDropError" class="has-error"><small class="errormessage">The file is invalid,or not supported.</small></div>');
                        }
                        return false;
                    }

                    // click file upload
                    function clickHandler(angularEvent) {
                            angular.element(angularEvent.target).siblings(
                                '#upload').trigger('click');
                        }
                        // Drag and Drop Upload
                    function dropHandler(angularEvent) {
                        var event = angularEvent.originalEvent || angularEvent;
                        var files = event.dataTransfer.files;
                        event.preventDefault();
                        loadFile(files);
                        element.removeClass('is-dragover');
                    }

                    function processDragOverOrEnter(angularEvent) {
                        var event = angularEvent.originalEvent || angularEvent;
                        if (event) {
                            event.preventDefault();
                        }
                        event.dataTransfer.effectAllowed = 'copy';
                        element.addClass('is-dragover');
                        return false;
                    }

                    function endDragOver() {
                        element.removeClass('is-dragover');
                    }
                }
            }).directive('fileModel', ['$parse', function($parse) {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    var model = $parse(attrs.fileModel);
                    var modelSetter = model.assign;

                    element.bind('change', function() {
                        scope.$apply(function() {
                            modelSetter(scope, element[0].files[0]);
                        });
                    });
                }
            };
        }]).directive('ngRightClick', function($parse) {
            return function(scope, element, attrs) {
                var fn = $parse(attrs.ngRightClick);
                element.bind('contextmenu', function(event) {
                    scope.$apply(function() {
                        event.preventDefault();
                        fn(scope, {
                            $event: event
                        });
                    });
                });
            };
        }).directive('imageOnError', function() {
            return {
                link: function(scope, element, attrs) {
                    var defaultSrc = attrs.src;
                    element.bind('error', function() {
                        var extension = attrs.src.replace(/\\/g, "/").match(/([^\/]*)\/*$/)[1].substring(37).toLowerCase();
                        if (extension === "pdf") {
                            element.attr('src', "../../assets/images/pdf.png")
                        } else if (extension === "jpg") {
                            element.attr('src', "../../assets/images/no-image.png")
                        } else {
                            element.attr('src', "../../assets/images/text-file-icon.jpg")
                        }
                    });
                }
            }
        }).directive('dblClick',
      function () {

        const DblClickInterval = 300; //milliseconds

        var firstClickTime;
        var waitingSecondClick = false;

        return {
          restrict: 'A',
          link: function (scope, element, attrs) {
            element.bind('click', function (e) {

              if (!waitingSecondClick) {
                firstClickTime = (new Date()).getTime();
                waitingSecondClick = true;

                setTimeout(function () {
                  waitingSecondClick = false;
                }, DblClickInterval);
              }
              else {
                waitingSecondClick = false;

                var time = (new Date()).getTime();
                if (time - firstClickTime < DblClickInterval) {
                  scope.$apply(attrs.dblClick);
                }
              }
            });
          }
        };
      }).directive('whenScrolled', ['$timeout', function($timeout) {
        return  {
            restrict: 'A',
            scope :{  callback : '&',
                options: '=',
                pageNo:'='} ,
            link: function (scope, element) {
                var raw = element[0];
                var sh;
                var status = false;
                element.bind('scroll', function (event) {
                    if (raw.scrollTop <= 70 && status) {
                         sh = raw.scrollHeight;
                         scope.callback();
                        status = false;
                       // element.unbind('scroll');
                    }
                });
                function setScrollTop(){
                    $timeout(function() {
                        raw.scrollTop = raw.scrollHeight - sh;
                        status = true;
                    });
                }
                function setScrollBottom(){
                    raw.scrollTop = raw.scrollHeight * 0.4;
                }
                scope.$on('setScrollTop', function(event, data){
                    setScrollTop();
                })
                scope.$on('setScrollStatus', function(event, data){
                    $timeout(function() {
                        status = data;
                    });

                })
            }
        };}]);

    function isEmpty(value) {
        return angular.isUndefined(value) || value === '' || value === null || value !== value;
    }

})();
