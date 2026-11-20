from .views import RegisterView, ProfileView, GoogleLogin
from django.urls import path
from .views import RegisterView, ProfileView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('google/', GoogleLogin.as_view(), name='google_login'),
]