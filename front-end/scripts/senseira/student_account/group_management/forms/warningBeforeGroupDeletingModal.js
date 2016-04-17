var Senseira = Senseira || {};
Senseira.constructors = Senseira.constructors || {};
Senseira.constants = Senseira.constants || {};

Senseira.constructors.WarningBeforeGroupDeletingModal = (function(ko, $) {
    'use strict';

    function WarningBeforeGroupDeletingModal() {
        //#region Fields

        var self = this;

        //#ndregion

        //#region Private Methods

        var open = function() {
            $('#warningBeforeGroupDeletingModal').modal({
                keyboard: true
            });
        };

        var close = function() {
            $('#warningBeforeGroupDeletingModal').modal('hide');
        };

        //#endregion

        //#region Public Methods

        self.openModal = function() {
            open();
        };

        //#endregion
    }

    return WarningBeforeGroupDeletingModal;

})(ko, jQuery);