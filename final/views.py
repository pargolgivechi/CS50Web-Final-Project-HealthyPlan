from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from django.db import IntegrityError
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseBadRequest, JsonResponse
from django.shortcuts import render, redirect
from django.urls import reverse
import json
from datetime import datetime

from .models import *


def index(request):

    return render(request, "final/index.html", {    
        "plans": Plan.objects.all()
    })
 

@login_required(login_url='/login')
def plan(request, plan_id):

    plan_title = Plan.objects.get(id=plan_id).title

    with open('final/mydata.json', 'r') as f:
        json_object = json.loads(f.read())
        for i in json_object:
            plan_breakfast = json_object[plan_title]['Breakfast']
            plan_lunch = json_object[plan_title]['Lunch']
            plan_dinner = json_object[plan_title]['Dinner']
            plan_snack = json_object[plan_title]['Snack']

    return render (request, "final/plan.html", {    
        "plan_title": plan_title,
        "plan_breakfast": plan_breakfast,
        "plan_lunch": plan_lunch,
        "plan_dinner": plan_dinner,
        "plan_snack": plan_snack
    })


@login_required(login_url='/login')
def my_profile(request):
    plans = Plan.objects.all()
    profile = Profile.objects.filter(user=request.user)

    if profile:
        for prof in profile:
            weight = prof.weight
            height = prof.height/100
            bmi = weight/(height**2)
            
            return render(request, "final/report.html", {
                "prof": prof,
                "bmi": int(bmi),
                "daily_cal": int(prof.daily_cal),
            })
    else: 
        return render(request, "final/my_profile.html", {
            "plans": plans
            })


@login_required(login_url='/login')
def diary(request):
    profile = Profile.objects.get(user=request.user)
    plan_name = profile.plan.title
    
    with open('final/mydata.json', 'r') as f:
        json_object = json.loads(f.read())
        for i in json_object:
            plan_breakfast = json_object[plan_name]['Breakfast']
            plan_lunch = json_object[plan_name]['Lunch']
            plan_dinner = json_object[plan_name]['Dinner']
            plan_snack = json_object[plan_name]['Snack']

    return render(request, "final/diary.html", {
        "plan_name": plan_name,
        "plan_breakfast": plan_breakfast,
        "plan_lunch": plan_lunch,
        "plan_dinner": plan_dinner,
        "plan_snack": plan_snack,
        "daily_cal": int(profile.daily_cal),
        "today": datetime.now().strftime("%Y-%m-%d")
    })


@login_required(login_url='/login')
def history_page(request):

    return render(request, "final/history_page.html", {
        "today": datetime.now().strftime("%Y-%m-%d")
    })


def api_plan(request, plan_title, name, id):
    try:
        with open('final/mydata.json', 'r') as f:
            json_object = json.loads(f.read())  
            meal = json_object[plan_title][name][id]

    except KeyError:
        return HttpResponseBadRequest("Bad Request")

    return JsonResponse({
        "meal": meal
    })


@csrf_exempt
def profile_submit(request, dietPlan):
    plan = Plan.objects.get(title=dietPlan)
    profile = Profile()
    profile.user = request.user
    profile.plan = plan

    if request.method == "POST":
        data = json.loads(request.body)
        if data.get("gender") is not None:
            profile.gender = data["gender"]
        if data.get("weight") is not None:
            profile.weight = data["weight"]
        if data.get("height") is not None:
            profile.height = data["height"]
        if data.get("target") is not None:
            profile.target = data["target"]
        if data.get("daily_cal") is not None:
            profile.daily_cal = data["daily_cal"]
        profile.save()
    return JsonResponse({"message": "Your information has been successfully sent."}, status=201)


@csrf_exempt
def edit_profile(request, editPlan):
    plan = Plan.objects.get(title=editPlan)
    
    profile = Profile.objects.get(user=request.user)
    profile.plan = plan

    if request.method == "PUT":
        data = json.loads(request.body)
        if data.get("gender") is not None:
            profile.gender = data["gender"]
        if data.get("weight") is not None:
            profile.weight = data["weight"]
        if data.get("height") is not None:
            profile.height = data["height"]
        if data.get("target") is not None:
            profile.target = data["target"]
        if data.get("daily_cal") is not None:
            profile.daily_cal = data["daily_cal"]
        profile.save()
    return JsonResponse({"message": "Your information has been successfully sent."}, status=201)


@csrf_exempt
def track_calory(request):
    today = datetime.now().strftime("%Y-%m-%d")
    track_cal = Track_cal.objects.filter(user=request.user, date=today)

    if request.method == "POST":

        if track_cal:

            track_cal.delete()

            track = Track_cal()
            track.user = request.user
            track.date = today

            data = json.loads(request.body)
            if data.get("cal_left") is not None:
                track.cal_left = data["cal_left"]
            if data.get("plan_nam") is not None:
                track.plan_nam = data["plan_nam"]
            if data.get("breakfast") is not None:
                track.breakfast = data["breakfast"]
            if data.get("lunch") is not None:
                track.lunch = data["lunch"]
            if data.get("dinner") is not None:
                track.dinner = data["dinner"]
            if data.get("snack") is not None:
                track.snack = data["snack"]
            
            track.save()

        else: 

            track = Track_cal()
            track.user = request.user
            track.date = today

            data = json.loads(request.body)
            if data.get("cal_left") is not None:
                track.cal_left = data["cal_left"]
            if data.get("plan_nam") is not None:
                track.plan_nam = data["plan_nam"]
            if data.get("breakfast") is not None:
                track.breakfast = data["breakfast"]
            if data.get("lunch") is not None:
                track.lunch = data["lunch"]
            if data.get("dinner") is not None:
                track.dinner = data["dinner"]
            if data.get("snack") is not None:
                track.snack = data["snack"]

            track.save()
        return JsonResponse({"message": "Successfully recorded.", "date": today}, status=201)


def all_history(request):
    track_cal = Track_cal.objects.filter(user=request.user.id)

    return JsonResponse({
        "cal_history": list(track_cal.values().order_by('date').reverse())
    })


def history(request, date):
  
    track_cal = Track_cal.objects.get(user=request.user, date=date)

    return JsonResponse({
        "id": track_cal.id,
        "cal_left": track_cal.cal_left, 
        "plan_nam": track_cal.plan_nam, 
        "breakfast": track_cal.breakfast, 
        "lunch": track_cal.lunch, 
        "dinner": track_cal.dinner, 
        "snack": track_cal.snack, 
        "date": track_cal.date, 
    })


def one_history(request, id):
  
    track_cal = Track_cal.objects.get(id=id)

    return JsonResponse({
        "id": id,
        "cal_left": track_cal.cal_left, 
        "plan_nam": track_cal.plan_nam, 
        "breakfast": track_cal.breakfast, 
        "lunch": track_cal.lunch, 
        "dinner": track_cal.dinner, 
        "snack": track_cal.snack, 
        "date": track_cal.date, 
    })


def login_view(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "final/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "final/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "final/register.html", {
                "message": "Passwords must match."
            })
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "final/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "final/register.html")