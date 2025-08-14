from django.shortcuts import render
from rest_framework import generics
from .serializers import UserSerializer
from .models import CustomUser
from rest_framework import generics, permissions 
# Create your views here.


# generics.CreateAPIView hamein POST request handle karne ka logic free mein deta hai
class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

class UserDetailView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user