from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    mobile_number = models.CharField(max_length=15)
    is_verified = models.BooleanField(default=False)
    dob=models.DateField(null=True,blank=True)
    gender=models.CharField(max_length=10,null=True,blank=True)



