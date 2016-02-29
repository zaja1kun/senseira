# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0008_auto_20160223_0017'),
    ]

    operations = [
        migrations.CreateModel(
            name='Group',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', auto_created=True, primary_key=True)),
                ('group_name', models.CharField(max_length=10)),
                ('monitor', models.ForeignKey(to='core.Student', related_name='group_monitor')),
                ('students', models.ManyToManyField(to='core.Student', blank=True)),
                ('subjects', models.ManyToManyField(to='core.Subject', blank=True)),
            ],
        ),
        migrations.RemoveField(
            model_name='groups',
            name='monitor',
        ),
        migrations.RemoveField(
            model_name='groups',
            name='students',
        ),
        migrations.RemoveField(
            model_name='groups',
            name='subjects',
        ),
        migrations.DeleteModel(
            name='Groups',
        ),
    ]
