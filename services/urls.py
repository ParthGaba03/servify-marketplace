# services/urls.py
from rest_framework.routers import DefaultRouter
from .views import ServiceViewSet

router = DefaultRouter()
router.register(r'manage', ServiceViewSet, basename='service')

urlpatterns = router.urls