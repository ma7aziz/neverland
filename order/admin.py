from django.contrib import admin
from .models import Customer , Order
# Register your models here.
admin.site.register(Customer)


class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer', 'total_price', 'timestamp', 'delivered')
    list_display_links = ('id','customer')
    list_editable = ('delivered',)
    list_filter =('delivered','customer')
    list_per_page = 20
    
admin.site.register(Order, OrderAdmin)