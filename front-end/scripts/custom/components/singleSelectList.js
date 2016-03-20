var Senseira = Senseira || {};
Senseira.constructors = Senseira.constructors || {};

Senseira.constructors.SingleSelectList = (function(ko, $) {
    'use strict';

    function SingleSelectList(settings) {
        function SingleSelectListItem(number, id, title, text, cssClass) {
            var self = this;
            var cssClassName = cssClass;

            self.number = number;
            self.id = id;
            self.title = ko.observable(title);
            self.text = ko.observable(text);
            self.cssClass = ko.observable(cssClass || '');
            self.isSelected = ko.observable(false);

            self.isSelected.subscribe(function(newValue) {
                if (newValue) {
                    self.cssClass([cssClassName, 'selected'].join(' '));
                } else {
                    self.cssClass(cssClassName);
                }
            });
        }

        //#region Fields

        var self = this;

        self.maxCountOfVisibleItems = 0;
        self.selectEventHandler = null;
        self.contextMenuHandler = null;

        if (Senseira.constructors.ScrollableList) {
            Senseira.constructors.ScrollableList.call(self);
        }

        self.singleSelectListIsVisible = ko.computed(function() {
            return self.listItems().length > 0;
        });

        //#endregion

        //#region Private Methods

        var getCssClassByTypeId = function(typeId, mappingArray) {
            var typeMapping = ko.utils.arrayFirst(mappingArray, function(mapping) {
                return mapping.typeId === typeId;
            });
            return typeMapping ? typeMapping.cssClass : '';
        };

        var updateNumbersOfList = function() {
            ko.utils.arrayForEach(self.listItems(), function(item, index) {
                item.number = index;
            });
        };

        var transformSingleSelectListItemToData = function(listItem) {
            return {
                number: listItem.number,
                id: listItem.id,
                title: listItem.title(),
                text: listItem.text(),
                isSelected: listItem.isSelected()
            }
        };

        var transformListItems = function(items, typeToClassMapping) {
            return ko.utils.arrayMap(items, function(item, index) {
                var cssClass = getCssClassByTypeId(item.typeId, typeToClassMapping);
                return new SingleSelectListItem(index, item.id, item.title, item.text, cssClass);
            });
        };

        var executeSelectCallback = function(selectedItem) {
            if (typeof self.selectEventHandler === 'function') {
                self.selectEventHandler(transformSingleSelectListItemToData(selectedItem));
            }
        };

        var executeContextMenuCallBack = function(item) {
            if (typeof self.contextMenuHandler === 'function') {
                self.contextMenuHandler(transformSingleSelectListItemToData(item));
            }
        };

        var setNewVisibilityWindow = function(controlSettings) {
            var currentCountOfVisibleItems = controlSettings.maxCountOfVisibleItems < controlSettings.items.length
                ? controlSettings.maxCountOfVisibleItems
                : controlSettings.items.length;
            self.maxCountOfVisibleItems = controlSettings.maxCountOfVisibleItems;

            if (currentCountOfVisibleItems > 0) {
                self.listOfVisibleItems(self.listItems().slice(0, currentCountOfVisibleItems));
                self.currentRangeOfVisibleItems = {
                    startIndex: 0,
                    endIndex: currentCountOfVisibleItems - 1
                };
            } else {
                self.listOfVisibleItems([]);
                self.currentRangeOfVisibleItems = {
                    startIndex: 0,
                    endIndex: 0
                }
            }
        };

        var init = function(controlSettings) {
            var listItems = transformListItems(controlSettings.items, controlSettings.typeToClassMapping);
            self.listItems(listItems || []);

            setNewVisibilityWindow(controlSettings);

            self.selectEventHandler  = controlSettings.selectEventHandler;
            self.contextMenuHandler = controlSettings.contextMenuHandler;
        };

        //#endregion

        //#region Event Handlers

        self.selectItem = function(element) {
            ko.utils.arrayForEach(self.listItems(), function(item) {
                if (item.number === element.number) {
                    item.isSelected(!item.isSelected());

                    executeSelectCallback(item);
                } else {
                    item.isSelected(false);
                }
            });
        };

        self.callContextMenuCallback = function(element) {
            ko.utils.arrayForEach(self.listItems(), function(item) {
                if (item.number === element.number) {
                    executeContextMenuCallBack(item);
                }
            });
        };

        //#endregion

        //#region Public Methods

        self.setNewSettings = function(newSettings) {
            init(newSettings);
        };

        self.setNewVisibilityWindow = function(newSettings) {
            setNewVisibilityWindow(newSettings);
        };

        self.setSelectEventHandler = function(eventHandler) {
            self.selectEventHandler = eventHandler;
        };

        self.setContextMenuHandler = function(eventHandler) {
            self.contextMenuHandler = eventHandler;
        };

        self.isMaxListItemsLimitExceeded = function() {
            return self.listItems().length > self.maxCountOfVisibleItems;
        };

        self.addNewItem = function(item, typeToClassMapping) {
            var cssClass = getCssClassByTypeId(item.typeId, typeToClassMapping);
            var number = self.listItems().length;
            self.listItems.push(new SingleSelectListItem(number, item.id, item.title, item.text, cssClass));
        };

        self.deleteItem = function(index) {
            self.listItems.splice(index, 1);
            updateNumbersOfList();
            self.updateList();
        };

        self.updateItem = function(number, updatedItem) {
            var item = ko.utils.arrayFirst(self.listItems(), function(item) {
                return item.number === number;
            });
            item.id = updatedItem.id;
            item.title(updatedItem.title);
            item.text(updatedItem.text);
        };

        //#endregion

        init(settings);
    }

    return SingleSelectList;

})(ko, jQuery);