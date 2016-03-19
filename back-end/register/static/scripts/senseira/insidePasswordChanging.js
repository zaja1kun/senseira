var Senseira = Senseira || {};
Senseira.constructors = Senseira.constructors || {};
Senseira.constants = Senseira.constants || {};

(function(ko, $) {
    'use strict';

    function InsidePasswordChangingViewModel() {
        var self = this;

        if (Senseira.constructors.BaseFormViewModel) {
            Senseira.constructors.BaseFormViewModel.call(self);
        }
        self.currentPassword = ko.observable('');
        self.newPassword = ko.observable('');
        self.passwordConfirmation = ko.observable('');

        self.isValid = function() {
            return self.currentPassword().length > 0 &&
                   self.newPassword().length > 0 &&
                   self.passwordConfirmation().length > 0 &&
                   self.currentPassword().length >= Senseira.constants.MinPasswordLength &&
                   self.newPassword().length >= Senseira.constants.MinPasswordLength &&
                   self.passwordConfirmation().length >= Senseira.constants.MinPasswordLength &&
                   self.newPassword() === self.passwordConfirmation();
        };

        self.showValidationErrors = function() {
            var errors = [];

            if (self.currentPassword().length === 0) {
                errors.push(Senseira.constants.PasswordRequiredMessage);
            }

            if (self.newPassword().length === 0) {
                errors.push(Senseira.constants.NewPasswordRequiredMessage);
            }

            if (self.passwordConfirmation().length === 0) {
                errors.push(Senseira.constants.PasswordConfirmationRequiredMessage);
            }

            if (self.currentPassword().length < Senseira.constants.MinPasswordLength ||
                self.newPassword().length < Senseira.constants.MinPasswordLength ||
                self.passwordConfirmation().length < Senseira.constants.MinPasswordLength) {
                errors.push(Senseira.constants.MinPasswordLengthMessage);
            }

            if (self.passwordConfirmation() !== self.newPassword()){
                errors.push(Senseira.constants.PasswordsEqualityRequiredMessage);
            }
            self.validationErrors(errors);
        };
    }

    ko.applyBindings(new InsidePasswordChangingViewModel());
})(ko, jQuery);