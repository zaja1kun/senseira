var Senseira = Senseira || {};
Senseira.constructors = Senseira.constructors || {};
Senseira.constants = Senseira.constants || {};

(function(ko, $) {
    'use strict';

    function ResetPasswordViewModel() {
        var self = this;

        if (Senseira.constructors.BaseFormViewModel) {
            Senseira.constructors.BaseFormViewModel.call(self);
        }
        self.email = ko.observable('');

        self.isValid = function() {
            return self.email().length > 0;
        };

        self.showValidationErrors = function() {
            var errors = [];

            if (self.email().length === 0) {
                errors.push(Senseira.constants.EmailRequiredMessage);
            }
            self.validationErrors(errors);
        };
    }

    ko.applyBindings(new ResetPasswordViewModel());
})(ko, jQuery);