# Generated by Django 3.0.5 on 2020-04-13 15:36

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0005_auto_20200408_2133'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='related_item2',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='item2', to='pages.Product'),
        ),
        migrations.AddField(
            model_name='product',
            name='related_item3',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, to='pages.Product'),
        ),
        migrations.AlterField(
            model_name='product',
            name='related_item1',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='item_related', to='pages.Product'),
        ),
    ]
