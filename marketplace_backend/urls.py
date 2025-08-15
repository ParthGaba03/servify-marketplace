# marketplace_backend/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('api/users/', include('users.urls')),
    path('api/providers/', include('providers.urls')),
    path('api/services/', include('services.urls')),
    path('api/bookings/', include('bookings.urls')),
    path('api/reviews/', include('reviews.urls')),
]