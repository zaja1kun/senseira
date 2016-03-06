var Senseira = Senseira || {};
Senseira.constructors = Senseira.constructors || {};

(function(ko, $) {
    'use strict';

    function ResetPasswordViewModel() {
        var self = this;

        if (Senseira.constructors.BaseFormViewModel) {
            Senseira.constructors.BaseFormViewModel.call(self);
        }
        self.email = ko.observable('');

        self.isValid = function() {
            return true;
        };

        self.showValidationErrors = function() {
        };
    }

    ko.applyBindings(new ResetPasswordViewModel());
})(ko, jQuery);