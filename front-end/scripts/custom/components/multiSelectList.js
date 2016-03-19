/*
* Short description of multi select list parameters:
*   settings:
*   1) isNumberedList - set visibility of list item numbers.
*   2) isSelfNumberedList - for number visibility you should set number property manually
*   3) showSelectingStatistic - set visibility of statistic on header of control
*   4) items - array of objects
*    {
*       id: elementId,
*       mainInformation: label in element of list
*       additionalInformation: array of strings with additional information.
*       number: (if isSelfNumberedList === true - required, else - optional)
*    }
*   5) maxCountOfVisibleItems: max count of visible elements in list */


var Senseira = Senseira || {};
Senseira.constructors = Senseira.constructors || {};

Senseira.constructors.MultiSelectList = (function(ko, $) {
    'use strict';

    function MultiSelectList(settings) {

        function MultiSelectListItem(number, id, mainInformation, additionalInformation) {
            var self = this;

            self.number = number;
            self.id = id;
            self.mainInformation = mainInformation;
            self.isSelected = ko.observable(false);
            self.additionalInformation = ko.observableArray([]);
            self.isAdditionalInfoVisible = ko.observable(false);

            if (Array.isArray(additionalInformation)) {
                self.additionalInformation(additionalInformation);
            }

            self.toggleSelected = function() {
                self.isSelected(!self.isSelected());
            };

            self.toggleAdditional = function() {
                self.isAdditionalInfoVisible(!self.isAdditionalInfoVisible());
            }
        }

        //#region Fields

        var self = this;

        self.isNumberedList = false;
        self.maxCountOfVisibleItems = false;
        self.currentRangeOfVisibleItems = {};

        self.listItems = ko.observableArray([]);
        self.listOfVisibleItems = ko.observableArray([]);

        //#endregion

        //#region Computed fields

        self.countOfSelectedListItems = ko.computed(function() {
            var result = 0;

            ko.utils.arrayForEach(self.listItems(), function(item) {
                if (item.isSelected()) {
                    result++;
                }
            });

            return result;
        });

        self.selectingStatisticText = ko.computed(function() {
            return ['Выбрано', self.countOfSelectedListItems(), 'из', self.listItems().length, 'элементов.'].join(' ');
        });

        //#endregion

        //#region Private methods

        var getListItems = function(items, isNumberedItems) {
            var result = [];

            if (Array.isArray(items)) {
                ko.utils.arrayForEach(items, function(item, index) {
                    var number = isNumberedItems ? item.number : index + 1;

                    result.push(
                        new MultiSelectListItem(number, item.id, item.mainInformation, item.additionalInformation)
                    );
                });
            }
            return result;
        };

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

        var scrollList = function(isForwardDirection) {
            shiftRangeOfVisibleItems(isForwardDirection);

            var listItems = self.listItems();
            var listOfVisibleItems = listItems.slice(
                self.currentRangeOfVisibleItems.startIndex,
                self.currentRangeOfVisibleItems.endIndex + 1
            );
            self.listOfVisibleItems(listOfVisibleItems);
        };

        var init = function(controlSettings) {
            self.isNumberedList = controlSettings.isNumberedList;
            self.maxCountOfVisibleItems = controlSettings.maxCountOfVisibleItems < controlSettings.items.length
                ? controlSettings.maxCountOfVisibleItems
                : controlSettings.items.length;

            var listItems = getListItems(controlSettings.items, controlSettings.isSelfNumberedList);
            var countOfVisibleItems = self.maxCountOfVisibleItems || listItems.length;
            var listOfVisibleItems = listItems.slice(0, countOfVisibleItems);

            self.listItems(listItems);
            self.listOfVisibleItems(listOfVisibleItems);
            self.currentRangeOfVisibleItems = {
                startIndex: 0,
                endIndex: countOfVisibleItems - 1
            };
            self.listLength = listItems.length;
        };

        //#endregion

        //#region Event handlers

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

        //#region Public methods

        self.getIdOfSelectedItems = function() {
            var result = [];

            ko.utils.arrayForEach(self.listItems(), function(item) {
                if (item.isSelected()) {
                    result.push(item.id);
                }
            });

            return result;
        };

        self.setNewSettings = function(newSettings) {
            init(newSettings);
        };

        self.selectAll = function() {
            ko.utils.arrayForEach(self.listItems(), function(item) {
                item.isSelected(true);
            });
        };

        self.deselectAll = function() {
            ko.utils.arrayForEach(self.listItems(), function(item) {
                item.isSelected(false);
            });
        };

        //#endregion

        init(settings);
    }

    return MultiSelectList;

})(ko, jQuery);
