import json

from django.contrib import messages
from django.core import serializers
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import redirect, render

from pages.models import Product, Size

from .models import Cart, Cart_item

# Create your views here.


def cart(request):
    session_cart = request.session.get('cart')
    if request.user.is_authenticated:
        user = request.user.id
        cart = Cart.objects.all().filter(user=user, is_ordered=False).first()
    else:
        cart = Cart.objects.all().filter(pk=session_cart).first()
    context = {
        'cart': cart,
    }

    return render(request, 'cart.html', context)


def remove_from_cart(request, id):
    cart = Cart_item.objects.get(pk=id)
    cart.delete()
    messages.success(request, 'cart updated !')
    return HttpResponseRedirect(request.META.get('HTTP_REFERER'))


def add_to_cart(request):
    size =Size.objects.get(pk=request.GET.get('size')) 
    cart_session = request.session.get('cart')
    qty = request.GET.get('quantity')
    product_id = request.GET.get('product_id')
    item = Product.objects.get(pk=product_id)
    if request.user.is_authenticated:
        cart = Cart.objects.all().filter(
        user=request.user, is_ordered=False).first()
        if cart :
            cart_item = Cart_item.objects.all().filter(
            item=item, shopping_cart=cart.id , size = size).first()
        else:
            cart = Cart(user = request.user)
            cart.save()
            cart_item = Cart_item.objects.all().filter(
            item=item, shopping_cart=cart.id).first()

        if cart_item:
            if qty:
                cart_item.qty = int(qty)
            else:
                cart_item.qty += 1
            cart_item.save()
            messages.success(request, 'Cart updated !')

        else:
            cart_item = Cart_item(shopping_cart=cart, item=item , size=size)
            cart_item.save()
            cart.cart_item_set.add(cart_item)
            cart.save()
            messages.success(request, 'Added to cart')


    else:
        if cart_session:
            cart = Cart.objects.get(pk=cart_session)
            cart_item = Cart_item.objects.all().filter(
                item=item, size= size , shopping_cart=cart_session).first()
            if cart_item:
                cart_item.qty += 1
                cart_item.save()
                messages.success(request, 'cart updated')
            else:
                cart_item = Cart_item(shopping_cart=cart, item=item , size = size)
                cart_item.save()
                cart.cart_item_set.add(cart_item)
                cart.save()
                messages.success(request, 'Added to cart')
                print(cart.id)
        else:
            cart = Cart()
            cart.save()
            cart_item = Cart_item(shopping_cart=cart, item=item , size = size )
            cart_item.save()
            cart.cart_item_set.add(cart_item)
            messages.success(request, 'Added to cart')
            request.session['cart'] = cart.id
    if request.is_ajax():

        response_data = {}
        response_data['cart_count'] = cart.cart_count()
        response_data['message'] = 'Added tO cart'
        return HttpResponse(json.dumps(response_data),
                            content_type="application/json")

    return HttpResponseRedirect(request.META.get('HTTP_REFERER'))


def minus_cart(request):
    product_id = request.GET.get('product_id')
    item = Product.objects.get(pk=product_id)
    if request.user.is_authenticated :
        cart = Cart.objects.get_or_create(
            user=request.user, is_ordered=False)[0]
    else:
        cart_session = request.session.get('cart')
        cart = Cart.objects.get(pk = cart_session )

    cart_item = Cart_item.objects.all().filter(
            item=item, shopping_cart=cart.id).first()
    
    cart_item.qty -= 1
    cart_item.save()

    if cart_item.qty == 0:
        cart_item.delete()

    return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
