# providers/serializers.py
from rest_framework import serializers
from .models import ProviderProfile
from services.serializers import ServiceSerializer

class ProviderProfileSerializer(serializers.ModelSerializer):
    services = ServiceSerializer(many=True, read_only=True)
    # Add this line to get the username from the related user model
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = ProviderProfile
        # Add 'username' to the list of fields
        fields = ['id', 'user', 'username', 'bio', 'phone_number', 'city', 'profile_picture', 'services', 'latitude', 'longitude']
        read_only_fields = ['user']