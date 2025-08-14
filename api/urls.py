from django.urls import path
from .views import get_test_data

urlpatterns = [
    path('test-data/', get_test_data),
]