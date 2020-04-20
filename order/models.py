from django.db import models
from cart.models import Cart
from django.contrib.auth.models import User
# Create your models here.
class Order(models.Model):
    customer = models.ForeignKey('Customer', on_delete=models.SET_NULL, null=True)
    items = models.ForeignKey(Cart, on_delete=models.DO_NOTHING)
    total_price = models.DecimalField(max_digits=10, decimal_places= 2)
    timestamp = models.DateTimeField(auto_now_add=True)
    order_comments = models.TextField(blank=True)
    delivered = models.BooleanField(default=False)
    def __str__(self):
        return str(self.id)
    

class Customer(models.Model):
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING, null=True, blank=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.CharField(max_length=200)
    address = models.TextField()
    city = models.CharField(max_length= 100)
    governrate = models.CharField(max_length=100)

    def __str__(self):
        return f'{self.first_name} {self.last_name}'
    

