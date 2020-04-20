from django.db import models
from django.contrib.auth.models import User
from pages.models import Product , Size

class Cart(models.Model): 
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, null=True, blank=True)
    item = models.ForeignKey('Cart_item', on_delete=models.SET_NULL, null=True)
    is_ordered = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user}'

    def cart_price(self):
        prices = []
        for c in self.cart_item_set.all():
            prices.append(c.total_price())
        return sum(prices)

    def cart_count(self):
        return self.cart_item_set.all().count()


class Cart_item(models.Model):
    shopping_cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    item = models.ForeignKey(Product, on_delete=models.CASCADE)
    qty = models.IntegerField(default=1)
    time = models.DateTimeField(auto_now_add=True)
    size = models.ForeignKey(Size, on_delete=models.SET_NULL, null= True )

    def total_price(self):
        return self.qty * self.item.price

    def __str__(self):
        return self.item.title
