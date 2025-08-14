from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions, serializers
from .models import Review
from .serializers import ReviewSerializer
from bookings.models import Booking

class ReviewCreateView(generics.CreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]
    def perform_create(self, serializer):
        booking = Booking.objects.get(id=self.request.data.get('booking'))
        if booking.customer != self.request.user or booking.status != 'COMPLETED' or hasattr(booking, 'review'):
            raise serializers.ValidationError("Review not allowed.")
        serializer.save(customer=self.request.user, provider=booking.service.provider)

class ProviderReviewListView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    def get_queryset(self):
        return Review.objects.filter(provider__id=self.kwargs['provider_id']).order_by('-created_at')