# authentication/api/serializers/mfa.py
from rest_framework import serializers

class MFAVerifySerializer(serializers.Serializer):
    code = serializers.CharField(min_length=6, max_length=6)

    def validate_code(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("Code must be numeric")
        return value