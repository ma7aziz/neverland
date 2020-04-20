from . import views
from django.urls import path

urlpatterns = [
    path('', views.news , name = 'news'),
    path('news/<int:id>', views.detailed_post , name = 'post'),
]
