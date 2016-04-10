var Senseira = Senseira || {};
Senseira.constructors = Senseira.constructors || {};
Senseira.constants = Senseira.constants || {};

Senseira.constructors.TaskAddingModal = (function(ko, $) {
    'use strict';

    function TaskAddingModal() {
        //# region Fields

        var self = this;

        if (Senseira.constructors.BaseFormViewModel) {
            Senseira.constructors.BaseFormViewModel.call(self);
        }

        self.taskTypeOptions = [
            Senseira.constants.TaskTypeLab,
            Senseira.constants.TaskTypeExam,
            Senseira.constants.TaskTypePracticalTask
        ];

        self.taskId = Senseira.constants.DefaultTaskId;
        self.taskNumber = ko.observable(null);
        self.taskTypeSelectedOption = ko.observable('');
        self.taskTheme = ko.observable('');
        self.taskDescription = ko.observable('');

        self.isAddingMode = ko.observable(true);
        self.taskAddingHandler = null;
        self.taskUpdatingHandler = null;
        self.taskDeletingHandler = null;

        //#endregion

        //#region Private Methods

        var clearForm = function() {
            self.taskId = Senseira.constants.DefaultTaskId;
            self.validationErrors([]);
            self.taskNumber(null);
            self.taskTypeSelectedOption(self.taskTypeOptions[0]);
            self.taskTheme('');
            self.taskDescription('');
        };

        var fillForm = function(task) {
            if (task) {
                self.taskId = task.taskId;
                self.taskNumber(task.taskNumber || null);
                self.taskTypeSelectedOption(task.typeName || self.taskTypeOptions[0]);
                self.taskTheme(task.taskTheme || '');
                self.taskDescription(task.taskDescription || '');
            }
        };

        var getFormData = function() {
            var taskId = self.isAddingMode() ? Senseira.constants.DefaultTaskId : self.taskId;

            return {
                taskId: taskId,
                taskNumber: self.taskNumber(),
                taskTypeName: self.taskTypeSelectedOption(),
                taskTheme: self.taskTheme(),
                taskDescription: self.taskDescription()
            }
        };

        var open = function() {
            $('#taskAddingModal').modal({
                keyboard: true
            });
        };

        var close = function() {
            $('#taskAddingModal').modal('hide');
        };

        var executeTaskAddingCallback = function() {
            if (typeof self.taskAddingHandler === 'function') {
                var data = getFormData();
                self.taskAddingHandler(data);
            }
        };

        var executeTaskUpdatingCallback = function() {
            if (typeof self.taskUpdatingHandler === 'function') {
                var data = getFormData();
                self.taskUpdatingHandler(data);
            }
        };

        var executeTaskDeletingCallback = function() {
            if (typeof self.taskDeletingHandler === 'function') {
                var data = getFormData();
                self.taskDeletingHandler(data);
            }
        };

        //#endregion

        //#region Event Handlers

        self.processAction = function() {
            if (self.isValid()) {
                if (self.isAddingMode()) {
                    executeTaskAddingCallback();
                } else {
                    executeTaskUpdatingCallback();
                }
                close();
            } else {
                self.showValidationErrors();
            }
        };

        self.deleteTask = function() {
            executeTaskDeletingCallback();
            close();
        };

        //#endregion

        //#region Public Methods

        self.isValid = function() {
            return self.taskNumber() !== null &&
                   parseInt(self.taskNumber()) >= 0 &&
                   parseInt(self.taskNumber()) <= Senseira.constants.TaskNumberMaxValue &&
                   self.taskTheme().length > 0 &&
                   self.taskDescription().length > 0;
        };

        self.showValidationErrors = function() {
            var errors = [];

            if (!self.taskNumber()) {
                errors.push(Senseira.constants.TaskNumberRequiredMessage);
            } else if (self.taskNumber() < 0) {
                errors.push(Senseira.constants.TaskNumberLessThanZeroMessage);
            } else if (self.taskNumber() > Senseira.constants.TaskNumberMaxValue) {
                errors.push(Senseira.constants.TaskNumberGreatThanMaxValueMessage);
            }

            if (self.taskTheme().length === 0) {
                errors.push(Senseira.constants.TaskThemeRequiredMessage);
            }

            if (self.taskDescription().length === 0) {
                errors.push(Senseira.constants.TaskDescriptionRequiredMessage);
            }

            self.validationErrors(errors);
        };

        self.setTaskAddingHandler = function(eventHandler) {
            self.taskAddingHandler = eventHandler;
        };

        self.setTaskUpdatingHandler = function(eventHandler) {
            self.taskUpdatingHandler = eventHandler;
        };

        self.setTaskDeletingHandler = function(eventHandler) {
            self.taskDeletingHandler = eventHandler;
        };

        self.openModalForAddingTask = function() {
            self.isAddingMode(true);
            clearForm();
            open();
        };

        self.openModalForUpdatingTask = function(task) {
            self.isAddingMode(false);
            clearForm();
            fillForm(task);
            open();
        };

        //#endregion

        //#region Testing

        self.testing = {
            fillForm: fillForm,
            clearForm: clearForm,
            getFormData: getFormData
        };

        //#endregion
    }

    return TaskAddingModal;

})(ko, jQuery);