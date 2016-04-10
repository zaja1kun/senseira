var LabIssuanceModel = null;

if (Senseira.constructors.LabIssuance) {
    LabIssuanceModel = new Senseira.constructors.LabIssuance();
} else {
    throw 'LabIssuance constructor not defined';
}

describe('Lab Issuance', function() {
    describe('getGroupByNumber()', function() {
        it('should return group object when the group exist', function() {
            var group = LabIssuanceModel.testing.getGroupByNumber(350501);

            chai.assert.typeOf(group, 'object', 'group is object');
            chai.assert.equal(group.number, 350501, 'right group number');
        });

        it('should return null when the group not exist', function() {
            var group = LabIssuanceModel.testing.getGroupByNumber(2);

            chai.assert.equal(group, null, 'group is undefined');
        });
    });

    describe('getStudentsBySubgroup()', function() {
        it('should return array of students when subgroup is defined', function() {
            var group = LabIssuanceModel.testing.getGroupByNumber(350501);
            var students = LabIssuanceModel.testing.getStudentBySubgroup(group.students, 2);

            chai.assert.equal(Array.isArray(students), true, 'students is array');
            chai.assert.equal(students.length > 0, true, 'array not empty');
        });

        it('should return empty array when subgroup is undefined', function() {
            var group = LabIssuanceModel.testing.getGroupByNumber(350501);
            var students = LabIssuanceModel.testing.getStudentBySubgroup(group.students, 200);

            chai.assert.equal(Array.isArray(students), true, 'students is array');
            chai.assert.equal(students.length, 0, 'students array is empty');
        });

        it('should return null when input students array is undefined', function() {
            var students = LabIssuanceModel.testing.getStudentBySubgroup(null, 200);

            chai.assert.equal(students, null, 'students is null');
        });
    });

    describe('getStudentById()', function() {
        it('should return students with same id when students is exist', function() {
            LabIssuanceModel.selectedGroup(350501);
            var student = LabIssuanceModel.testing.getStudentById(2);

            chai.assert.typeOf(student, 'object', 'student is object');
            chai.assert.equal(student.id, 2, 'id is equal');
        });

        it('should return null when student isn\'t exist', function() {
            LabIssuanceModel.selectedGroup(350501);
            var student = LabIssuanceModel.testing.getStudentById(200);

            chai.assert.equal(student, null, 'student is null');
        });

        it('should return null when group not selected', function() {
            LabIssuanceModel.selectedGroup(undefined);
            var student = LabIssuanceModel.testing.getStudentById(2);

            chai.assert.equal(student, null, 'student is null');
        });
    });

    describe('getTypeNameByTypeId()', function() {
        it('should return type name when type with same id exist', function() {
            var typeName = LabIssuanceModel.testing.getTypeNameByTypeId(2);

            chai.assert.typeOf(typeName, 'string', 'typeName is string');
        });

        it('should return null when type with same id isn\'t exist', function() {
            var typeName = LabIssuanceModel.testing.getTypeNameByTypeId(7);

            chai.assert.equal(typeName, null, 'typeName is null');
        });
    });

    describe('getTypeIdByTypeName()', function() {
        it('should return type id when type with same name exist', function() {
            var typeId = LabIssuanceModel.testing.getTypeIdByTypeName(Senseira.constants.TaskTypePracticalTask);

            chai.assert.typeOf(typeId, 'number', 'typeId is number');
        });

        it('should return null when type with same name isn\'t exist', function() {
            var typeId = LabIssuanceModel.testing.getTypeIdByTypeName('no name');

            chai.assert.equal(typeId, null, 'typeId is null');
        });
    });

    describe('transformToTaskForModal()', function() {
        it('should return task object if input task object is defined', function() {
            var taskForModal = LabIssuanceModel.testing.transformToTaskForModal({});

            chai.assert.typeOf(taskForModal, 'object', 'taskForModal is object');
        });

        it('should return null if input task object is undefined', function() {
            var taskForModal = LabIssuanceModel.testing.transformToTaskForModal(null);

            chai.assert.equal(taskForModal, null, 'taskForModal is null');
        });
    });

    describe('transformToTaskForList()', function() {
        it('should return task object if input task object is defined', function() {
            var taskForList = LabIssuanceModel.testing.transformToTaskForList({});

            chai.assert.typeOf(taskForList, 'object', 'taskForList is object');
        });

        it('should return null if input task object is undefined', function() {
            var taskForList = LabIssuanceModel.testing.transformToTaskForList(null);

            chai.assert.equal(taskForList, null, 'taskForList is null');
        });
    });

    describe('transformToSingleSelectListItem()', function() {
        it('should return single select list item if input object is defined', function() {
            var singleSelectListItem = LabIssuanceModel.testing.transformToSingleSelectListItem({});

            chai.assert.typeOf(singleSelectListItem, 'object', 'singleSelectListItem is object');
        });

        it('should return null if input object is undefined', function() {
            var singleSelectListItem = LabIssuanceModel.testing.transformToSingleSelectListItem(null);

            chai.assert.equal(singleSelectListItem, null, 'singleSelectListItem is null');
        });
    });

    describe('transformToTaskIssuanceFormData()', function() {
        it('should return task issuance form data if input object is defined', function() {
            var taskIssuanceFormData = LabIssuanceModel.testing.transformToTaskIssuanceFormData({});

            chai.assert.typeOf(taskIssuanceFormData, 'object', 'taskIssuanceFormData is object');
        });

        it('should return null if input object is undefined', function() {
            var taskIssuanceFormData = LabIssuanceModel.testing.transformToTaskIssuanceFormData(null);

            chai.assert.equal(taskIssuanceFormData, null, 'taskIssuanceFormData is null');
        });
    });
});

