from rest_framework import generics, viewsets, status, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Avg, Count
from .models import ProviderProfile
from .serializers import ProviderProfileSerializer
from services.models import Service

class ProviderProfileCreateView(generics.CreateAPIView):
    queryset = ProviderProfile.objects.all()
    serializer_class = ProviderProfileSerializer
    permission_classes = [IsAuthenticated]
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ProviderProfileDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = ProviderProfileSerializer
    permission_classes = [IsAuthenticated]
    def get_object(self):
        return self.request.user.providerprofile

class PublicProviderProfileViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProviderProfile.objects.filter(is_approved=True).annotate(
        avg_rating=Avg('reviews__rating'),
        num_reviews=Count('reviews') # <-- Renamed to avoid conflict
    )
    serializer_class = ProviderProfileSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['user__username', 'city', 'bio', 'services__name']
