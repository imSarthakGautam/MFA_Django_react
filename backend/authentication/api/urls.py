from django.urls import path
from authentication.api.views.auth import RegisterView, LoginView
from authentication.api.views.mfa import MFAVerifyView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('mfa/verify/', MFAVerifyView.as_view(), name='mfa-verify'),
]
