from django.shortcuts import render

# Create your views here.
# services/views.py
from rest_framework import viewsets, permissions
from .models import Service
from .serializers import ServiceSerializer
from providers.models import ProviderProfile

class ServiceViewSet(viewsets.ModelViewSet):
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # This ensures a provider can only see their own services
        user = self.request.user
        if hasattr(user, 'providerprofile'):
            return Service.objects.filter(provider=user.providerprofile)
        return Service.objects.none()

    def perform_create(self, serializer):
        # This automatically links a new service to the logged-in provider
        profile = self.request.user.providerprofile
        serializer.save(provider=profile)