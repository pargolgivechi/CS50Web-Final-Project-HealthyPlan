from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("plan/<int:plan_id>", views.plan, name="plan"),
    path("profile", views.my_profile, name="my_profile"),
    path("diary", views.diary, name="diary"),
    path("history_page", views.history_page, name="history_page"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # API
    path("plan/<str:plan_title>/<str:name>/<int:id>", views.api_plan, name="api_plan"),
    path("profile_submit/<str:dietPlan>", views.profile_submit, name="profile_submit"),
    path("edit_profile/<str:editPlan>", views.edit_profile, name="edit_profile"),
    path("track_calory", views.track_calory, name="track_calory"),
    path("all_history", views.all_history, name="all_history"),
    path("history/<str:date>", views.history, name="history"),
    path("one_history/<int:id>", views.one_history, name="one_history")
]