var Senseira = Senseira || {};
Senseira.constructors = Senseira.constructors || {};
Senseira.constants = Senseira.constants || {};

(function(ko, $) {
    'use strict';

    function SignInViewModel() {
        var self = this;

        if (Senseira.constructors.BaseFormViewModel) {
            Senseira.constructors.BaseFormViewModel.call(self);
        }
        self.login = ko.observable('');
        self.password = ko.observable('');
        self.rememberMe = ko.observable(false);

        self.isValid = function() {
            return self.login().length > 0 &&
                   self.password().length >= Senseira.constants.MinPasswordLength;
        };

        self.showValidationErrors = function() {
            var errors = [];

            if (self.login().length === 0) {
                errors.push(Senseira.constants.LoginRequiredMessage);
            }

            if (self.password().length === 0) {
                errors.push(Senseira.constants.PasswordRequiredMessage);
            }

            if (self.password().length > 0 &&
                self.password().length < Senseira.constants.MinPasswordLength) {
                errors.push(Senseira.constants.MinPasswordLengthMessage);
            }
            self.validationErrors(errors);
        };
    }

    ko.applyBindings(new SignInViewModel());
})(ko, jQuery);
