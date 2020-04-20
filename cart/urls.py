from django.urls import path
from . import views
urlpatterns = [
    path('cart', views.cart, name='cart'),
    path('add_to_cart', views.add_to_cart, name='add_to_cart'),
    path('remove_cart/<int:id>', views.remove_from_cart, name='remove_cart'),
    path('minus_cart', views.minus_cart, name='minus_cart'),
]
