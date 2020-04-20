from django.contrib import admin
from .models import  Cart ,  Cart_item
# Register your models here.


admin.site.register(Cart_item)



class CartAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'is_ordered', 'cart_price', )
    list_display_links = ('id','user')
    
    list_filter =('is_ordered', )
    list_per_page = 20



admin.site.register(Cart, CartAdmin)