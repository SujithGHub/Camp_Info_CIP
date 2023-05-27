angular.module("cip.common").directive('reportView', ['$http', '$compile', 'CommonService', function ($http, $compile, commonService) {
    return {
        scope: {
            reportPath: '@',
            reportParam: '=',
            reportTitle: '@',
        },
        compile: function (element, cAtts) {

            var template, $element, loader;
            template = "<div class='modal fade' id='reportModel' tabindex='-1' " +
                "role='dialog' aria-labelledby='myModalLabel' aria-hidden='true' style='padding-right:0px'>" +
                "<div class='modal-dialog' style='width: 100%; height: 100%; margin: 0px; padding: 10px;overflow: hidden;'>" +
                "<div class='modal-content' style='height: 100%;border: none;'>" +
                "<div class='row' style='margin-left: 0px;margin-right: 0px;width: 100%;height: 100%;'>" +
                "<div class='col-lg-2 col-md-2 col-sm-2' style='border-right: 1px solid #cfc7c0;height:100%;padding: 10px 15px; overflow: auto;' ng-if='visible' ng-hide=reportType=='subReport'>" +
                "<p style='margin-top: 8px;'><b>Options</b></p>" +
                "<div style='padding-top: 25px;' data-ng-repeat='parameter in parameters'>" +
                "<p ng-if=parameter.type!='hidden'><b>{{parameter.name.replaceAll('_',' ')}}</b></p>" +
                "<input class='form-control' datepicker class='md-input' type='text' name='fromDate'  ng-model='parameter.value' ng-if=parameter.type=='Date'>" +
                "<select class='form-control' ng-model='parameter.value' ng-if=parameter.type=='standard' ng-change ='getsection(parameter.value);getSubject(parameter.value);getExam(parameter.value)' ng-options='standard.name for standard in standards'></select>" +
                "<select class='form-control' ng-model='parameter.value' ng-if=parameter.type=='section' ng-change='setSection(parameter.value)' ng-options='section.sectionName for section in sections'></select>" +
                "<select class='form-control' ng-model='parameter.value' ng-if=parameter.type=='department' ng-change ='getYearByDepartment(parameter.value);getCurrentAcademic()' ng-options='department.displayName for department in departments'></select>" +
                "<select class='form-control' ng-model='parameter.value' ng-if=parameter.type=='year'  ng-change ='getsection(parameter.value);getSemesterByClassYear(parameter.value)' ng-options='year.name for year in years'></select>" +
                "<select class='form-control' ng-model='parameter.value' ng-if=parameter.type=='semester' ng-change ='getExamForCollege(year,parameter.value,currentAcademic,section);getSubjectsBySemester(year,parameter.value)' ng-options='semester for semester in semestersLists'></select>" +
                "<select class='form-control' ng-model='parameter.value' ng-if=parameter.type=='subject' ng-options='subject.subjectName for subject in subjects'></select>" +
                "<select class='form-control' ng-model='parameter.value' ng-if=parameter.type=='academic' ng-options='academic.academicYear for academic in academics'></select>" +
                "<select class='form-control' ng-model='parameter.value' ng-if=parameter.type=='exam' ng-options='exam.examName for exam in exams'></select>" +
                "<select class='form-control' ng-model='parameter.value' ng-if=parameter.type=='examination' ng-change ='getExamPapers(parameter.value)' ng-options='exam.examName for exam in exams'></select>" +
                "<select class='form-control' ng-model='parameter.value' ng-if=parameter.type=='subjectcollege' ng-options='subject.subjectName for subject in subjectList' ng-change ='setElective(parameter.value)'>" +
                // "<option value=''>Select Subject</option>" +
                // "<option ng-repeat='subject in subjectList' value={{subject}}>{{subject.subjectName}}</option>" +
                "</select>" +
                "<input type='text' ng-model='parameter.value' ng-if=parameter.type=='text_box' class='form-control'/>" +
                "</div>" +
                "<div class='footer' style='bottom: 20px;z-index:1;width: 100%;display: flex;justify-content: center;margin-left: -15px;'>" +
                "<button class = 'btn btn-danger' style='margin-right: 25px;' ng-click='applyFilter()'>Filter</button>" +
                "<button class = 'btn btn-default' ng-click='resetFilter()'>Reset</button>" +
                "</div>" +
                "</div>" +
                "<div ng-class={true:'col-lg-10',false:'col-lg-12'}[visible] style='padding: 0px;height: 100%' id='iFrameClass'>" +
                "<div style='border-bottom: 1px solid #cfc7c0;padding: 8px 10px;min-height:45px;'>" +
                "<button ng-click='optionHide()' ng-if=hideOption ><i class='fa fa-bars' style='cursor: pointer;'></i></button>" +
                "<button style='margin-right: 10px;' class='close' ng-click='close()' data-dismiss='modal'>×</button>" +
                "<div class='float-right dropdown'>" +
                "<button class='btn-grey dropbtn' type='button' data-toggle='dropdown' style='margin-right: 10px;padding: 3px 15px;border-radius: 5px;'>Download " +
                "<span class='caret' style='margin-bottom: 2px'></span></button>" +
                "<div class='dropdown-content' style='margin-right: 10px;min-width:92%;border-radius: 5px;'>" +
                "<a ng-click='downloadReport(\"pdf\")'>PDF</a>" +
                "<a ng-click='downloadReport(\"csv\")'>CSV</a>" +
                "<a ng-click='downloadReport(\"xls\")'>XLS</a>" +
                "</div>" +
                "</div>" +
                "<div class='pull-right' ng-hide='totalPage<=1'>" +
                "<i class='fa fa-chevron-left' aria-hidden='true' style= 'cursor: pointer;margin-right: 7px;' ng-click='paginate(start-5,end-5)' ng-hide='end<=5'></i>" +
                "<button id={{page}} class='btn' ng-class={true:'btn-danger',false:'btn-secondary'}[page==currentPage] style='padding: 2px 8px;margin-right:5px' data-ng-repeat='page in pages' ng-click='changePage(page)' ng-hide='page>totalPage'>{{page}}</button>" +
                "<i class='fa fa-chevron-right' aria-hidden='true' style='cursor: pointer;margin: 0px 5px;' ng-click='paginate(start+5,end+5)' ng-hide='end>=totalPage'></i>" +
                "<span style='margin: 5px;'>of</span>" +
                "<b style='margin-right: 8px;'>{{totalPage}}</b>" +
                "</div>" +
                "</div>" +
                "<iframe id='myFrame' style='height: calc(100vh - 185px);width: 83.3%;-webkit-transform: scale(1.2);-webkit-transform-origin: 0 0;' iframe-onload='getIframeUrl()'></iframe>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "</div>";

            return function (scope, element, lAtts) {

                scope.showModel = function (mForm) {
                    if ($element) {
                        $element.remove();
                    }
                    $element = null;
                    $element = $($compile(template)(scope));
                    $element.modal('show');
                }

                element.on('click', function (e) {
                    e.preventDefault();
                    scope.showModel();
                    scope.initScope();
                });

                scope.initScope = function () {
                    scope.currentPage = 1;
                    scope.reportType = null;
                    scope.toggle = true;
                    scope.loader = true;
                    scope.getParam();
                    scope.getstandard();
                    scope.getDepartment();
                    scope.searchParam = undefined;
                }

                scope.getParam = function () {
                    let url = "";
                    if (scope.reportParam != undefined)
                        url = (scope.reportParam.value != undefined ? scope.reportParam.value : scope.reportParam).map(val => val.name + "=" + val.value).join("&") + "&" + !scope.toggle;
                    $http.get('cip/api/report/info/' + scope.reportPath + '?' + url)
                        .success(function (data, status, headers, config) {
                            scope.parameters = data.param;
                            if (scope.parameters.length > 0) {
                                scope.visible = true
                                scope.hideOption = true
                            }
                            scope.reportUrl = "cip/api/report/" + scope.reportPath + "?" + scope.getReportQueryParam() + "&" + !scope.toggle;
                            scope.getReportUrl();

                        });
                    scope.getAcademics();
                }

                scope.getstandard = function () {
                    $http.get('cip/api/classyear?start=0&limit=10&searchValue=').success(function (data) {
                        data.entityList.sort(function(a, b) {
                            return a.displayOrder - b.displayOrder;
                        });
                        scope.standards = data.entityList;
                    })

                }

                scope.getYearByDepartment = function(department){
                    $http.get('cip/api/classyear/department/'+department.id).success(function (data) {
                        scope.years = data.entityList;
                    })
                }


                scope.getsection = function (standard) {
                    scope.year = standard;
                    $http.get('cip/api/section/class/' + standard.id).success(function (data) {
                        scope.sections = data.entityList;
                    })
                }
                scope.getSubject = function (subject) {
                    $http.get('cip/api/subject/class/' + subject.id).success(function (data) {
                        scope.subjects = data.entityList;
                    })
                }
                scope.getSubjectsBySemester = function (year,semester) {
                    $http.get('cip/api/subject/class/semester?classId='+year.id+'&semester='+semester).success(function (data) {
                        scope.subjects = data;
                    })
                }

                scope.getAcademics = function () {
                    $http.get('cip/api/academic/active').success(function (data) {
                        scope.academics = data.entityList;
                        console.log(scope.academics);
                    })
                }

                scope.getDepartment = function () {
                    $http.get('cip/api/department/active').success(function (data) {
                        scope.departments = data.entityList;
                    })
                }

                scope.getExam = function (standard) {
                    $http.get('cip/api/examination/class/' + standard.id).success(function (data) {
                        scope.exams = data.entityList;
                    })
                }

                scope.getCurrentAcademic = function(){
                    $http.get('cip/api/academic/current').success(function (data){
                        scope.currentAcademic = data.entity;
                    })
                }

                scope.getExamForCollege = function (year,semester,academic,section) {
                    $http.get('cip/api/examination/academic/semester?classId='+ year.id+'&academicId='+academic.id+'&semester='+semester+'&sectionId='+section.id).success(function (data) {
                        scope.exams = data.entityList;
                    })
                }
                scope.getExamPapers = function(exam){
                    $http.get('cip/api/exampaper/'+exam.id).success(function (data){
                        scope.examPapers = data.entityList;
                        scope.subjectList = [];
                        scope.examPapers.map(paper => {
                            if(paper.subjectElective.id) {
                                let subject ={}
                                subject.id = paper.subject.id;
                                subject.electiveId = paper.subjectElective.id;
                                subject.subjectName = paper.subjectElective.electiveSubjectName;
                                scope.subjectList.push(subject);
                            } else {
                                let subject ={}
                                subject.id = paper.subject.id;
                                subject.subjectName = paper.subject.subjectName;
                                scope.subjectList.push(subject);
                            }
                        })
                        console.log(scope.subjectList)
                    })
                }

                scope.setElective = function(elective) {
                    scope.parameters.map(param => {
                        if(param.name == 'elective' && elective.electiveId) {
                            param.value = elective.electiveId
                        } else if(param.anme == 'elective') {
                            param.value = ''
                        }
                    })
                }


                scope.refreshPage = function () {
                    scope.loader = true;
                    scope.reportUrl = 'cip/api/report/' + scope.reportPath + '?downloadType=html&' +
                        (scope.searchParam != undefined ? scope.searchParam : scope.getReportQueryParam()) +
                        "&page=" + scope.currentPage + "&" + scope.toggle;
                        scope.getReportUrl();
                }

                scope.downloadReport = function (downloadType) {
                    $http({ method: 'GET', responseType: 'arraybuffer', url: 'cip/api/report/' + scope.reportPath + '?downloadType=' + downloadType + '&' + scope.getReportQueryParam() }).
                        success(function (response) {
                            var myBlob = new Blob([response], { type: downloadType })
                            var blobURL = (window.URL || window.webkitURL).createObjectURL(myBlob);
                            var anchor = document.createElement("a");
                            anchor.download = scope.reportPath + '.' + downloadType;
                            anchor.href = blobURL;
                            anchor.click();
                        });
                }

                scope.resetFilter = function () {
                    scope.currentPage = 1;
                    scope.loader = true;
                    scope.getParam();
                }

                scope.applyFilter = function () {
                    scope.currentPage = 1;
                    scope.loader = true;
                    scope.reportUrl = "cip/api/report/" + scope.reportPath + "?" + scope.getReportQueryParam() + "&" + !scope.toggle;
                    scope.getReportUrl();
                }

                scope.optionHide = function () {
                    scope.visible = scope.visible == true ? false : true
                }
                scope.close = function () {
                    $element.modal('hide');
                    $element.remove();
                }
                scope.getReportUrl = function () {
                    $http({method: 'GET', url: scope.reportUrl , headers: {
                        'Authorization': 'Bearer'+localStorage.getItem('jwt-token')}
                    }).success(function(data){
                        let src = $element.find('#myFrame').contents().find('body');
                        src.html(data)
                        scope.loader = false
                        scope.getTotalPageNo();
                    });
                }

                scope.getTotalPageNo = function () {
                    scope.totalPage = $element.find("#myFrame").contents().find(".jrPage td:contains(Page)+td").text().replace(/^\D+/g, '');
                    if (scope.currentPage == 1)
                        scope.paginate(1, 5);
                    // scope.$apply();
                }

                scope.paginate = function (startPage, endPage) {
                    scope.start = startPage;
                    scope.end = endPage
                    const length = scope.end - (scope.start - 1);
                    scope.pages = Array.from({ length }, (_, i) => scope.start + i);
                }

                scope.changePage = function (page) {
                    scope.currentPage = page;
                    scope.refreshPage();
                }

                scope.getSemesterByClassYear = function(year){
                    for(var i=0; i<scope.years.length;i++){
                        if(scope.years[i].id==year.id){
                            scope.semestersLists=commonService.getSemesterByClassYear(scope.years[i].name);
                            i+=scope.years.length-i;
                        }
                    }
                };

                scope.setSection = function(section){
                    scope.section = section;
                }

                scope.getReportQueryParam = function () {
                    scope.toggle = !scope.toggle;
                    return scope.parameters.map(parameter => {
                        if(parameter.name == 'elective') {
                            return
                        }
                        if(parameter.value != undefined && parameter.value.electiveId) {
                            return parameter.name + "=" + parameter.value.id + "&elective=" + parameter.value.electiveId
                        }
                        if ((parameter.value != undefined && parameter.value.id != undefined) && parameter.value.id != null) {
                            return parameter.name + "=" + parameter.value.id
                        }
                        else if (parameter.value != undefined && parameter.value instanceof String && parameter.value.contains('/')) {
                            let date = commonService.convertDateFormat(parameter.value)
                            console.log(date)
                            return parameter.name + "=" + date
                        }
                        else
                            return parameter.name + "=" + parameter.value
                    }).join("&")
                }
            };

        }
    };
}
])
angular.module("cip.common").directive('iframeOnload', [function () {
    return {
        scope: {
            callBack: '&iframeOnload'
        },
        link: function (scope, element, attrs) {
            element.on('load', function () {
                return scope.callBack();
            })
        }
    }
}])
