# Generated by Django 3.0.5 on 2020-04-13 16:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0006_auto_20200413_1736'),
    ]

    operations = [
        migrations.CreateModel(
            name='HomeSlides',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('home_image', models.ImageField(upload_to='photos/home_slides')),
            ],
        ),
    ]
