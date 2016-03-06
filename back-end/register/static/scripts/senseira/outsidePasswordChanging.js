var Senseira = Senseira || {};
Senseira.constructors = Senseira.constructors || {};

(function(ko, $) {
    'use strict';

    function OutsidePasswordChangingViewModel() {
        var self = this;

        if (Senseira.constructors.BaseFormViewModel) {
            Senseira.constructors.BaseFormViewModel.call(self);
        }
        self.newPassword = ko.observable('');
        self.passwordConfirmation = ko.observable('');

        self.isValid = function() {
            return true;
        };

        self.showValidationErrors = function() {
        };
    }

    ko.applyBindings(new OutsidePasswordChangingViewModel());
})(ko, jQuery);