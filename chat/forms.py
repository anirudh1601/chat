from django import forms
from .models import Room

class RoomForm(forms.ModelForm):
	class Meta:
		model = Room
		fields='__all__'

class EditRoom(forms.ModelForm):
	class Meta:
		model = Room
		fields = ['room','password']

