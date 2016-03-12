var Senseira = Senseira || {};
Senseira.constructors = Senseira.constructors || {};

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
            return true;
        };

        self.showValidationErrors = function() {
        };
    }

    ko.applyBindings(new InsidePasswordChangingViewModel());
})(ko, jQuery);