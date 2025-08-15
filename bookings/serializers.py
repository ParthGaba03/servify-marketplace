# bookings/serializers.py
from rest_framework import serializers
from .models import Booking
from services.serializers import ServiceSerializer

# FOR READING BOOKINGS (shows full service details)
class BookingSerializer(serializers.ModelSerializer):
    service = ServiceSerializer(read_only=True)
    # Add this line to include the customer's username
    customer_username = serializers.CharField(source='customer.username', read_only=True)
    has_review = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        # Add 'customer_username' to the fields list
        fields = ['id', 'customer', 'customer_username', 'service', 'booking_time', 'status', 'created_at', 'has_review']

    def get_has_review(self, obj):
        return hasattr(obj, 'review')

# FOR WRITING BOOKINGS (accepts a simple service ID)
class BookingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['service', 'booking_time', 'address']