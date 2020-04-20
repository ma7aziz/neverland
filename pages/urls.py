from django.urls import path, include
from .import views
urlpatterns = [
    path('', views.index, name='index' ),
    path('product/<int:id>', views.product, name='product' ),
    path('review', views.review, name='review'),
    path('category/<category>', views.category, name='category'),
    path('sub/<int:id>', views.subcategory, name='subcategory'),
    path('search', views.search, name='search'),
    path('shop',views.shop, name='shop'),
    path('contact', views.contact, name='contact')
]
