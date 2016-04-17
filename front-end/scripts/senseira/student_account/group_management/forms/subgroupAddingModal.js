var Senseira = Senseira || {};
Senseira.constructors = Senseira.constructors || {};
Senseira.constants = Senseira.constants || {};

Senseira.constructors.SubgroupAddingModal = (function(ko, $) {
    'use strict';

    function SubgroupAddingModal() {

        //#region Fields

        var self = this;

        if (Senseira.constructors.BaseFormViewModel) {
            Senseira.constructors.BaseFormViewModel.call(self);
        }
        var subgroupAddingHandler = null;
        self.subgroupName = ko.observable('');

        //#endregion

        //#region Private Methods

        var open = function() {
            $('#subgroupAddingModal').modal({
                keyboard: true
            });
        };

        var close = function() {
            $('#subgroupAddingModal').modal('hide');
        };

        var clearForm = function() {
            self.subgroupName('');
            self.validationErrors([]);
        };

        var callSubgroupAddingHandler = function() {
            if (typeof subgroupAddingHandler === 'function') {
                subgroupAddingHandler(self.subgroupName());
            }
        };

        //#endregion

        //#region Public Methods

        self.isValid = function() {
            return !!self.subgroupName();
        };

        self.showValidationErrors = function() {
            var errors = [];

            if (!self.subgroupName()) {
                errors.push(Senseira.constants.SubgroupNameRequired);
            }
            self.validationErrors(errors);
        };

        self.openModal = function() {
            clearForm();
            open();
        };

        self.addSubgroup = function() {
            if (self.isValid()) {
                callSubgroupAddingHandler();
                close();
            } else {
                self.showValidationErrors();
            }
        };

        self.setSubgroupAddingHandler = function(handler) {
            if (handler) {
                subgroupAddingHandler = handler;
            }
        };

        //#endregion
    }

    return SubgroupAddingModal;

})(ko, jQuery);