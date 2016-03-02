# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0006_auto_20160222_2300'),
    ]

    operations = [
        migrations.AddField(
            model_name='teacher',
            name='subjects',
            field=models.ManyToManyField(to='core.Subjects'),
        ),
    ]
