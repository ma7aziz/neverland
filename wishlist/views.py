from django.shortcuts import render
from pages.models import Product
from django.contrib.auth.models import User 
from .models import Wishlist, Wishlist_item
from django.http import HttpResponseRedirect
from django.contrib import messages
# Create your views here.

def wishlist(request):
    wishlist_session = request.session.get('wishlist')
    if request.user.is_authenticated:
        wishlist = Wishlist.objects.all().filter(user=request.user).first()
    else:
        if wishlist_session:
            wishlist = Wishlist.objects.get(pk= wishlist_session)
        else:
            wishlist = Wishlist()
            wishlist.save()
    

    if wishlist:
        wishlist_items = Wishlist_item.objects.all().filter(wishlist=wishlist)
    else:
        wishlist_items = None
    return render(request, 'wishlist.html' , {'list':wishlist_items})

def add_to_wishlist(request):
    product = Product.objects.get(pk = request.GET['product_id'])
    wishlist_session = request.session.get('wishlist')
    if request.user.is_authenticated:
        wishlist = Wishlist.objects.get_or_create(user= request.user)[0]
        wishlist_item = Wishlist_item.objects.all().filter(product = product ,wishlist = wishlist)
        if wishlist_item:
            pass
        else:
            wishlist_item = Wishlist_item(wishlist= wishlist, product=product)
            wishlist_item.save()
    
    else:
        if wishlist_session:
            wishlist = Wishlist.objects.get(pk=wishlist_session)
            wishlist_item =Wishlist_item.objects.all().filter(product=product, wishlist= wishlist)
            if wishlist_item:
                pass
            else:
                wishlist_item = Wishlist_item(product=product,  wishlist=wishlist)
                wishlist_item.save()
        else:
            wishlist = Wishlist()
            wishlist.save()
            wishlist_item = Wishlist_item(wishlist=wishlist,product=product )
            wishlist_item.save()
            wishlist.wishlist_item_set.add(wishlist_item)
            request.session['wishlist'] = wishlist.id

    return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

def remove_wishlist(request, id):
    item = Wishlist_item.objects.get(pk=id)
    item.delete()
    messages.success(request, 'Item Removed From Wishlist')
    return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
