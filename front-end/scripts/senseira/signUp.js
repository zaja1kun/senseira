var Senseira = Senseira || {};
Senseira.constructors = Senseira.constructors || {};

(function(ko, $) {
    'use strict';

    function SignUpViewModel() {
        var self = this;

        if (Senseira.constructors.BaseFormViewModel) {
            Senseira.constructors.BaseFormViewModel.call(self);
        }
        self.name = ko.observable('');
        self.surname = ko.observable('');
        self.email = ko.observable('');
        self.login = ko.observable('');
        self.password = ko.observable('');
        self.passwordConfirmation = ko.observable('');
        self.isTeacherAccountRequired = ko.observable(false);
        self.rememberMe = ko.observable(false);

        self.isValid = function() {
            return true;
        };

        self.showValidationErrors = function() {
        };
    }

    ko.applyBindings(new SignUpViewModel());
})(ko, jQuery);
