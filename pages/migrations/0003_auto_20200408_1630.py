# Generated by Django 3.0.5 on 2020-04-08 14:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0002_auto_20200408_1437'),
    ]

    operations = [
        migrations.AlterField(
            model_name='subcategory',
            name='title',
            field=models.CharField(max_length=150),
        ),
    ]
