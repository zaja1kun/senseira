var Senseira = Senseira || {};
Senseira.constructors = Senseira.constructors || {};
Senseira.constants = Senseira.constants || {};

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
            return self.name().length > 0 &&
                   self.surname().length > 0 &&
                   self.email().length > 0 &&
                   self.login().length > 0 &&
                   self.password().length > 0 &&
                   self.password().length >= Senseira.constants.MinPasswordLength &&
                   self.passwordConfirmation().length > 0 &&
                   self.passwordConfirmation().length >= Senseira.constants.MinPasswordLength &&
                   self.password() === self.passwordConfirmation()
        };

        self.showValidationErrors = function() {
            var errors = [];

            if (self.name().length === 0) {
                errors.push(Senseira.constants.NameRequiredMessage);
            }

            if (self.surname().length === 0) {
                errors.push(Senseira.constants.SurnameRequiredMessage);
            }

            if (self.email().length === 0) {
                errors.push(Senseira.constants.EmailRequiredMessage);
            }

            if (self.login().length === 0) {
                errors.push(Senseira.constants.LoginRequiredMessage);
            }

            if (self.password().length === 0) {
                errors.push(Senseira.constants.PasswordRequiredMessage);
            }

            if (self.passwordConfirmation().length === 0) {
                errors.push(Senseira.constants.PasswordConfirmationRequiredMessage);
            }

            if (self.password().length < Senseira.constants.MinPasswordLength ||
                self.passwordConfirmation().length < Senseira.constants.MinPasswordLength) {
                errors.push(Senseira.constants.MinPasswordLengthMessage);
            }

            if (self.password() !== self.passwordConfirmation()) {
                errors.push(Senseira.constants.PasswordsEqualityRequiredMessage);
            }
            self.validationErrors(errors);
        };
    }

    ko.applyBindings(new SignUpViewModel());
})(ko, jQuery);
