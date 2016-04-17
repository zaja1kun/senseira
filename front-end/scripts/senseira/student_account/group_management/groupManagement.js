var Senseira = Senseira || {};
Senseira.constants = Senseira.constants || {};
Senseira.constructors = Senseira.constructors || {};
Senseira.alerting = Senseira.alerting || {};

(function(ko, $) {
    'use strict';

    function GroupManagement() {
        //#region Fields
        var self = this;
        var mockGroup = null; // mock variable
        var group = null;
        var prospectiveSearchResults = [];
        var studentsMultiSelectListSettings = {
            isNumberedList: true,
            isSelfNumberedList: true,
            showSelectingStatistic: true,
            maxCountOfVisibleItems: Senseira.constants.MinCountOfMultiSelectListElements,
            items: []
        };

        self.isGroupCreationMode = ko.observable(true);
        self.groupNumber = ko.observable('');
        self.studentSearchString = ko.observable('');
        self.searchResultsList = ko.observableArray([]);

        self.studentsMultiSelectList = new Senseira.constructors.MultiSelectList(studentsMultiSelectListSettings);
        self.subgroupAddingModal = new Senseira.constructors.SubgroupAddingModal();
        self.listEditingModal = new Senseira.constructors.SubgroupEditingModal();
        self.warningBeforeGroupDeletingModal = new Senseira.constructors.WarningBeforeGroupDeletingModal();

        //#endregion

        //#region Subscribers

        $(window).resize(setCountOfMultiSelectListVisibleItems);
        self.studentSearchString.subscribe(studentSearchStringChangeHandler);
        self.groupNumber.subscribe(groupNumberChangeHandler);

        //endregion

        //#region Computed

        self.isSearchResultsListVisible = ko.computed(function() {
            return self.searchResultsList().length > 0;
        });

        //#endregion

        //#region Private methods

        function getRemoteResultsByStudentName(pattern) {
            if (pattern) {
                var students = mockGroup.students;
                var results = ko.utils.arrayFilter(students, function(student) {
                    return student.name.indexOf(pattern) !== -1;
                });
                return results || [];
            }
            return [];
        }

        function getRemoteResultsByGroupNumber(pattern) {
            if (pattern) {
                var students = mockGroup.students;
                var results = ko.utils.arrayFilter(students, function(student) {
                    if (student.group) {
                        return student.group.indexOf(pattern) !== -1;
                    }
                    return false;
                });
                return results || [];
            }
            return [];
        }

        function studentIsExistInGroupList(studentId) {
            if (group.students) {
                var student = ko.utils.arrayFirst(group.students, function(student) {
                    return student.id === studentId;
                });

                return !!student;
            }
            return false;
        }

        function removeDeletedSubgroupsFromList() {
            if (group.subgroups && group.students) {
                var deletedSubgroups = [];

                ko.utils.arrayForEach(group.subgroups, function(subgroup) {
                    var studentWithSubgroup = ko.utils.arrayFirst(group.students, function(student) {
                        return student.subgroup && student.subgroup.indexOf(subgroup) !== -1;
                    });

                    if (!studentWithSubgroup) {
                        deletedSubgroups.push(subgroup);
                    }
                });

                ko.utils.arrayForEach(deletedSubgroups, function(deletedSubgroup) {
                    var index = group.subgroups.indexOf(deletedSubgroup);

                    if (index !== -1) {
                        group.subgroups.splice(index, 1);
                    }
                });
            } else if (!group.students) {
                group.subgroups = [];
            }
        }

        function setGroupNumberForStudents(newGroupNumber) {
            if (group.students) {
                ko.utils.arrayForEach(group.students, function(student) {
                    student.group = newGroupNumber;
                });
                updateGroupList();
            }
        }

        function updateGroupList() {
            studentsMultiSelectListSettings.items = transformDataToMultiSelectItems(group.students);
            self.studentsMultiSelectList.setNewSettings(studentsMultiSelectListSettings);
        }

        function transformDataToMultiSelectItems(students) {
            if (!students || !Array.isArray(students)) {
                return null;
            }
            var result = [];

            ko.utils.arrayForEach(students, function(student) {
                var additionalInformation = [];

                if (student.email) {
                    additionalInformation.push(['Почта:', student.email].join(' '));
                }

                if (student.group) {
                    additionalInformation.push(['Группа:', student.group].join(' '));
                }

                if (student.subgroup) {
                    additionalInformation.push(['Подгруппа:', student.subgroup.join(', ')].join(' '));
                }

                result.push({
                    number: student.number,
                    id: student.id,
                    mainInformation: student.name,
                    additionalInformation: additionalInformation.slice(0, additionalInformation.length)
                });

                additionalInformation.splice(0, additionalInformation.length);
            });

            return result;
        }

        function setCountOfMultiSelectListVisibleItems() {
            var heightPerOneItem = Senseira.constants.HeightPerOneMultiSelectListElement;
            var minItemsCount = Senseira.constants.MinCountOfMultiSelectListElements;
            var screenHeight = $(window).height();

            if (screenHeight <= heightPerOneItem * minItemsCount) {
                studentsMultiSelectListSettings.maxCountOfVisibleItems = minItemsCount;
            } else {
                studentsMultiSelectListSettings.maxCountOfVisibleItems = parseInt(screenHeight / heightPerOneItem);
            }
            self.studentsMultiSelectList.setNewVisibilityWindow(studentsMultiSelectListSettings);
        }

        function loadGroup(groupNumber) {
            return null;
        }

        function loadData() {
            mockGroup =
            {
                number: "350501",
                students: [
                    {
                        id: 0,
                        name: 'Анисько Д.Г',
                        email: 'Wolendrang@gmail.com'
                    },
                    {
                        id: 1,
                        name: 'Бардиян М.А',
                        group: "350501",
                        email: 'Wolendrang@gmail.com'
                    },
                    {
                        id: 2,
                        name: 'Боровик Е.В',
                        group: "350501",
                        email: 'Wolendrang@gmail.com'
                    },
                    {
                        id: 3,
                        name: 'Бреднев Д.А',
                        group: "350501",
                        email: 'Wolendrang@gmail.com'
                    },
                    {
                        id: 4,
                        name: 'Бровко Д.О',
                        email: 'Wolendrang@gmail.com'
                    },
                    {
                        id: 5,
                        name: 'Бузюма A.Л',
                        email: 'Wolendrang@gmail.com'
                    },
                    {
                        id: 6,
                        name: 'Ведом В.A',
                        group: "350501",
                        email: 'Wolendrang@gmail.com'
                    },
                    {
                        id: 7,
                        name: 'Дёмин М.И',
                        group: "350501",
                        email: 'Wolendrang@gmail.com'
                    },
                    {
                        id: 8,
                        name: 'Завадский В.Г',
                        email: 'Wolendrang@gmail.com'
                    },
                    {
                        id: 9,
                        name: 'Канаш В.Н',
                        group: "350501",
                        email: 'Wolendrang@gmail.com'
                    },
                    {
                        id: 10,
                        name: 'Карпюк A.Ю',
                        group: "350501",
                        email: 'Wolendrang@gmail.com'
                    },
                    {
                        id: 11,
                        name: 'Качур Д.Д',
                        email: 'Wolendrang@gmail.com'
                    },
                    {
                        id: 12,
                        name: 'Козлова A.В',
                        email: 'Wolendrang@gmail.com'
                    },
                    {
                        id: 13,
                        name: 'Куница Е.Ю',
                        group: "350501",
                        email: 'Wolendrang@gmail.com'
                    },
                    {
                        id: 14,
                        name: 'Лисичик A.И',
                        group: "350501",
                        email: 'Wolendrang@gmail.com'
                    },
                    {
                        id: 15,
                        name: 'Лысенков П.А',
                        group: "350501",
                        email: 'Wolendrang@gmail.com'
                    },
                    {
                        id: 16,
                        name: 'Мазуркевич Е.А',
                        email: 'Wolendrang@gmail.com'
                    },
                    {
                        id: 17,
                        name: 'Макоед В.Н',
                        email: 'Wolendrang@gmail.com'
                    },
                    {
                        id: 18,
                        name: 'Малыхин К.К',
                        group: "350501",
                        email: 'Wolendrang@gmail.com'
                    },
                    {
                        id: 19,
                        name: 'Милько A.В',
                        email: 'Wolendrang@gmail.com'
                    },
                    {
                        id: 20,
                        name: 'Никитин К.П',
                        email: 'Wolendrang@gmail.com'
                    },
                    {
                        id: 21,
                        name: 'Пашковский A.A',
                        email: 'Wolendrang@gmail.com'
                    },
                    {
                        id: 22,
                        name: 'Пешко М.A',
                        email: 'Wolendrang@gmail.com'
                    },
                    {
                        id: 23,
                        name: 'Постоялко A.A',
                        email: 'Wolendrang@gmail.com'
                    },
                    {
                        id: 23,
                        name: 'Садовский A.В',
                        email: 'Wolendrang@gmail.com'
                    },
                    {
                        id: 25,
                        name: 'Слободин О.С',
                        email: 'Wolendrang@gmail.com'
                    },
                    {
                        id: 26,
                        name: 'Соловцов В.В',
                        group: "350501",
                        email: 'Wolendrang@gmail.com'
                    },
                    {
                        id: 27,
                        name: 'Толкочёв В.И',
                        email: 'Wolendrang@gmail.com'
                    },
                    {
                        id: 28,
                        name: 'Шешко В.Р',
                        group: "350501",
                        email: 'Wolendrang@gmail.com'
                    },
                    {
                        id: 29,
                        name: 'Шкетов И.С',
                        email: 'Wolendrang@gmail.com'
                    }],
                subgroups: []
            };

            if (self.isGroupCreationMode()) {
                group = {
                    number: null,
                    students: [],
                    subgroups: []
                }
            } else {
                var groupNumberFromServer = 350502; // mock object
                var groupFromServer = loadGroup(groupNumberFromServer);

                if (groupFromServer) {
                    group = groupFromServer;
                    self.groupNumber(group.number.toString());
                    studentsMultiSelectListSettings.items = transformDataToMultiSelectItems(group.students);
                }
            }
            self.studentsMultiSelectList.setNewSettings(studentsMultiSelectListSettings);
        }

        function attachEventHandlers() {
            self.subgroupAddingModal.setSubgroupAddingHandler(subgroupAddingHandler.bind(this));
            self.listEditingModal.setListApplyChangesHandler(studentListEditingHandler.bind(this));
        }

        function init() {
            setCountOfMultiSelectListVisibleItems();
            loadData();
            attachEventHandlers();
        }

        //#endregion

        //#region Event Handlers

        function studentSearchStringChangeHandler(newSearchPattern) {
            var searchResults = getRemoteResultsByStudentName(newSearchPattern);

            if (!newSearchPattern && prospectiveSearchResults.length > 0) {
                self.searchResultsList(prospectiveSearchResults);
            } else {
                self.searchResultsList(searchResults);
            }
        }

        function groupNumberChangeHandler(newGroupNumber) {
            group.number = newGroupNumber;
            setGroupNumberForStudents(newGroupNumber);
            prospectiveSearchResults = getRemoteResultsByGroupNumber(newGroupNumber);

            if (self.searchResultsList().length === 0 || !self.studentSearchString()) {
                self.searchResultsList(prospectiveSearchResults);
            }
        }

        function subgroupAddingHandler(newSubgroup) {
            if (group.subgroups && group.subgroups.indexOf(newSubgroup) === -1) {
                group.subgroups.push(newSubgroup);
            }
            if (group.students) {
                var selectedStudentIds = self.studentsMultiSelectList.getIdOfSelectedItems();

                ko.utils.arrayForEach(group.students, function(student) {
                    if (selectedStudentIds.indexOf(student.id) !== -1) {
                        if (student.subgroup && student.subgroup.indexOf(newSubgroup) === -1) {
                            student.subgroup.push(newSubgroup);
                        } else if (!student.subgroup) {
                            student.subgroup = [];
                            student.subgroup.push(newSubgroup);
                        }
                    }
                });
                updateGroupList();
            }
        }

        function studentListEditingHandler(newStudentsList) {
            group.students = newStudentsList;
            removeDeletedSubgroupsFromList();
            updateGroupList();
        }

        self.addStudentToGroup = function(student) {
            var inputStudent = $.extend(true, {}, student);

            if (!studentIsExistInGroupList(inputStudent.id)) {
                if (group.students) {
                    inputStudent.number = group.students.length + 1;
                    inputStudent.group = group.number;
                    group.students.push(inputStudent);
                    updateGroupList();
                }
            }
        };

        self.addNewSubgroup = function() {
            self.subgroupAddingModal.openModal();
        };

        self.editStudentList = function() {
            self.listEditingModal.openModal(group.students);
        };

        self.createGroup = function() {
            self.isGroupCreationMode(false);
        };

        self.deleteGroup = function() {
            self.warningBeforeGroupDeletingModal.openModal();
        };

        //#endregion

        //#region Testing

        self.testing = {
            studentIsExistInGroupList: studentIsExistInGroupList,
            removeDeletedSubgroupsFromList: removeDeletedSubgroupsFromList,
            transformDataToMultiSelectListItem: transformDataToMultiSelectItems,
            getRemoteResultsByStudentName: getRemoteResultsByStudentName,
            getRemoteResultsByGroupNumber: getRemoteResultsByGroupNumber
        };

        //#endregion

        init();
    }

    Senseira.constructors.GroupManagement = GroupManagement;

    if (!window.testingMode) {
        ko.applyBindings(new GroupManagement());
    }

})(ko, jQuery);