# Generated by Django 3.0.5 on 2020-04-17 00:51

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0011_size_abb'),
        ('cart', '0002_auto_20200412_2059'),
    ]

    operations = [
        migrations.AddField(
            model_name='cart_item',
            name='size',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='pages.Size'),
        ),
    ]
