# users/serializers.py
from rest_framework import serializers
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    # Add this field
    is_provider = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        # Add 'is_provider' to the fields tuple
        fields = ('id', 'username', 'email', 'password', 'is_provider')
        extra_kwargs = {'password': {'write_only': True}}

    # Add this method
    def get_is_provider(self, obj):
        return hasattr(obj, 'providerprofile')

    def create(self, validated_data):
        # (Your existing create method remains unchanged)
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user