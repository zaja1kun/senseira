var Senseira = Senseira || {};
Senseira.constants = Senseira.constants || {};
Senseira.constructors = Senseira.constructors || {};
Senseira.alerting = Senseira.alerting || {};

(function(ko, $) {
    'use strict';

    function LabIssuance() {
        //#region Fields

        var self = this;
        var groups = [];

        var taskList = [];

        var taskTypeIdToNameMapping = [
            { typeId: 1, typeName: Senseira.constants.TaskTypeLab },
            { typeId: 2, typeName: Senseira.constants.TaskTypeExam },
            { typeId: 3, typeName: Senseira.constants.TaskTypePracticalTask }
        ];

        var studentsMultiSelectListSettings = {
            isNumberedList: true,
            isSelfNumberedList: true,
            showSelectingStatistic: true,
            maxCountOfVisibleItems: Senseira.constants.MinCountOfMultiSelectListElements,
            items: []
        };

        var tasksSingleSelectListSettings = {
            maxCountOfVisibleItems: Senseira.constants.MinCountOfSingleSelectListElements,
            typeToClassMapping: [
                {
                    typeId: 1,
                    cssClass: 'type-one'
                },
                {
                    typeId: 2,
                    cssClass: 'type-two'
                },
                {
                    typeId: 3,
                    cssClass: 'type-three'
                }
            ],
            items: []
        };

        self.groupFilterOptions = ko.observableArray([]);
        self.selectedGroup = ko.observable(null);
        self.subgroupFilterOptions = ko.observableArray([]);
        self.selectedSubgroup = ko.observable(null);

        self.taskAddingModal = new Senseira.constructors.TaskAddingModal();
        self.taskIssuanceForm = new Senseira.constructors.TaskIssuanceForm();
        self.tasksSingleSelectList = new Senseira.constructors.SingleSelectList(tasksSingleSelectListSettings);
        self.studentsMultiSelectList = new Senseira.constructors.MultiSelectList(studentsMultiSelectListSettings);

        //#endregion

        //#region Subscribers

        self.selectedGroup.subscribe(function(newValue) {
            if (newValue) {
                var group = getGroupByNumber(newValue);

                studentsMultiSelectListSettings.items = transformDataToMultiSelectItems(group.students);
                self.studentsMultiSelectList.setNewSettings(studentsMultiSelectListSettings);
                self.subgroupFilterOptions(group.subgroups);
            } else {
                resetMultiSelectListSettingsToInitial();
                self.subgroupFilterOptions([]);
                self.selectedSubgroup(null);
            }
            self.taskIssuanceForm.clearVariants();
        });

        self.selectedSubgroup.subscribe(function(newValue) {
            var group = getGroupByNumber(parseInt(self.selectedGroup()));

            if (newValue) {
                var students = getStudentsBySubgroup(group.students, newValue);

                studentsMultiSelectListSettings.items = transformDataToMultiSelectItems(students);
                self.studentsMultiSelectList.setNewSettings(studentsMultiSelectListSettings);
            } else {
                if (group && group.students) {
                    studentsMultiSelectListSettings.items = transformDataToMultiSelectItems(group.students);
                    self.studentsMultiSelectList.setNewSettings(studentsMultiSelectListSettings);
                }
            }
            self.taskIssuanceForm.clearVariants();
        });

        $(window).resize(function() {
            setCountOfSingleSelectListVisibleItems();
            setCountOfMultiSelectListVisibleItems();
        });

        //#endregion

        //#region Private Methods

        var getGroupByNumber = function(number) {
            if (groups) {
                return ko.utils.arrayFirst(groups, function(group) {
                    return group.number === number;
                });
            }
        };

        var getStudentsBySubgroup = function(students, subgroup) {
            if (students) {
                return ko.utils.arrayFilter(students, function(student) {
                    return student.subgroup.indexOf(subgroup) !== -1;
                });
            }
        };

        var getStudentById = function(studentId) {
            var group = getGroupByNumber(parseInt(self.selectedGroup()));

            if (group) {
                return ko.utils.arrayFirst(group.students, function(student) {
                    return student.id === studentId;
                });
            }
            return null;
        };

        var getTypeNameByTypeId = function(typeId) {
            var mapping = ko.utils.arrayFirst(taskTypeIdToNameMapping, function(mapping) {
                return mapping.typeId === typeId;
            });
            return mapping.typeName;
        };

        var getTypeIdByTypeName = function(typeName) {
            var mapping = ko.utils.arrayFirst(taskTypeIdToNameMapping, function(mapping) {
                return mapping.typeName === typeName;
            });
            return mapping.typeId;
        };

        var transformToTaskForModal = function(taskFromList) {
            return {
                taskId: taskFromList.id,
                taskNumber: taskFromList.number,
                taskTypeName: getTypeNameByTypeId(taskFromList.typeId),
                taskTheme: taskFromList.theme,
                taskDescription: taskFromList.description
            }
        };

        var transformToTaskForList = function(taskFromModal) {
            return {
                id: taskFromModal.taskId,
                number: taskFromModal.taskNumber,
                typeId: getTypeIdByTypeName(taskFromModal.taskTypeName),
                theme: taskFromModal.taskTheme,
                description: taskFromModal.taskDescription
            }
        };

        var transformToSingleSelectListItem = function(task) {
            var typeName = getTypeNameByTypeId(task.typeId);
            var title = [typeName, ' №', task.number].join('');

            return {
                id: task.id,
                typeId: task.typeId,
                title: title,
                text: task.theme
            }
        };

        var transformToTaskIssuanceFormData = function(task) {
            var taskIndex = task.number;
            var taskFromList = taskList[taskIndex];

            return {
                id: taskFromList.id,
                title: task.title,
                theme: task.text,
                description: taskFromList.description
            }
        };

        var addNewTaskToList = function(newTask) {
            taskList.push(newTask);

            var newListItem = transformToSingleSelectListItem(newTask);
            tasksSingleSelectListSettings.items.push(newListItem);
            self.tasksSingleSelectList.addNewItem(newListItem, tasksSingleSelectListSettings.typeToClassMapping);

            if (!self.tasksSingleSelectList.isMaxListItemsLimitExceeded()) {
                self.tasksSingleSelectList.setNewVisibilityWindow(tasksSingleSelectListSettings);
            }
        };

        var setStudentsToVariantsList = function(arrayOfStudentId) {
            if (arrayOfStudentId) {
                self.taskIssuanceForm.clearVariants();

                ko.utils.arrayForEach(arrayOfStudentId, function(studentId) {
                    var student = getStudentById(studentId);

                    if (student) {
                        self.taskIssuanceForm.addStudentToVariantList(student);
                    }
                });
            }
        };

        var deleteTaskFromList = function(index) {
            taskList.splice(index, 1);
            tasksSingleSelectListSettings.items.splice(index, 1);
            self.tasksSingleSelectList.deleteItem(index);

            if (!self.tasksSingleSelectList.isMaxListItemsLimitExceeded()) {
                self.tasksSingleSelectList.setNewVisibilityWindow(tasksSingleSelectListSettings);
            }
        };

        var setCountOfSingleSelectListVisibleItems = function() {
            var heightPerOneItem = Senseira.constants.HeightPerOneSingleSelectListElement;
            var minItemsCount = Senseira.constants.MinCountOfSingleSelectListElements;
            var screenHeight = $(window).height();

            if (screenHeight <= heightPerOneItem * minItemsCount) {
                tasksSingleSelectListSettings.maxCountOfVisibleItems = minItemsCount;
            } else {
                tasksSingleSelectListSettings.maxCountOfVisibleItems = parseInt(screenHeight / heightPerOneItem);
            }
            self.tasksSingleSelectList.setNewVisibilityWindow(tasksSingleSelectListSettings);
        };

        var setCountOfMultiSelectListVisibleItems = function() {
            var heightPerOneItem = Senseira.constants.HeightPerOneMultiSelectListElement;
            var minItemsCount = Senseira.constants.MinCountOfMultiSelectListElements;
            var screenHeight = $(window).height();

            if (screenHeight <= heightPerOneItem * minItemsCount) {
                studentsMultiSelectListSettings.maxCountOfVisibleItems = minItemsCount;
            } else {
                studentsMultiSelectListSettings.maxCountOfVisibleItems = parseInt(screenHeight / heightPerOneItem);
            }
            self.studentsMultiSelectList.setNewVisibilityWindow(studentsMultiSelectListSettings);
        };

        var resetMultiSelectListSettingsToInitial = function() {
            studentsMultiSelectListSettings.items = [];
            self.studentsMultiSelectList.setNewSettings(studentsMultiSelectListSettings);
        };

        var transformDataToMultiSelectItems = function(students) {
            if (!students) {
                return null;
            }
            var result = [];

            ko.utils.arrayForEach(students, function(student) {
                var additionalInformation = [];

                additionalInformation.push(['Группа:', student.group].join(' '));
                additionalInformation.push(['Подгруппа:', student.subgroup.join(', ')].join(' '));

                result.push({
                    number: student.number,
                    id: student.id,
                    mainInformation: student.name,
                    additionalInformation: additionalInformation.slice(0, additionalInformation.length)
                });

                additionalInformation.splice(0, additionalInformation.length);
            });

            return result;
        };

        var loadData = function() {
            // GET Ajax query to server
            groups = [
                {
                    number: 350501,
                    students: [
                        {
                            number: 1,
                            id: 0,
                            name: 'Анисько Д.Г',
                            group: 350501,
                            subgroup: [1]
                        },
                        {
                            number: 2,
                            id: 1,
                            name: 'Бардиян М.А',
                            group: 350501,
                            subgroup: [1]
                        },
                        {
                            number: 3,
                            id: 2,
                            name: 'Боровик Е.В',
                            group: 350501,
                            subgroup: [1]
                        },
                        {
                            number: 4,
                            id: 3,
                            name: 'Бреднев Д.А',
                            group: 350501,
                            subgroup: [1]
                        },
                        {
                            number: 5,
                            id: 4,
                            name: 'Бровко Д.О',
                            group: 350501,
                            subgroup: [1]
                        },
                        {
                            number: 6,
                            id: 5,
                            name: 'Бузюма A.Л',
                            group: 350501,
                            subgroup: [1]
                        },
                        {
                            number: 7,
                            id: 6,
                            name: 'Ведом В.A',
                            group: 350501,
                            subgroup: [1]
                        },
                        {
                            number: 8,
                            id: 7,
                            name: 'Дёмин М.И',
                            group: 350501,
                            subgroup: [1]
                        },
                        {
                            number: 9,
                            id: 8,
                            name: 'Завадский В.Г',
                            group: 350501,
                            subgroup: [1]
                        },
                        {
                            number: 10,
                            id: 9,
                            name: 'Канаш В.Н',
                            group: 350501,
                            subgroup: [1]
                        },
                        {
                            number: 11,
                            id: 10,
                            name: 'Карпюк A.Ю',
                            group: 350501,
                            subgroup: [1]
                        },
                        {
                            number: 12,
                            id: 11,
                            name: 'Качур Д.Д',
                            group: 350501,
                            subgroup: [1]
                        },
                        {
                            number: 13,
                            id: 12,
                            name: 'Козлова A.В',
                            group: 350501,
                            subgroup: [1]
                        },
                        {
                            number: 14,
                            id: 13,
                            name: 'Куница Е.Ю',
                            group: 350501,
                            subgroup: [1]
                        },
                        {
                            number: 15,
                            id: 14,
                            name: 'Лисичик A.И',
                            group: 350501,
                            subgroup: [1]
                        },
                        {
                            number: 16,
                            id: 15,
                            name: 'Лысенков П.А',
                            group: 350501,
                            subgroup: [2]
                        },
                        {
                            number: 17,
                            id: 16,
                            name: 'Мазуркевич Е.А',
                            group: 350501,
                            subgroup: [2]
                        },
                        {
                            number: 18,
                            id: 17,
                            name: 'Макоед В.Н',
                            group: 350501,
                            subgroup: [2]
                        },
                        {
                            number: 19,
                            id: 18,
                            name: 'Малыхин К.К',
                            group: 350501,
                            subgroup: [2]
                        },
                        {
                            number: 20,
                            id: 19,
                            name: 'Милько A.В',
                            group: 350501,
                            subgroup: [2]
                        },
                        {
                            number: 21,
                            id: 20,
                            name: 'Никитин К.П',
                            group: 350501,
                            subgroup: [2]
                        },
                        {
                            number: 22,
                            id: 21,
                            name: 'Пашковский A.A',
                            group: 350501,
                            subgroup: [2]
                        },
                        {
                            number: 23,
                            id: 22,
                            name: 'Пешко М.A',
                            group: 350501,
                            subgroup: [2]
                        },
                        {
                            number: 24,
                            id: 23,
                            name: 'Постоялко A.A',
                            group: 350501,
                            subgroup: [2]
                        },
                        {
                            number: 25,
                            id: 23,
                            name: 'Садовский A.В',
                            group: 350501,
                            subgroup: [2]
                        },
                        {
                            number: 26,
                            id: 25,
                            name: 'Слободин О.С',
                            group: 350501,
                            subgroup: [2]
                        },
                        {
                            number: 27,
                            id: 26,
                            name: 'Соловцов В.В',
                            group: 350501,
                            subgroup: [2]
                        },
                        {
                            number: 28,
                            id: 27,
                            name: 'Толкочёв В.И',
                            group: 350501,
                            subgroup: [2]
                        },
                        {
                            number: 29,
                            id: 28,
                            name: 'Шешко В.Р',
                            group: 350501,
                            subgroup: [2]
                        },
                        {
                            number: 30,
                            id: 29,
                            name: 'Шкетов И.С',
                            group: 350501,
                            subgroup: [2]
                        }],
                    subgroups: [1, 2]
                }
            ];
            var tasksListFromServer = [
                {
                    id: 0,
                    typeId: 1,
                    number: 1,
                    theme: 'Исследование сопротивления материалов',
                    description: 'Описание задания'
                },
                {
                    id: 2,
                    typeId: 1,
                    number: 2,
                    theme: 'Исследование сопротивления материалов',
                    description: 'Описание задания'
                },
                {
                    id: 3,
                    typeId: 2,
                    number: 3,
                    theme: 'Исследование сопротивления материалов',
                    description: 'Описание задания'
                },
                {
                    id: 4,
                    typeId: 2,
                    number: 4,
                    theme: 'Исследование сопротивления материалов',
                    description: 'Описание задания'
                },
                {
                    id: 5,
                    typeId: 3,
                    number: 5,
                    theme: 'Исследование сопротивления материалов',
                    description: 'Описание задания'
                },
                {
                    id: 6,
                    typeId: 1,
                    number: 6,
                    theme: 'Исследование сопротивления материалов',
                    description: 'Описание задания'
                },
                {
                    id: 7,
                    typeId: 1,
                    number: 7,
                    theme: 'Исследование сопротивления материалов',
                    description: 'Описание задания'
                },
                {
                    id: 8,
                    typeId: 1,
                    number: 8,
                    theme: 'Исследование сопротивления материалов',
                    description: 'Описание задания'
                }
            ];

            // task initializing
            if (tasksListFromServer) {
                ko.utils.arrayForEach(tasksListFromServer, function(task) {
                    addNewTaskToList(task);
                });
            }

            // filter options initializing
            if (groups) {
                self.groupFilterOptions(ko.utils.arrayMap(groups, function(group) {
                    return group.number;
                }));
            }
        };

        var taskAddingCallback = function(task) {
            var newTask = transformToTaskForList(task);
            addNewTaskToList(newTask);
            Senseira.alerting.success('Задача успешно добалена');
        };

        var taskIndex;

        var updateTaskCallback = function(task) {
            taskIndex = task.number;
            var taskForModal = transformToTaskForModal(taskList[taskIndex]);
            self.taskAddingModal.openModalForUpdatingTask(taskForModal);
        };

        var updateTaskInListCallback = function(task) {
            taskList[taskIndex] = transformToTaskForList(task);
            self.tasksSingleSelectList.updateItem(taskIndex, transformToSingleSelectListItem(taskList[taskIndex]));
            Senseira.alerting.success('Задача успешно обновлена');
        };

        var deleteTaskFromListCallback = function(task) {
            deleteTaskFromList(taskIndex);
            Senseira.alerting.success('Задача успешно удалена.');
        };

        var toggleTaskIssuanceForm = function(task) {
            if (task.isSelected) {
                var taskIssuanceFormData = transformToTaskIssuanceFormData(task);
                self.taskIssuanceForm.show(taskIssuanceFormData);
            } else {
                self.taskIssuanceForm.hide();
            }
        };

        var selectStudentInListCallback = function(studentId) {
            var student = getStudentById(studentId);
            self.taskIssuanceForm.addStudentToVariantList(student);
        };

        var deselectStudentsInListCallback = function(studentId) {
            self.taskIssuanceForm.removeStudentFromVariantList(studentId);
        };

        var subscribeOnEvents = function() {
            self.tasksSingleSelectList.setSelectEventHandler(function(data) {
                toggleTaskIssuanceForm(data);
            });

            self.tasksSingleSelectList.setContextMenuHandler(updateTaskCallback.bind(self));
            self.taskAddingModal.setTaskUpdatingHandler(updateTaskInListCallback.bind(self));
            self.taskAddingModal.setTaskAddingHandler(taskAddingCallback.bind(self));
            self.taskAddingModal.setTaskDeletingHandler(deleteTaskFromListCallback.bind(self));
            self.studentsMultiSelectList.setSelectItemHandler(selectStudentInListCallback.bind(self));
            self.studentsMultiSelectList.setDeselectItemHandler(deselectStudentsInListCallback.bind(self));
        };

        var init = function() {
            setCountOfSingleSelectListVisibleItems();
            setCountOfMultiSelectListVisibleItems();
            loadData();
            subscribeOnEvents();
        };

        //#endregion

        //#region Event Handlers

        self.addNewTask = function() {
            self.taskAddingModal.openModalForAddingTask();
        };

        //#endregion

        init();
    }

    ko.applyBindings(new LabIssuance());
})(ko, jQuery);