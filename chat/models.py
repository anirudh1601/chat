from django.db import models
from django.contrib.auth.models import User

class Room(models.Model):
    room = models.CharField(max_length=200)
    password=models.CharField(max_length=200)
    descrtiption = models.TextField(default='New Room')

    def __str__(self):
        return str(self.room)


class Message(models.Model):
    room = models.ForeignKey(Room,on_delete=models.CASCADE)
    user = models.CharField(max_length=255)
    content = models.TextField()
    date_added = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.room)