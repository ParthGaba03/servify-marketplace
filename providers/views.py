# providers/views.py
from rest_framework import generics, viewsets, status, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Avg, Count # <-- Added Avg and Count here
from .models import ProviderProfile
from .serializers import ProviderProfileSerializer
from services.models import Service # Import the Service model to search on its fields

# --- Your existing views remain the same ---

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

# --- The updated ViewSet for search functionality ---

class PublicProviderProfileViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProviderProfile.objects.filter(is_approved=True).annotate(
        # Renamed the annotation to avoid conflict
        avg_rating=Avg('reviews__rating'),
        review_count=Count('reviews')
    )
    serializer_class = ProviderProfileSerializer
    
    # Enable search filtering
    filter_backends = [filters.SearchFilter]
    
    # Define the fields to search on
    search_fields = ['user__username', 'city', 'bio', 'services__name']