(function(ko, $) {
    'use strict';

    function SignInViewModel() {
        var StateType = {
            SignIn: 1,
            PasswordRestoring: 2,
            PasswordChanging: 3
        };

        function SignInState(stateId) {
            var self = this;

            self.login = ko.observable('');
            self.password = ko.observable('');
            self.rememberMe = ko.observable(false);
            self.validationErrors = ko.observableArray([]);

            self.isValid = function() {
                return true;
            };

            self.showValidationErrors = function() {
            };

            self.isValidationErrorsExists = ko.computed(function() {
                return self.validationErrors().length > 0;
            });
        }

        function PasswordRestoringState(stateId) {
            var self = this;

            self.login = ko.observable('');
            self.code = ko.observable('');
            self.isMessageSent = ko.observable(false);
            self.validationErrors = ko.observableArray([]);

            self.isValid = function() {
                return true;
            };

            self.showValidationErrors = function() {
            };

            self.isValidationErrorsExists = ko.computed(function() {
                return self.validationErrors().length > 0;
            });
        }

        function PasswordChangingState(stateId) {
            var self = this;

            self.login = ko.observable('');
            self.password = ko.observable('');
            self.passwordConfirmation = ko.observable('');
            self.validationErrors = ko.observableArray([]);

            self.isValid = function() {
                return true;
            };

            self.showValidationErrors = function() {
            };

            self.isValidationErrorsExists = ko.computed(function() {
                return self.validationErrors().length > 0;
            });
        }

        // Fields

        var self = this;

        self.signInState = new SignInState();
        self.passwordRestoringState = new PasswordRestoringState();
        self.passwordChangingState = new PasswordChangingState();

        self.currentStateType  = ko.observable(StateType.SignIn);

        // Computed properties

        self.isSignInState = ko.computed(function() {
            return self.currentStateType() === StateType.SignIn;
        });

        self.isPasswordRestoringState = ko.computed(function() {
            return self.currentStateType() === StateType.PasswordRestoring;
        });

        self.isPasswordChangingState = ko.computed(function() {
            return self.currentStateType()=== StateType.PasswordChanging;
        });

        // Private methods

        var setSignInState = function() {
            self.currentStateType(StateType.SignIn);
        };

        var setPasswordRestoringState = function() {
            self.currentStateType(StateType.PasswordRestoring);
        };

        var setPasswordChangingState = function() {
            self.passwordChangingState.login(self.passwordRestoringState.login());
            self.currentStateType(StateType.PasswordChanging);
        };

        var messageSendingRequest = function() {
            self.passwordRestoringState.isMessageSent(true);
        };

        var codeConfirmingRequest = function() {
            setPasswordChangingState();
        };

        // Events handlers

        self.beforeSubmit = function(element, event) {
            if (!self.signInState.isValid()) {
                self.signInState.showValidationErrors();
                return false;
            }
            return true;
        };

        self.restorePassword = function() {
            setPasswordRestoringState();
        };

        self.sendMessage = function() {
            if (self.passwordRestoringState.isValid()) {
                messageSendingRequest();
            } else {
                self.passwordRestoringState.showValidationErrors();
            }
        };

        self.confirmCode = function() {
            if (self.passwordRestoringState.isValid()) {
                codeConfirmingRequest();
            } else {
                self.passwordRestoringState.showValidationErrors();
            }
        };

        self.changePassword = function(element, event) {
            if (!self.passwordChangingState.isValid()) {
                self.passwordChangingState.showValidationErrors();
                return false;
            }
            return true;
        };
    }

    ko.applyBindings(new SignInViewModel());
})(ko, jQuery);
