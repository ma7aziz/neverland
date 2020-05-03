from django.contrib import admin
from .models import Category, Product , Subcategory , Review, HomeSlides , Size
# Register your models here.



class PoroductAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'category', 'featured', 'active', 'sector', 'subsector')
    list_display_links = ('id','title')
    list_editable = ('featured','active' , 'sector', 'category' ,'subsector')
    list_filter =('category','active', 'featured')
    list_per_page = 20


admin.site.register(Product, PoroductAdmin)
admin.site.register(Category)
admin.site.register(Subcategory)
admin.site.register(Review)
admin.site.register(HomeSlides)
admin.site.register(Size)