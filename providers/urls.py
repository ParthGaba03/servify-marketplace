# providers/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProviderProfileCreateView, ProviderProfileDetailView, PublicProviderProfileViewSet

private_urlpatterns = [
    path('profile/create/', ProviderProfileCreateView.as_view(), name='create_profile'),
    path('profile/me/', ProviderProfileDetailView.as_view(), name='my_profile'),
]

public_router = DefaultRouter()
public_router.register(r'public-profiles', PublicProviderProfileViewSet, basename='public-profile')

urlpatterns = [
    path('', include(private_urlpatterns)),
    path('', include(public_router.urls)),
]