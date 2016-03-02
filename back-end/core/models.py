from django.db import models
from django.contrib.auth.models import User


class Student(models.Model):
    user = models.OneToOneField(User)

    def __str__(self):
        name = self.user.first_name + ' ' + self.user.last_name
        return name if len(name) > 1 else self.user.__str__()


class Teacher(models.Model):
    user = models.OneToOneField(User)

    def __str__(self):
        name = self.user.first_name + ' ' + self.user.last_name
        return name if len(name) > 1 else self.user.__str__()


class Subject(models.Model):
    name = models.CharField(max_length=30)
    teacher = models.ForeignKey(Teacher)
    # group = models.ForeignKey(Group)

    def __str__(self):
        return self.name


class Group(models.Model):
    group_name = models.CharField(max_length=10)
    students = models.ManyToManyField(Student, blank=True)
    monitor = models.ForeignKey(Student, related_name='group_monitor')
    subjects = models.ManyToManyField(Subject, blank=True)

    def __str__(self):
        return self.group_name


class Task(models.Model):
    name = models.CharField(max_length=30)
    subject = models.ForeignKey(Subject)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Variant(models.Model):
    task = models.ForeignKey(Task)
    description = models.TextField(blank=True)
    student = models.ForeignKey(Student)
    is_passed = models.BooleanField()

    def __str__(self):
        return self.student + ' | ' + self.task
