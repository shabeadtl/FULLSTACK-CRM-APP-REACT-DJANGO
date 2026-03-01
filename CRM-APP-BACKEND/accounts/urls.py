from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('profile/', views.profile, name='profile'),
    path('forgot-password/', views.forgot_password, name='forgot-password'),
    path('reset-password/', views.reset_password, name='reset-password'),
    path('users/', views.admin_user_list, name='admin-user-list'),
    path('users/<int:pk>/', views.admin_user_detail, name='admin-user-detail'),
]
