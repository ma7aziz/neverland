from django.urls import path
from . import views
urlpatterns = [
    path('', views.wishlist, name='wishlist'),
    path('add_to_wishlist', views.add_to_wishlist, name='add_to_wishlist'),
    path('remove_wishlist/<int:id>', views.remove_wishlist, name='remove_wishlist'),
]
