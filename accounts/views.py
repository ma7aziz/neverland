from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import  User
from django.contrib.auth import authenticate, login
from django.http import HttpResponseRedirect,  HttpResponse
from django.contrib import messages
# Create your views here.

def signup(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password1')
            user= authenticate(username=username, password=password)
            login(request, user)
            message.success(request, 'Welcom! You Signed Up Successfully.')
            return redirect('index')
    else:
        form = UserCreationForm
    return render(request, 'registration/signup.html', {'form':form})
    # return HttpResponseRedirect(request.META.get('HTTP_REFERER'))