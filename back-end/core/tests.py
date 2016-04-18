from django.test import TestCase
from django.contrib.auth.models import User
from .models import Student, Teacher, Group, Subject, Task, Variant
from random import choice
from string import ascii_letters, digits

ASCII = ascii_letters + digits


def random_alphanumeric(size=6):
    result = ''
    for _ in range(size):
        result += choice(ASCII)
    return result


def fails_to_save(test_case, model):
    test_case.assertFalse(model.save_if_valid())


def create_user():
    return User.objects.create(username=random_alphanumeric())


def create_student():
    return Student.objects.create(user=create_user())


def create_teacher():
    return Teacher.objects.create(user=create_user())


def create_group():
    return Group.objects.create(
        group_name=random_alphanumeric(),
        monitor=create_student()
    )


def create_subject():
    return Subject.objects.create(
        group=create_group(),
        name=random_alphanumeric(),
        teacher=create_teacher()
    )


def create_task():
    return Task.objects.create(
        name=random_alphanumeric(),
        subject=create_subject(),
        description=random_alphanumeric()
    )


class StudentTestCase(TestCase):
    def setUp(self):
        self.student = Student()

    def fails_to_save(self):
        fails_to_save(self, self.student)

    def test_create_empty(self):
        self.fails_to_save()

    def test_create_filled(self):
        self.student.user = create_user()
        self.student.save()


class TeacherTestCase(TestCase):
    def setUp(self):
        self.teacher = Teacher()

    def fails_to_save(self):
        fails_to_save(self, self.teacher)

    def test_create_empty(self):
        self.fails_to_save()

    def test_create_filled(self):
        self.teacher.user = create_user()
        self.teacher.save()


class GroupTestCase(TestCase):
    def setUp(self):
        self.group = Group()

    def fails_to_save(self):
        fails_to_save(self, self.group)

    def fill_group_name(self):
        self.group.group_name = random_alphanumeric()

    def fill_monitor(self):
        self.group.monitor = create_student()

    def test_create_empty(self):
        self.fails_to_save()

    def test_create_with_name(self):
        self.fill_group_name()
        self.fails_to_save()

    def test_create_with_monitor(self):
        self.fill_monitor()
        self.fails_to_save()

    def test_create_filled(self):
        self.fill_monitor()
        self.fill_group_name()
        self.group.save()


class SubjectTestCase(TestCase):
    def setUp(self):
        self.subject = Subject()

    def fails_to_save(self):
        fails_to_save(self, self.subject)

    def fill_name(self):
        self.subject.name = random_alphanumeric()

    def fill_teacher(self):
        self.subject.teacher = create_teacher()

    def fill_group(self):
        self.subject.group = create_group()

    def fill_all(self):
        self.fill_name()
        self.fill_teacher()
        self.fill_group()

    def test_create_empty(self):
        self.fails_to_save()

    def test_create_with_name(self):
        self.fails_to_save()

    def test_create_filled(self):
        self.fill_all()
        self.subject.save()


class TaskTestCase(TestCase):
    def setUp(self):
        self.task = Task()

    def fails_to_save(self):
        fails_to_save(self, self.task)

    def fill_name(self):
        self.task.name = random_alphanumeric()

    def fill_subject(self):
        self.task.subject = create_subject()

    def fill_description(self):
        self.task.description = random_alphanumeric()

    def fill_all(self):
        self.fill_name()
        self.fill_subject()
        self.fill_description()

    def test_create_empty(self):
        self.fails_to_save()

    def test_create_with_name(self):
        self.fill_name()
        self.fails_to_save()

    def test_create_with_description(self):
        self.fill_description()
        self.fails_to_save()

    def test_create_with_subject(self):
        self.fill_subject()
        self.fails_to_save()

    def test_create_filled(self):
        self.fill_all()
        self.task.save()


class VariantTestCase(TestCase):
    def setUp(self):
        self.variant = Variant()

    def fails_to_save(self):
        fails_to_save(self, self.variant)

    def fill_task(self):
        self.variant.task = create_task()

    def fill_description(self):
        self.variant.description = random_alphanumeric()

    def fill_student(self):
        self.variant.student = create_student()

    def fill_is_passed(self):
        self.variant.is_passed = False

    def fill_all(self):
        self.fill_task()
        self.fill_description()
        self.fill_student()
        self.fill_is_passed()

    def test_create_empty(self):
        self.fails_to_save()

    def test_create_with_task(self):
        self.fill_task()
        self.fails_to_save()

    def test_create_with_description(self):
        self.fill_description()
        self.fails_to_save()

    def test_create_with_student(self):
        self.fill_student()
        self.fails_to_save()

    def test_create_with_is_passed(self):
        self.fill_is_passed()
        self.fails_to_save()

    def test_create_filled(self):
        self.fill_all()
        self.variant.save()
