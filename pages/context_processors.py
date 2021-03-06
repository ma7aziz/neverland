from .models import Product , SECTOR_CHOICES ,CATEGORY_CHOICES
from cart.models import Cart
from wishlist.models import Wishlist, Wishlist_item
import datetime

def add_variable_to_context(request):
    items = Product.objects.active()
    most_sold = items.order_by('-times_sold')[:3]
    featured = Product.objects.featured()[:3]
    recent_items = items.order_by('-id')[:3]
    current_datetime = datetime.datetime.now()
    categories = CATEGORY_CHOICES
    sectors = SECTOR_CHOICES
    cart_count = 0
    if request.user.is_authenticated:

        cart = Cart.objects.all().filter(user = request.user, is_ordered = False)
        if cart : 

            cart_count = cart[0].cart_count()
    else:
        cart_session = request.session.get('cart')
        if cart_session:
            cart_count= Cart.objects.get(pk=cart_session).cart_count()

    wishlist_session = request.session.get('wishlist_session')
    
    if wishlist_session:
        wishlist = None
        if request.user.is_authenticated:
            wishlist = Wishlist.objects.all().filter(user=request.user)[0]
        else:
            wishlist = Wishlist.objects.get(pk=wishlist_session)
        wishlist_item = Wishlist_item.objects.all().filter(wishlist = wishlist)
    else:
        wishlist_item = None

    return {
        'most_sold': most_sold,
        'featured': featured,
        'recent_items': recent_items, 
        'current_year': current_datetime.year,
        'cart_count': cart_count,
        'categories': categories, 
        'wishlist': wishlist_item,
        'sectors': sectors
    }

