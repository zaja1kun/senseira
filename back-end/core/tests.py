from django.test import TestCase
from django.contrib.auth.models import User
from .models import Student, Teacher, Group, Subject, Task, Variant


def fails_to_save(test_case, model):
    test_case.assertFalse(model.save_if_valid())


class StudentTestCase(TestCase):
    def setUp(self):
        self.student = Student()

    def fails_to_save(self):
        fails_to_save(self, self.student)

    def test_create_empty(self):
        self.fails_to_save()

    def test_create_filled(self):
        user = User.objects.create()
        self.student.user = user
        self.student.save()


class TeacherTestCase(TestCase):
    def setUp(self):
        self.teacher = Teacher()

    def fails_to_save(self):
        fails_to_save(self, self.teacher)

    def test_create_empty(self):
        self.fails_to_save()

    def test_create_filled(self):
        user = User.objects.create()
        self.teacher.user = user
        self.teacher.save()


class GroupTestCase(TestCase):
    def setUp(self):
        self.group = Group()

    def fails_to_save(self):
        fails_to_save(self, self.group)

    def fill_group_name(self):
        self.group.group_name = '350501'

    def fill_monitor(self):
        user = User.objects.create(username='vmakoed')
        monitor = Student.objects.create(user=user)
        self.group.monitor = monitor

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
        self.subject.name = 'ТРиТПО'

    def fill_teacher(self):
        user = User.objects.create(first_name='Наталья', last_name='Искра')
        self.subject.teacher = Teacher.objects.create(user=user)

    def fill_group(self):
        user = User.objects.create(username='vmakoed')
        monitor = Student.objects.create(user=user)
        self.subject.group = Group.objects.create(
            group_name='350501',
            monitor=monitor
        )

    def fill_all(self):
        self.fill_name()
        self.fill_teacher()
        self.fill_group()

    def test_create_empty(self):
        self.fails_to_save()

    def test_create_with_name(self):
        self.fails_to_save()

    def test_get_full_name(self):
        self.fill_all()
        self.assertEqual(
            self.subject.get_full_name(),
            '350501 ТРиТПО - Наталья Искра'
        )

    def test_create_filled(self):
        self.fill_all()
        self.subject.save()


class TaskTestCase(TestCase):
    def setUp(self):
        self.task = Task()

    def fails_to_save(self):
        fails_to_save(self, self.task)

    def fill_name(self):
        self.task.name = 'Написать юнит-тесты.'

    def fill_subject(self):
        user = User.objects.create(first_name='Наталья', last_name='Искра')
        teacher = Teacher.objects.create(user=user)
        user = User.objects.create(username='vmakoed')
        monitor = Student.objects.create(user=user)
        group = Group.objects.create(
            group_name='350501',
            monitor=monitor
        )
        self.task.subject = Subject.objects.create(
            group=group,
            name='ТРиТПО',
            teacher=teacher
        )

    def fill_description(self):
        self.task.description = 'Написать юнит-тесты для бэкенда и фронтенда.'

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
        user = User.objects.create(first_name='Наталья', last_name='Искра')
        teacher = Teacher.objects.create(user=user)
        user = User.objects.create(username='vmakoed')
        monitor = Student.objects.create(user=user)
        group = Group.objects.create(
            group_name='350501',
            monitor=monitor
        )
        subject = Subject.objects.create(
            group=group,
            name='ТРиТПО',
            teacher=teacher
        )
        self.variant.task = Task.objects.create(
            name='Написать юнит-тесты.',
            subject=subject,
            description='Написать юнит-тесты для бэкенда и фронтенда.'
        )

    def fill_description(self):
        self.variant.description = 'Написать юнит-тесты для бэкенда.'

    def fill_student(self):
        user = User.objects.create(username='dtluna')
        self.variant.student = Student.objects.create(user=user)

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
