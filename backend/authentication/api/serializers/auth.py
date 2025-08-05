# authentication/api/serializers/auth.py
from rest_framework import serializers
from authentication.models import CustomUser  # Use models/__init__.py import
from django.contrib.auth import authenticate

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = CustomUser
        fields = ['email', 'password']  # Removed username, fixed typo

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.CharField()  # Changed username to email to match USERNAME_FIELD
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(email=data['email'], password=data['password'])  # Changed username to email
        if not user:
            raise serializers.ValidationError("Invalid credentials")
        data['user'] = user
        return data