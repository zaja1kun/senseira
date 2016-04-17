var Senseira = Senseira || {};
Senseira.constructors = Senseira.constructors || {};
Senseira.constants = Senseira.constants || {};

Senseira.constructors.SubgroupEditingModal = (function(ko, $) {
    'use strict';

    function SubgroupEditingModal() {
        //#region Fields

        function Student(student) {
            var self = this;

            $.extend(true, self, student);
            self.subgroup = ko.observableArray(student.subgroup);
        }

        var self = this;
        var studentListApplyChangesHandler = null;

        self.studentList = ko.observableArray([]);

        //#endregion

        //#region Private Methods

        var open = function() {
            $('#listEditingModal').modal({
                keyboard: true
            });
        };

        var close = function() {
            $('#listEditingModal').modal('hide');
        };

        var callStudentListApplyChangesHandler = function() {
            if (typeof studentListApplyChangesHandler === 'function') {
                var studentsList = ko.utils.arrayMap(self.studentList(), function(student) {
                    var result = $.extend(true, {}, student);
                    result.subgroup = student.subgroup();

                    return result;
                });
                studentListApplyChangesHandler(studentsList);
            }
        };

        //#endregion

        //#region Public Methods

        self.openModal = function(studentsList) {
            var inputStudentList = ko.utils.arrayMap(studentsList, function(student) {
                return new Student(student);
            });

            self.studentList(inputStudentList);
            open();
        };

        self.removeStudent = function(student) {
            self.studentList.remove(student);
        };

        self.removeSubgroupFromStudent = function(student, subgroup) {
            student.subgroup.remove(subgroup);
        };

        self.applyChanges = function() {
            close();
            callStudentListApplyChangesHandler();
        };

        self.setListApplyChangesHandler = function(handler) {
            if (handler) {
                studentListApplyChangesHandler = handler;
            }
        };

        //#endregion
    }

    return SubgroupEditingModal;

})(ko, jQuery);