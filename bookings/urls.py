# bookings/urls.py
from django.urls import path
from .views import BookingCreateView, MockPaymentSuccessView, UserBookingListView, ProviderBookingListView, BookingUpdateView

urlpatterns = [
    path('create/', BookingCreateView.as_view(), name='create-booking'),
    path('mock-payment-success/', MockPaymentSuccessView.as_view(), name='mock-payment'),
    path('my-bookings/', UserBookingListView.as_view(), name='my-bookings'),
    path('provider/bookings/', ProviderBookingListView.as_view(), name='provider-bookings'),
    path('provider/bookings/<int:pk>/update/', BookingUpdateView.as_view(), name='update-booking'),
]