var TaskAddingModal = null;

if (Senseira.constructors.TaskAddingModal) {
    TaskAddingModal = new Senseira.constructors.TaskAddingModal();
} else {
    throw 'Task adding modal constructor undefined';
}

describe('Task Adding Modal', function() {
    describe('fillForm()', function() {
        it('should fill all form properties with passed values if task is defined', function() {
            TaskAddingModal.testing.fillForm({
                taskId: 7,
                taskNumber: 2,
                typeName: 'type name',
                taskTheme: 'theme',
                taskDescription: 'description'
            });

            chai.assert.equal(TaskAddingModal.taskId, 7);
            chai.assert.equal(TaskAddingModal.taskNumber(), 2);
            chai.assert.equal(TaskAddingModal.taskTypeSelectedOption(), 'type name');
            chai.assert.equal(TaskAddingModal.taskTheme(), 'theme');
            chai.assert.equal(TaskAddingModal.taskDescription(), 'description');
        });

        it('should leave previous values if task undefined', function() {
            var previousTaskId = TaskAddingModal.taskId;
            var previousTaskNumber = TaskAddingModal.taskNumber();
            var previousSelectedOption = TaskAddingModal.taskTypeSelectedOption();
            var previousTaskTheme = TaskAddingModal.taskTheme();
            var previousTaskDescription = TaskAddingModal.taskDescription();

            TaskAddingModal.testing.fillForm(null);

            chai.assert.equal(TaskAddingModal.taskId, previousTaskId);
            chai.assert.equal(TaskAddingModal.taskNumber(), previousTaskNumber);
            chai.assert.equal(TaskAddingModal.taskTypeSelectedOption(), previousSelectedOption);
            chai.assert.equal(TaskAddingModal.taskTheme(), previousTaskTheme);
            chai.assert.equal(TaskAddingModal.taskDescription(), previousTaskDescription);
        });
    });

    describe('clearForm()', function() {
        it('should set form properties to default', function() {
            TaskAddingModal.testing.clearForm();

            chai.assert.equal(TaskAddingModal.taskId, Senseira.constants.DefaultTaskId);
            chai.assert.equal(TaskAddingModal.taskNumber(), null);
            chai.assert.equal(TaskAddingModal.taskTypeSelectedOption(), Senseira.constants.TaskTypeLab);
            chai.assert.equal(TaskAddingModal.taskTheme(), '');
            chai.assert.equal(TaskAddingModal.taskDescription(), '');
        });

        it('should remove validation errors', function() {
            TaskAddingModal.validationErrors.push('Error');
            TaskAddingModal.testing.clearForm();

            chai.assert.equal(TaskAddingModal.validationErrors().length, 0);
        });
    });

    describe('getFormData()', function() {
        it('should return object with form data', function() {
            var taskId = TaskAddingModal.taskId;
            var taskNumber = TaskAddingModal.taskNumber();
            var selectedOption = TaskAddingModal.taskTypeSelectedOption();
            var taskTheme = TaskAddingModal.taskTheme();
            var taskDescription = TaskAddingModal.taskDescription();

            var data = TaskAddingModal.testing.getFormData();

            chai.assert.typeOf(data.taskId, 'number');
            chai.assert.equal(data.taskNumber, taskNumber);
            chai.assert.equal(data.taskTypeName, selectedOption);
            chai.assert.equal(data.taskTheme, taskTheme);
            chai.assert.equal(data.taskDescription, taskDescription);
        });

        it('should return object with default task id if adding mode enabled', function() {
            TaskAddingModal.isAddingMode(true);
            var data = TaskAddingModal.testing.getFormData();

            chai.assert.equal(data.taskId, Senseira.constants.DefaultTaskId);
        });
    });
});

var TaskIssuanceForm = null;

if (Senseira.constructors.TaskIssuanceForm) {
    TaskIssuanceForm = new Senseira.constructors.TaskIssuanceForm();
} else {
    throw 'Task issuance form not defined';
}

describe('Task Issuance Form', function() {
    describe('addStudentToVariantList()', function() {
        it('student should be added to list as variant if student object is defined', function() {
            TaskIssuanceForm.testing.addStudentToVariantList({ id: 5, name: 'name' });
            var variants = TaskIssuanceForm.variants();

            var variant = ko.utils.arrayFirst(variants, function (variant) {
                return variant.studentId === 5;
            });

            chai.assert.typeOf(variant, 'object');
        });

        it('student should be added to list as variant if student object is undefined', function() {
            var previousVariantsLength = TaskIssuanceForm.variants().length;
            TaskIssuanceForm.testing.addStudentToVariantList(null);

            chai.assert.equal(TaskIssuanceForm.variants().length, previousVariantsLength);
        });
    });

    describe('removeStudentFromVariantList()', function() {
        it('variant with same student id will be removed if exist', function() {
            TaskIssuanceForm.testing.addStudentToVariantList({ id: 6, name: 'name' });
            TaskIssuanceForm.testing.removeStudentFromVariantList(6);
            var variants = TaskIssuanceForm.variants();

            var variant = ko.utils.arrayFirst(variants, function (variant) {
                return variant.studentId === 6;
            });

            chai.assert.equal(variant, null);
        });

        it('variant with same student id shouldn\'t be removed if not exist', function() {
            var previousVariantsLength = TaskIssuanceForm.variants().length;
            TaskIssuanceForm.testing.removeStudentFromVariantList(890);

            chai.assert.equal(TaskIssuanceForm.variants().length, previousVariantsLength);
        });
    });

    describe('clearVariants()', function() {
        it('all variants should be removed', function() {
            TaskIssuanceForm.testing.clearVariants();

            chai.assert.equal(TaskIssuanceForm.variants().length, 0);
        });
    });
});