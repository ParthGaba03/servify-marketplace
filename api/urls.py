# api/urls.py
from django.urls import path
from .views import get_test_data, debug_database_connection

urlpatterns = [
    path('test-data/', get_test_data),
    path('debug-db/', debug_database_connection), # Yeh naya URL hai
]