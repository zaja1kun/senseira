# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0009_auto_20160223_0034'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Tasks',
            new_name='Task',
        ),
    ]
