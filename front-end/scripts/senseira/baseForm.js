var Senseira = Senseira || {};
Senseira.constructors = Senseira.constructors || {};

Senseira.constructors.BaseFormViewModel = (function(ko) {
    'use strict';

    function BaseFormViewModel() {
        var self = this;

        self.validationErrors = ko.observableArray([]);

        self.isValid = function() {
            return true;
        };

        self.showValidationErrors = function() {
        };

        self.isValidationErrorsExists = ko.computed(function() {
            return self.validationErrors().length > 0;
        });

        self.beforeSubmit = function(element, event) {
            if (!self.isValid()) {
                self.showValidationErrors();
                return false;
            }
            return true;
        };
    }

    return BaseFormViewModel;
})(ko);