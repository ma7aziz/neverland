from django.db import models

# Create your models here.
class Post(models.Model):
    title = models.CharField(max_length=200)
    content  = models.TextField()
    photo_main = models.ImageField(upload_to='photos/news/%y/%m/')
    photo_1 = models.ImageField(upload_to='photos/%y/%m/',blank=True)
    photo_2 = models.ImageField(upload_to='photos/%y/%m/',blank=True)
    photo_3 = models.ImageField(upload_to='photos/%y/%m/',blank=True)
    photo_4 = models.ImageField(upload_to='photos/%y/%m/',blank=True)
    photo_5 = models.ImageField(upload_to='photos/%y/%m/',blank=True)
    photo_6 = models.ImageField(upload_to='photos/%y/%m/',blank=True)
    is_published = models.BooleanField(default=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title