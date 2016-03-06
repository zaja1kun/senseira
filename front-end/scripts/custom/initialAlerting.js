var Senseira = Senseira || {};
Senseira.alerting = Senseira.alerting || {};

(function($) {
    if (!Senseira.alerting.error ||
        !Senseira.alerting.information ||
        !Senseira.alerting.success ||
        !Senseira.alerting.warning) {
        return;
    }

    var $alertListElement = $('#alertList');

    if ($alertListElement) {
        var $listOfAlerts = $alertListElement.children('li');

        $listOfAlerts.each(function() {
            var currentElement = $(this);

            if (currentElement.hasClass('success')) {
                Senseira.alerting.success(currentElement.text());
            } else if (currentElement.hasClass('warning')) {
                Senseira.alerting.warning(currentElement.text());
            } else if (currentElement.hasClass('error')) {
                Senseira.alerting.error(currentElement.text());
            } else if (currentElement.hasClass('info')) {
                Senseira.alerting.information(currentElement.text());
            }
        });
    }
})(jQuery);