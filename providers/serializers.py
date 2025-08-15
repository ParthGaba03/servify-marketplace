# providers/serializers.py
from rest_framework import serializers
from .models import ProviderProfile
from services.serializers import ServiceSerializer

class ProviderProfileSerializer(serializers.ModelSerializer):
    services = ServiceSerializer(many=True, read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    # The new calculated field from your view
    avg_rating = serializers.FloatField(read_only=True)
    
    class Meta:
        model = ProviderProfile
        fields = ['id', 'user', 'username', 'bio', 'phone_number', 'city', 
                  'profile_picture', 'services', 'latitude', 'longitude', 
                  'avg_rating', 'review_count']
        read_only_fields = ['user', 'avg_rating', 'review_count']