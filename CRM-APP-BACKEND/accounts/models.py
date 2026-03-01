from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    phone = models.CharField(max_length=20, blank=True)
    company = models.CharField(max_length=100, blank=True)
    industry = models.CharField(max_length=50, blank=True)
    country = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.email or self.username
