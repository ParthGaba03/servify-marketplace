from django.urls import path
from .views import ReviewCreateView, ProviderReviewListView

urlpatterns = [
    path('create/', ReviewCreateView.as_view(), name='create-review'),
    path('provider/<int:provider_id>/', ProviderReviewListView.as_view(), name='provider-reviews'),
]