from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from django.core.validators import validate_email, validate_slug


# User model
class User(AbstractBaseUser, models.Model):
    USERNAME_FIELD = "username"
    PASSWORD_FIELD = "password"
    EMAIL_FIELD = "email"

    username = models.CharField(max_length=128, unique=True, validators=[validate_slug])
    password = models.CharField(max_length=128)
    email = models.CharField(max_length=128, validators=[validate_email])
    active = models.BooleanField(default=True)
    last_login = models.DateTimeField(auto_now_add=True)
    created = models.DateTimeField(auto_now_add=True)
    changed = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        self.full_clean()
        super(User, self).save(*args, **kwargs)


# Flashcard Stack model
class FlashCardStack(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=128)
    description = models.TextField()
    is_public = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)
    changed = models.DateTimeField(auto_now_add=True)


# Flashcard model
class FlashCard(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    cardstack = models.ForeignKey(FlashCardStack, on_delete=models.CASCADE)
    content_front = models.TextField()
    content_back = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    changed = models.DateTimeField(auto_now_add=True)
