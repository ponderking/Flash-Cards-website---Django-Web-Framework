from django.contrib import admin
from .models import User, FlashCardStack, FlashCard

# Register your models here.
admin.site.register(User)
admin.site.register(FlashCardStack)
admin.site.register(FlashCard)
