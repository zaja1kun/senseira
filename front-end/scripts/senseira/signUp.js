(function(ko, $) {
    'use strict';

    function SignUpViewModel() {
        var self = this;

        self.name = ko.observable('');
        self.surname = ko.observable('');
        self.email = ko.observable('');
        self.login = ko.observable('');
        self.password = ko.observable('');
        self.passwordConfirmation = ko.observable('');
        self.isTeacherAccountRequired = ko.observable(false);
        self.rememberMe = ko.observable(false);
        self.validationErrors = ko.observableArray([]);

        self.isValid = function() {
            return true;
        };

        self.showValidationErrors = function() {
        };

        self.isValidationErrorsExists = ko.computed(function() {
            return self.validationErrors().length > 0;
        });

        self.beforeSubmit = function() {
            if (!self.isValid()) {
                self.showValidationErrors();
                return false;
            }
            return true;
        };
    }

    ko.applyBindings(new SignUpViewModel());
})(ko, jQuery);
