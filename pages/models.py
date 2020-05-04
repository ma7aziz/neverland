from django.db import models


class ProductManager(models.Manager):
    def active(self):
        return self.filter(active=True)

    def most_sold(self):
        return self.order_by('-times_sold')[:5]

    def on_sale(self):
        pass
    
    def featured(self):
            return self.filter(featured= True)


class Size(models.Model):
    name = models.CharField(max_length=50)
    abb = models.CharField(max_length=5 , blank=True)
    def __str__(self):
        return self.name

SUBSECTOR_CHOICES = [
        ('Kids', (
                ('boy', 'boy'),
                ('girl', 'girl'),
                ('baby', 'baby'),
            )
        ),
        ('Adults', (
                ('men', 'men'),
                ('women', 'women'),
            )
        ),
        ('Accessories', (
                ('toys', 'toys'),
                ('wigs', 'wigs'),
                ('hats', 'hats'),
                ('masks', 'masks'),
                ('decoration', 'decoration'),
                ('making', 'making'),

            )
        ),
        
    ]
CATEGORY_CHOICES  = [
    ('princess','princess') , 
    ('heroes', 'heroes'),
    ('cartoons ', 'cartoons'),
    ('holloween', 'holloween'),
    ('christmas', 'christmas'),
    ('jobs', 'jobs'),
    ('international', 'international'),
    ('egyptian', 'egyptian'),
    ('graduation', 'graduation'),
    ('cosplay', 'cosplay'),
    ('tv ', 'tv '),
    ('fashion', 'fashion'),
    ('historical', 'historical'),
]
SECTOR_CHOICES = [
    ('kids', 'kids'),
    ('adults', 'adults'),
    ('accessories', 'accessories'),
]
    
class Product(models.Model):
    title = models.CharField(max_length=220)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default=' ')
    sector = models.CharField(max_length=50, choices=SECTOR_CHOICES, default= ' ')
    subsector = models.CharField(max_length=50, choices=SUBSECTOR_CHOICES, default=' ')
    size =models.ManyToManyField(Size , blank = True)
    active = models.BooleanField(default=True)
    price = models.DecimalField(decimal_places=2, max_digits=10)
    description = models.TextField(max_length=500, blank=True)
    image1 = models.ImageField(upload_to='photos/products/', blank=False)
    image2 = models.ImageField(upload_to='photos/products/', blank=True , null=True)
    image3 = models.ImageField(upload_to='photos/products/', blank=True , null=True)
    image4 = models.ImageField(upload_to='photos/products/', blank=True , null=True)
    times_sold = models.IntegerField(default=1)
    featured = models.BooleanField(default=False)
    related_item1 = models.ForeignKey('Product', on_delete=models.SET_NULL, null=True, blank=True, related_name='item_related')
    related_item2 = models.ForeignKey('Product', on_delete=models.SET_NULL, null=True, blank=True, related_name='item2', default= None)
    related_item3 = models.ForeignKey('Product', on_delete=models.SET_NULL, null=True, blank=True, default= None)
    
    objects = ProductManager()

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse("model_detail", kwargs={"pk": self.pk})

        

class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    content = models.TextField(max_length=500)
    user = models.CharField(max_length=50 , blank=True)
    phone = models.CharField(max_length=200, blank=True , null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.product.title
    
    class Meta:
        ordering = ['-timestamp']
    

class HomeSlides(models.Model):
    home_image = models.ImageField(upload_to='photos/home_slides')

    def __str__(self):
        return str(self.id)
    

