from django.urls import path, include
from .import views
urlpatterns = [
    path('', views.index, name='index' ),
    path('product/<int:id>', views.product, name='product' ),
    path('review', views.review, name='review'),
    path('category/<sector>', views.sector, name='sector'),
    path('category/<sector>/<subsector>', views.subsector, name='subsector'),
    path('cat/<category>', views.category, name='category'),
    path('sub/<int:id>', views.subcategory, name='subcategory'),
    path('search', views.search, name='search'),
    path('shop',views.shop, name='shop'),
    # path('filter',views.filter, name='filter'),
    path('contact', views.contact, name='contact')
]
