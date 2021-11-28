from django.shortcuts import render,redirect,reverse
from django.contrib.auth.decorators import login_required
from .models import Message,Room
import random,string
import base64
from django.contrib.auth.models import User
import json
import random
import hashlib
from django.views.decorators.csrf import csrf_exempt
from .forms import RoomForm,EditRoom
from django.contrib.auth.models import User

@csrf_exempt
@login_required(login_url='login')
def index(request):
    show_presentation_list = []
    room_presentation=[]
    abc = None
    page = User.objects.get(username=request.user)
    mess = Message.objects.filter(user=request.user)
    for m in mess:
        if m.room not in show_presentation_list:
            show_presentation_list.append(m.room)
            room_presentation.append(m)
    form = RoomForm(request.POST or None)
    if request.method =='POST':
        if form.is_valid():
            name = form.cleaned_data['room']
            passw = form.cleaned_data['password']
            print(passw)
            print(name)
            room = name
            Room.objects.get_or_create(room=name,password=passw)
            abc = Room.objects.get(room=name,password=passw)
            return redirect(reverse('room',kwargs={'room':name,'user':request.user,'passw':passw}))
    room_presentaions = map(base64.b64encode,room_presentation)
    return render(request, 'chat/index.html',{'abc':abc,'username':page,'room_presentation':room_presentation,'form':form})


@login_required(login_url='login')  
def room(request,room,user,passw):
    show_presentation_list = []
    room_presentation=[]
    users = User.objects.all()
    name = Room.objects.get(room=room,password=passw)
    print(name)
    page = User.objects.get(username=request.user)
    mess = Message.objects.filter(user=request.user)
    for m in mess:
        if m.room not in show_presentation_list:
            show_presentation_list.append(m.room)
            room_presentation.append(m)

    names = request.GET.get('username')
    messages=Message.objects.filter(room=name)[0:25]
    mess = Message.objects.all()
    return render(request, 'chat/room.html', {'name':name,'users':users,'username': request.user.username,'room_name':room,'messages': messages,'mess':mess ,'room_presentation':room_presentation,'passw':passw})



def join(request):
    ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    chars=[]
    for i in range(16):
        chars.append(random.choice(ALPHABET))
    "".join(chars)
    show_presentation_list = []
    room_presentation=[]
    page = User.objects.get(username=request.user)
    abc = None
    mess = Message.objects.filter(user=request.user)
    for m in mess:
        if m.room not in show_presentation_list:
            show_presentation_list.append(m.room)
            room_presentation.append(m)
            joined_rooms = Room.objects.get(room=m.room)
            abc=joined_rooms
            print(abc)
            
    print(room_presentation)
    return render(request, 'chat/join.html',{'abc':abc,'username':page,'chars':chars,'room_presentation':room_presentation})



@login_required(login_url='login')
def EditRoom(request,room,passw):
    room = Room.objects.get(room=room,password=passw)
    print(room)
    form = RoomForm(request.POST or None,request.FILES or None, instance=room)
    if request.method=='POST':
        if form.is_valid():
            form.save()
            return redirect(reverse('room',kwargs={'room':room,'user':request.user,'passw':passw}))
    return render(request,'chat/edit_room.html',{'form':form})


@login_required(login_url='login')
def DeleteRoom(request,room,passw):
    room = Room.objects.get(room=room,password=passw)
    print(room)
    form = RoomForm(request.POST or None,request.FILES or None, instance=room)
    if request.method=='POST':
        if form.is_valid():
            form.save()

    return render(request,'chat/edit_room.html',{'form':form})



def country(request,country):
    country = User.objects.filter(country=country)
    return render(request,'posts/country.html',{'country':country})