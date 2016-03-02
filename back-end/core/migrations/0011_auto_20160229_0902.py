# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0010_auto_20160223_1654'),
    ]

    operations = [
        migrations.CreateModel(
            name='Variant',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, primary_key=True, auto_created=True)),
                ('description', models.TextField(blank=True)),
                ('is_passed', models.BooleanField()),
                ('student', models.ForeignKey(to='core.Student')),
            ],
        ),
        migrations.DeleteModel(
            name='Variants',
        ),
        migrations.AddField(
            model_name='task',
            name='description',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='task',
            name='subject',
            field=models.ForeignKey(to='core.Subject', default=None),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='variant',
            name='task',
            field=models.ForeignKey(to='core.Task'),
        ),
    ]
