var Senseira = Senseira || {};

Senseira.alerting = (function() {
    var customAlert = function(type, text) {
        var n = noty({
            text        : text,
            type        : type,
            dismissQueue: true,
            layout      : 'bottomRight',
            closeWith   : ['click'],
            theme       : 'relax',
            maxVisible  : 10,
            animation   : {
                open  : 'animated bounceInRight',
                close : 'animated bounceOutRight',
                easing: 'swing',
                speed : 400
            }
        });
    };

    var success = function(message) {
        customAlert('success', message);
    };

    var information = function(message) {
        customAlert('information', message);
    };

    var warning = function(message) {
        customAlert('warning', message);
    };

    var error = function(message) {
        customAlert('error', message);
    };

    return {
        success: success,
        information: information,
        warning: warning,
        error: error
    }
})();
