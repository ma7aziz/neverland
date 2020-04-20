from django.shortcuts import render
from cart.models import Cart, Cart_item
from django.contrib.auth.models import User
from .models import Order, Customer
from django.core.mail import send_mail ,mail_admins
from django.conf import  settings
from django.contrib.auth.decorators import user_passes_test
from django.core.paginator import Paginator
# Create your views here.


@user_passes_test(lambda u: u.is_superuser)
def orders(request):
    orders = Order.objects.all().order_by('-timestamp')
    paginator = Paginator(orders, 10 )
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    return render(request, 'orders.html' , 
        {'page_obj': page_obj}
    )


@user_passes_test(lambda u: u.is_superuser)
def order_details(request, id):
    order = Order.objects.get(pk=id)
    return render(request, 'order_details.html' , {'order': order})


def checkout(request):
    cart_session = request.session.get('cart')
    if cart_session:
        cart = Cart.objects.get(pk=cart_session)
    else: 
        cart = Cart.objects.all().filter(user= request.user, is_ordered = False )[0]

    return render(request, 'checkout.html', {'cart':cart})

def place_order(request):
    cart_session = request.session.get('cart')
    if cart_session:
        cart = Cart.objects.get(pk=cart_session)
    
    else:
        cart = Cart.objects.all().filter(user = request.user, is_ordered = False)[0]
        user = request.user

    customer = Customer(first_name = request.POST['first_name'], last_name = request.POST['last_name'] ,
                        phone = request.POST['phone'], email = request.POST['email'], 
                        address = request.POST['address'] , city = request.POST['city'],
                        governrate  = request.POST['governrate'])
    customer.save()
    print(cart.cart_price)
    total_price = int(cart.cart_price()) + 50
    order = Order(items = cart ,total_price = total_price , customer = customer , order_comments = request.POST['order_comments'])
    order.save()
    cart.is_ordered =True
    cart.save()
    for item in order.items.cart_item_set.all():
        item.item.times_sold += 1
        item.save()
    if cart_session:
        del request.session['cart']
    send_mail('NeverLandEgy - Order Confirmation',
                  f'Your order has been confirmed successfully. \n Order number : {order.id} . \n Our team will reach out to you soon. \n For further assistance please call +++++',
                  settings.EMAIL_HOST_USER,
                  [request.POST['email']] , fail_silently=True)
    mail_admins(
            subject='New Order!',
            message='We have recieved new order',
            fail_silently=True,
            connection=None,
            html_message= f'<html><body> <h3> we recieved new order </h3><br> ORDER NUMBER : {order.id}  <br> please check your admin pannel</body></html>'
        )
    return render(request, 'order_success.html', {'order':order})
