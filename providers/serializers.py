from rest_framework import serializers
from .models import ProviderProfile
from services.serializers import ServiceSerializer

class ProviderProfileSerializer(serializers.ModelSerializer):
    services = ServiceSerializer(many=True, read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    avg_rating = serializers.FloatField(read_only=True)
    num_reviews = serializers.IntegerField(read_only=True) # <-- Renamed to match the view

    class Meta:
        model = ProviderProfile
        fields = ['id', 'user', 'username', 'bio', 'phone_number', 'city', 
                  'profile_picture', 'services', 'latitude', 'longitude', 
                  'avg_rating', 'num_reviews'] # <-- Updated field list
        read_only_fields = ['user', 'avg_rating', 'num_reviews'] # <-- Updated read-only fields
