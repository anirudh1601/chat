from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='chat'),
    path('<str:room>/<str:user>/<str:passw>/', views.room, name='room'),
    path('chat/join/',views.join,name='join'),
    path('chat/edit_room/<str:room>/<str:passw>/',views.EditRoom,name='edit_room'),
]