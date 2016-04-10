var Senseira = Senseira || {};
Senseira.constructors = Senseira.constructors || {};
Senseira.constants = Senseira.constants || {};

Senseira.constructors.TaskIssuanceForm = (function() {
    'use strict';

    function TaskIssuanceForm() {
        function Variant(id, name) {
            var self = this;
            self.studentId = id;
            self.studentName = name;
            self.variantDescription = ko.observable('');
        }

        //#region Fields

        var self = this;
        self.taskId = Senseira.constants.DefaultTaskId;

        self.isVisible = ko.observable(false);
        self.title = ko.observable('');
        self.theme = ko.observable('');
        self.description = ko.observable('');
        self.isIssuanceByVariantRequired = ko.observable(false);
        self.variants = ko.observableArray([]);

        //#endregion

        //#region Computed Fields

        self.isVariantsListContainerVisible = ko.computed(function() {
            return self.isIssuanceByVariantRequired() && self.variants().length > 0;
        });

        //#endregion

        //#region Private methods

        var clear = function() {
            self.taskId = Senseira.constants.DefaultTaskId;
            self.title('');
            self.theme('');
            self.description('');
            self.isIssuanceByVariantRequired(false);
        };

        //#endregion

        //#region Public methods

        self.show = function(taskData, variantsData) {
            self.taskId = taskData.id;
            self.title(taskData.title);
            self.theme(taskData.theme);
            self.description(taskData.description);
            self.isVisible(true);
        };

        self.hide = function() {
            clear();
            self.isVisible(false);
        };

        self.initializeVariants = function(studentsList) {
            ko.utils.arrayForEach(studentsList, function(student) {
                if (student) {
                    self.variants.push(new Variant(student.id, student.name));
                }
            });
        };

        self.addStudentToVariantList = function(student) {
            if (student) {
                self.variants.push(new Variant(student.id, student.name));
            }
        };

        self.removeStudentFromVariantList = function(studentId) {
            var variant = ko.utils.arrayFirst(self.variants(), function(variant) {
                return variant.studentId === studentId;
            });
            self.variants.remove(variant);
        };

        self.clearVariants = function() {
            self.variants.removeAll();
        };

        //#endregion

        //#region Testing

        self.testing = {
            addStudentToVariantList: self.addStudentToVariantList,
            removeStudentFromVariantList: self.removeStudentFromVariantList,
            clearVariants: self.clearVariants
        };

        //#endregion
    }

    return TaskIssuanceForm;

})(ko, jQuery);