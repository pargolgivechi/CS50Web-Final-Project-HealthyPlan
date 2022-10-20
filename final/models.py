from datetime import date
from django.contrib.auth.models import AbstractUser

from django.db import models

# Create your models here.


class User(AbstractUser):
    pass


class Plan(models.Model):
    class PlanChoice(models.TextChoices):
        PLAN1 = 'Low Carb'
        PLAN2 = 'High Protein'
        PLAN3 = 'Vegan'
        PLAN4 = 'Mediterranean'
        
    title = models.CharField(max_length=20, choices=PlanChoice.choices)

    def __str__(self):
        return f"{self.title}"


class Profile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE) 
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE, related_name='sort')
    gender = models.CharField(max_length=10)
    weight = models.FloatField()
    height = models.FloatField()
    target = models.FloatField()
    daily_cal = models.FloatField(default=0)
    date = models.DateField(auto_now_add=True, blank=True)          


class Track_cal(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    cal_left = models.IntegerField()
    plan_nam = models.TextField() 
    breakfast = models.TextField()
    lunch = models.TextField()
    dinner = models.TextField()
    snack = models.TextField()
    date = models.DateField()  
