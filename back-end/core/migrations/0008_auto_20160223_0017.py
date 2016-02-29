# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('core', '0007_teacher_subjects'),
    ]

    operations = [
        migrations.CreateModel(
            name='Subject',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, primary_key=True, verbose_name='ID')),
                ('name', models.CharField(max_length=30)),
            ],
        ),
        migrations.RemoveField(
            model_name='student',
            name='department',
        ),
        migrations.RemoveField(
            model_name='teacher',
            name='subjects',
        ),
        migrations.AddField(
            model_name='groups',
            name='monitor',
            field=models.ForeignKey(related_name='group_monitor', default='', to='core.Student'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='groups',
            name='students',
            field=models.ManyToManyField(to='core.Student'),
        ),
        migrations.AddField(
            model_name='student',
            name='user',
            field=models.OneToOneField(default='', to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
        migrations.DeleteModel(
            name='Subjects',
        ),
        migrations.AddField(
            model_name='subject',
            name='teacher',
            field=models.ForeignKey(to='core.Teacher'),
        ),
        migrations.AddField(
            model_name='groups',
            name='subjects',
            field=models.ManyToManyField(to='core.Subject'),
        ),
    ]
