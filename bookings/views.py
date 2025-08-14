# bookings/views.py
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Booking
from .serializers import BookingSerializer, BookingCreateSerializer

class BookingCreateView(generics.CreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)
    
    # This custom create method is the key to the fix.
    # It ensures the response contains the full booking details, including the ID.
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        # Use the detailed BookingSerializer for the response
        response_serializer = BookingSerializer(serializer.instance)
        headers = self.get_success_headers(response_serializer.data)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class MockPaymentSuccessView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request, *args, **kwargs):
        booking_id = request.data.get('booking_id')
        if not booking_id:
            return Response({'error': 'Booking ID not provided.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            booking = Booking.objects.get(id=booking_id, customer=request.user)
            booking.status = 'CONFIRMED'
            booking.save()
            return Response({'message': 'Payment successful, booking confirmed.'}, status=status.HTTP_200_OK)
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found or you are not the owner.'}, status=status.HTTP_404_NOT_FOUND)

class UserBookingListView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return Booking.objects.filter(customer=self.request.user).order_by('-booking_time')

class ProviderBookingListView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'providerprofile'):
            return Booking.objects.filter(service__provider=user.providerprofile).order_by('-booking_time')
        return Booking.objects.none()

class BookingUpdateView(generics.UpdateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'providerprofile'):
            # A provider can only update bookings for their own services
            return Booking.objects.filter(service__provider=user.providerprofile)
        return Booking.objects.none()

    def perform_update(self, serializer):
        # We only allow updating the 'status' field
        serializer.save(status=self.request.data.get('status'))