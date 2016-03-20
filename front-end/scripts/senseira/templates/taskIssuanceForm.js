var Senseira = Senseira || {};
Senseira.constructors = Senseira.constructors || {};
Senseira.constants = Senseira.constants || {};

Senseira.constructors.TaskIssuanceForm = (function() {
    'use strict';

    function TaskIssuanceForm() {
        var self = this;

        self.taskId = Senseira.constants.DefaultTaskId;

        self.isVisible = ko.observable(false);
        self.title = ko.observable('');
        self.theme = ko.observable('');
        self.description = ko.observable('');
        self.isIssuanceByVariantRequired = ko.observable(false);

        var clear = function() {

        };

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
    }

    return TaskIssuanceForm;

})(ko, jQuery);