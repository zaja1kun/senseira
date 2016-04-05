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

        function MultiSelectListItem(parent, number, id, mainInformation, additionalInformation) {
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
                if (self.isSelected()) {
                    self.isSelected(false);
                    parent.callDeselectItemHandler(self.id);
                } else {
                    self.isSelected(true);
                    parent.callSelectItemHandler(self.id)
                }
            };

            self.toggleAdditional = function() {
                self.isAdditionalInfoVisible(!self.isAdditionalInfoVisible());
            }
        }

        //#region Fields

        var self = this;

        if (Senseira.constructors.ScrollableList) {
            Senseira.constructors.ScrollableList.call(self);
        }

        self.isNumberedList = false;
        self.maxCountOfVisibleItems = 0;
        self.selectItemHandler = null;
        self.deselectItemHandler = null;

        self.multiSelectListIsVisible = ko.computed(function() {
            return self.listItems().length > 0;
        });

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
                        new MultiSelectListItem(self, number, item.id, item.mainInformation, item.additionalInformation)
                    );
                });
            }
            return result;
        };

        var setNewVisibilityWindow = function(controlSettings) {
            self.maxCountOfVisibleItems = controlSettings.maxCountOfVisibleItems < controlSettings.items.length
                ? controlSettings.maxCountOfVisibleItems
                : controlSettings.items.length;

            if (self.maxCountOfVisibleItems > 0) {
                var listOfVisibleItems = self.listItems().slice(0, self.maxCountOfVisibleItems);
                self.listOfVisibleItems(listOfVisibleItems);
            }

            self.currentRangeOfVisibleItems = {
                startIndex: 0,
                endIndex: self.maxCountOfVisibleItems - 1
            };
        };

        var init = function(controlSettings) {
            var listItems = getListItems(controlSettings.items, controlSettings.isSelfNumberedList);
            self.listItems(listItems);
            self.isNumberedList = controlSettings.isNumberedList;

            setNewVisibilityWindow(controlSettings);
        };

        //#endregion

        //#region Public methods

        self.getIdOfSelectedItems = function() {
            var result = [];

            ko.utils.arrayForEach(self.listOfVisibleItems(), function(item) {
                if (item.isSelected()) {
                    result.push(item.id);
                }
            });

            return result;
        };

        self.setNewSettings = function(newSettings) {
            init(newSettings);
        };

        self.setNewVisibilityWindow = function(newSettings) {
            setNewVisibilityWindow(newSettings);
        };

        self.setSelectItemHandler = function(handler) {
            if (typeof handler === 'function') {
                self.selectItemHandler = handler;
            }
        };

        self.callSelectItemHandler = function(id) {
            if (typeof self.selectItemHandler === 'function') {
                self.selectItemHandler(id);
            }
        };

        self.setDeselectItemHandler = function(handler) {
            if (typeof handler === 'function') {
                self.deselectItemHandler = handler;
            }
        };

        self.callDeselectItemHandler = function(id) {
            if (typeof self.deselectItemHandler === 'function') {
                self.deselectItemHandler(id)
            }
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
