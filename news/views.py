from django.shortcuts import render

from .models import Post
# Create your views here.
def news(request):
    posts = Post.objects.all().order_by('-timestamp')
    return render(request, 'news.html', {'posts': posts})

def detailed_post(request,id):
    post = Post.objects.get(pk=id)
    # recent_posts = Post.objects.all().order_by('-timestamp')[:3]
    return render(request, 'post.html',  {'post':post })