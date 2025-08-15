from django.urls import path
from .views import RegisterView, UserDetailView, CheckEmailExistsView, ResetPasswordByEmailView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', UserDetailView.as_view(), name='user-detail'), 
    
    # NEW: URLs for the password reset flow
    path('check-email/', CheckEmailExistsView.as_view(), name='check-email'),
    path('reset-password/', ResetPasswordByEmailView.as_view(), name='reset-password'),
]
