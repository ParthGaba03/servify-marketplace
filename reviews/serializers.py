from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    customer_username = serializers.CharField(source='customer.username', read_only=True)
    class Meta:
        model = Review
        fields = ['id', 'booking', 'provider', 'customer', 'customer_username', 'rating', 'comment', 'created_at']
        read_only_fields = ['provider', 'customer', 'customer_username', 'created_at']