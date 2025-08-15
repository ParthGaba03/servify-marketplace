# providers/serializers.py
from rest_framework import serializers
from .models import ProviderProfile
from services.serializers import ServiceSerializer

class ProviderProfileSerializer(serializers.ModelSerializer):
    services = ServiceSerializer(many=True, read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = ProviderProfile
        fields = ['id', 'user', 'username', 'bio', 'phone_number', 'city', 
                  'profile_picture', 'services', 'latitude', 'longitude', 
                  'average_rating', 'review_count']
        read_only_fields = ['user', 'average_rating', 'review_count']