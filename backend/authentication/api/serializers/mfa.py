from rest_framework import serializers
import pyotp


class MFAVerifySerializer(serializers.Serializer):
    code = serializers.CharField(min_length=6, max_length=6)

    def validate_code(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("Code must be numeric")
        return value

    def validate(self, data):
        user = self.context['request'].user
        if not user.mfa_secret:
            raise serializers.ValidationError("No MFA secret found for user")

        totp = pyotp.TOTP(user.mfa_secret)
        if not totp.verify(data['code']):
            raise serializers.ValidationError("Invalid TOTP code")
        return data
