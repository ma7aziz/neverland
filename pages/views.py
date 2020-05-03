from django.shortcuts import render
from django.core.paginator import Paginator
from .models import Product, Review, Category , HomeSlides , Subcategory
from django.http import HttpResponseRedirect,  HttpResponse , JsonResponse
from news.models import Post
from wishlist.models import Wishlist
from cart.models import Cart
from django.core.mail import send_mail ,mail_admins
from django.contrib import messages
# Create your views here.
def index(request):
    cart_session = request.session.get('cart')
    if request.user.is_authenticated:
        if cart_session:
            cart = Cart.objects.get(pk=cart_session)
            user = request.user
            cart.user = user
            cart.save()
            user_carts = Cart.objects.all().filter(user = user, is_ordered=False)
            del request.session['cart']
  
    wishlist_session = request.session.get('wishlist')
    if wishlist_session:
        if request.user.is_authenticated:
            wishlist = Wishlist.objects.get(pk=wishlist_session)
            wishlist.user = request.user
            wishlist.save()
            del request.session['wishlist']

    slides = HomeSlides.objects.all().order_by('-id')[:3]
    recent_posts = Post.objects.all().order_by('-timestamp')[:4]
    items = Product.objects.active()
    most_sold = items.order_by('-times_sold')[:8]
    featured = Product.objects.featured()[:8]
    recent_items = items.order_by('-id')[:8]
    
    return render(request, 'index.html', {'slides': slides, 'recent_posts': recent_posts,'most_sold_home':most_sold, 'featured_home': featured ,'recent_items_home':recent_items})

def product(request, id):
    item = Product.objects.get(pk=id)
    reviews = Review.objects.all().filter(product=item).order_by('-timestamp')
    reviews_count = len(reviews)
    return render(request, 'product.html', {'item' : item , 'reviews' :reviews , 'count': reviews_count})


def review(request):
   
    product = Product.objects.get(pk= request.POST['item_id'])
    content = request.POST['review']
    phone = request.POST['phone']

    if request.user.is_authenticated:
        user = request.user
    else:
        user = request.POST['author']
    
    review = Review(product= product, content=content, user= user , phone=phone)
    review.save()
    
    return HttpResponseRedirect(request.META.get('HTTP_REFERER'))



def sector(request, sector):
    
    items = Product.objects.active().filter(sector=sector.lower())
    return render(request, 'sector.html', {'items': items, 'sector': sector})

def subsector(request, subsector,sector):
    
    items = Product.objects.active().filter(subsector=subsector.lower())

    return render(request, 'subsector.html', {'items': items, 'subsector': subsector , 'sector': sector})


def category(request, category):
    items = Product.objects.active().filter(category = category.lower())

    if request.method == 'POST':
        filter = request.POST['filter']
        category = request.POST['category']
        unfiltered_items = Product.objects.active().filter(category = category.lower())
        items = unfiltered_items.filter(subsector = filter)
    return render(request, 'category.html', {'items': items, 'category': category} )

# def filter(request):
    
#     return render(request , 'filter.html')

def subcategory(request, id):
    get_sub = Subcategory.objects.get(pk=id)
    items = Product.objects.all().filter(subcategory = get_sub)
    
    return render(request , 'subcategory.html', {'items':items, 'subcategory':get_sub.title, 'category':get_sub.category})


def search(request):

    keyword = request.GET.get('keyword').strip()
    result = Product.objects.filter(title__contains=keyword)
    return render(request, 'search.html', {'items': result,  'keyword': keyword })

def shop(request):
    items = Product.objects.all()
    paginator = Paginator(items, 15 )

    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    return render(request, 'shop.html' , {'page_obj': page_obj})

def contact(request):
    if request.method == 'POST':
        name = request.POST['name']
        email = request.POST['email']
        phone = request.POST['phone']
        message = request.POST['message']
        mail_admins(
            subject='New Message Recieved !',
            message='We have recieved new Message',
            fail_silently=True,
            connection=None,
            html_message= f'<html><body> <h3> Name : {name }</h3><br> Email : {email}  <br> Phone number : {phone} <br> message {message}</body></html>'
        )
        messages.success(request, 'Thanks For Reaching Out, We Will Contact You Soon ... ! ')
        return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
    
    return render(request, 'contact.html')


