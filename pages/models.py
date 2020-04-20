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

# model product


class Category(models.Model):
    title = models.CharField(max_length=150, unique=True)

    class Meta:
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.title


class Subcategory(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    title = models.CharField(max_length=150)

    class Meta:
        verbose_name_plural = 'Subcategories'

    def __str__(self):
        return f'{self.title}-{self.category}'

class Size(models.Model):
    name = models.CharField(max_length=50)
    abb = models.CharField(max_length=5 , blank=True)
    def __str__(self):
        return self.name
    
class Product(models.Model):
    title = models.CharField(max_length=220)
    category = models.ForeignKey(Category,  on_delete=models.SET_NULL, null=True)
    subcategory = models.ForeignKey(Subcategory, on_delete=models.SET_NULL, null=True)
    size =models.ManyToManyField(Size , blank = True , null = True)
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
    timestamp = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.product.title
    
    class Meta:
        ordering = ['-timestamp']
    

class HomeSlides(models.Model):
    home_image = models.ImageField(upload_to='photos/home_slides')

    def __str__(self):
        return str(self.id)
    

