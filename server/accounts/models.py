from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = 'ADMIN', 'Admin'
        CUSTOMER = 'CUSTOMER', 'Customer'
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.CUSTOMER)

    def is_admin(self):
        return self.role == self.Role.ADMIN

    def is_customer(self):
        return self.role == self.Role.CUSTOMER