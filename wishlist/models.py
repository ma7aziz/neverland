from django.db import models
from django.contrib.auth.models import User
from pages.models import Product

# Create your models here.


class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    item = models.ForeignKey('Wishlist_item', on_delete=models.CASCADE, blank=True, null=True, related_name='list_item')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user} ' 


class Wishlist_item(models.Model):
    wishlist = models.ForeignKey(Wishlist, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.product.title)
