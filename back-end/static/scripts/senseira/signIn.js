var Senseira = Senseira || {};
Senseira.constructors = Senseira.constructors || {};

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
            return true;
        };

        self.showValidationErrors = function() {
        };
    }

    ko.applyBindings(new SignInViewModel());
})(ko, jQuery);
