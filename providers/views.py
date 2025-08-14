# providers/views.py
from rest_framework import generics, viewsets
from rest_framework.permissions import IsAuthenticated
from .models import ProviderProfile
from .serializers import ProviderProfileSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

class ProviderProfileCreateView(generics.CreateAPIView):
    queryset = ProviderProfile.objects.all()
    serializer_class = ProviderProfileSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ProviderProfileDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = ProviderProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.providerprofile

# vvv This class should NOT be indented vvv
class PublicProviderProfileViewSet(viewsets.ReadOnlyModelViewSet):
    """
    A viewset for viewing approved provider profiles.
    No authentication required.
    """
    queryset = ProviderProfile.objects.filter(is_approved=True)
    serializer_class = ProviderProfileSerializer

    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['user__username', 'services__name']