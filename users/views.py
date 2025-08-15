from django.shortcuts import render
from rest_framework import generics
from .serializers import UserSerializer
from .models import CustomUser
from rest_framework import generics, permissions 
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

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


# NEW: View to check if an email exists
class CheckEmailExistsView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        user_exists = CustomUser.objects.filter(email=email).exists()
        return Response({'exists': user_exists}, status=status.HTTP_200_OK)

# NEW: View to reset the password by email
class ResetPasswordByEmailView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        new_password = request.data.get('new_password')
        
        if not email or not new_password:
            return Response({'error': 'Email and new password are required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = CustomUser.objects.get(email=email)
            user.set_password(new_password)
            user.save()
            return Response({'message': 'Password updated successfully.'}, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
