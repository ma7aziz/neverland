# Generated by Django 3.0.5 on 2020-05-03 21:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0015_auto_20200503_0421'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='category',
            field=models.CharField(choices=[('princess', 'princess'), ('heroes', 'heroes'), ('cartoons ', 'cartoons'), ('holloween', 'holloween'), ('christmas', 'christmas'), ('jobs', 'jobs'), ('international', 'international'), ('egyptian', 'egyptian'), ('graduation', 'graduation'), ('cosplay', 'cosplay'), ('tv ', 'tv '), ('fashion', 'fashion'), ('historical', 'historical')], default=' ', max_length=50),
        ),
        migrations.AlterField(
            model_name='product',
            name='sector',
            field=models.CharField(choices=[('kids', 'kids'), ('adults', 'adults'), ('accessories', 'accessories')], default=' ', max_length=50),
        ),
        migrations.AlterField(
            model_name='product',
            name='size',
            field=models.ManyToManyField(blank=True, to='pages.Size'),
        ),
        migrations.AlterField(
            model_name='product',
            name='subsector',
            field=models.CharField(choices=[('Kids', (('boy', 'boy'), ('girl', 'girl'), ('baby', 'baby'))), ('Adults', (('men', 'men'), ('women', 'women'))), ('Accessories', (('toys', 'toys'), ('wigs', 'wigs'), ('hats', 'hats'), ('masks', 'masks'), ('decoration', 'decoration'), ('making', 'making')))], default=' ', max_length=50),
        ),
    ]
