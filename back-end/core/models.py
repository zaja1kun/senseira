from django.db import models
from django.contrib.auth.models import User


class Student(models.Model):
    user = models.OneToOneField(User, verbose_name=User._meta.verbose_name)

    def __str__(self):
        name = '{0} {1}'.format(self.user.first_name, self.user.last_name)
        return name if len(name) > 1 else self.user.__str__()

    class Meta:
        verbose_name = "студент"
        verbose_name_plural = "студенты"


class Teacher(models.Model):
    user = models.OneToOneField(User, verbose_name=User._meta.verbose_name)

    def __str__(self):
        name = '{0} {1}'.format(self.user.first_name, self.user.last_name)
        return name if len(name) > 1 else self.user.__str__()

    class Meta:
        verbose_name = "преподаватель"
        verbose_name_plural = "преподаватели"


class Group(models.Model):
    group_name = models.CharField(max_length=10, verbose_name="номер группы")
    students = models.ManyToManyField(Student, blank=True, verbose_name=Student._meta.verbose_name_plural)
    monitor = models.ForeignKey(Student, related_name='group_monitor', verbose_name="староста")

    def __str__(self):
        return self.group_name

    def get_subjects(self):
        return ''.join(['<p>{0} ({1})</p>'.format(subject.name, subject.teacher.__str__()) for subject in Subject.objects.filter(group=self)])

    class Meta:
        verbose_name = "группа"
        verbose_name_plural = "группы"


class Subject(models.Model):
    name = models.CharField(max_length=30, verbose_name="название")
    teacher = models.ForeignKey(Teacher, verbose_name=Teacher._meta.verbose_name)
    group = models.ForeignKey(Group, verbose_name=Group._meta.verbose_name)

    def __str__(self):
        return self.name

    def get_full_name(self):
        return '{0} {1} - {2}'.format(self.group.group_name, self.name, self.teacher.__str__())

    class Meta:
        verbose_name = "предмет"
        verbose_name_plural = "предметы"


class Task(models.Model):
    name = models.CharField(max_length=200, verbose_name="название")
    subject = models.ForeignKey(Subject, verbose_name=Subject._meta.verbose_name)
    description = models.TextField(blank=True, verbose_name="описание")

    def __str__(self):
        return self.name

    def get_description_preview(self):
        if len(self.description) > 50:
            return '{0}...'.format(self.description[:50])
        return self.description

    def get_teacher(self):
        return self.subject.teacher

    def get_group(self):
        return self.subject.group

    class Meta:
        verbose_name = "задание"
        verbose_name_plural = "задания"


class Variant(models.Model):
    task = models.ForeignKey(Task, verbose_name=Task._meta.verbose_name)
    description = models.TextField(blank=True, verbose_name="описание")
    student = models.ForeignKey(Student, verbose_name=Student._meta.verbose_name)
    is_passed = models.BooleanField(verbose_name="сдано")

    def __str__(self):
        return self.student.__str__()

    class Meta:
        verbose_name = "вариант"
        verbose_name_plural = "варианты"
