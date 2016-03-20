Senseira.constructors = Senseira.constructors || {};

Senseira.constructors.ScrollableList = (function(ko, jQuery) {
    'use strict';

    function ScrollableList() {

        //#region Fields

        var self = this;

        self.currentRangeOfVisibleItems = {};
        self.listItems = ko.observableArray([]);
        self.listOfVisibleItems = ko.observableArray([]);

        //#endregion

        //#region Private Methods

        var shiftRangeOfVisibleItems = function(isForwardDirection) {
            var defaultShiftLength = 1;
            var startIndex = self.currentRangeOfVisibleItems.startIndex;
            var endIndex = self.currentRangeOfVisibleItems.endIndex;
            var shift = 0;

            if (isForwardDirection) {
                var tailLength = self.listItems().length - endIndex - 1;
                shift = tailLength > defaultShiftLength ? defaultShiftLength : tailLength;

                self.currentRangeOfVisibleItems.startIndex += shift;
                self.currentRangeOfVisibleItems.endIndex += shift;
            } else {
                var headLength = startIndex;
                shift = headLength > defaultShiftLength ? defaultShiftLength : headLength;

                self.currentRangeOfVisibleItems.startIndex -= shift;
                self.currentRangeOfVisibleItems.endIndex -= shift;
            }
        };

        var updateList = function() {
            var listItems = self.listItems();
            var listOfVisibleItems = listItems.slice(
                self.currentRangeOfVisibleItems.startIndex,
                self.currentRangeOfVisibleItems.endIndex + 1
            );
            self.listOfVisibleItems(listOfVisibleItems);
        };

        var scrollList = function(isForwardDirection) {
            shiftRangeOfVisibleItems(isForwardDirection);
            updateList();
        };

        //#endregion

        //#region Event handlers

        self.updateList = function() {
            updateList();
        };

        self.scrollList = function(element, event) {
            var isForwardDirection = event.originalEvent.deltaY > 0;
            scrollList(isForwardDirection);
        };

        var scrollingIntervalId = 0;
        var intervalLength = 100;

        self.scrollToTop = function() {
            scrollingIntervalId = setInterval(function() {
                scrollList(false);
            }, intervalLength);
        };

        self.scrollToBottom = function() {
            scrollingIntervalId = setInterval(function() {
                scrollList(true);
            }, intervalLength);
        };

        self.stopScrolling = function() {
            clearInterval(scrollingIntervalId);
        };

        //#endregion
    }

    return ScrollableList;

})(ko, jQuery);