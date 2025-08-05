# authentication/api/views/mfa.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..serializers.mfa import MFAVerifySerializer
from ...models import UserProfile
import pyotp
import qrcode
import io
import base64

class MFASetupView(APIView):
    def get(self, request):
        print('Request arrived at MFASetupView:', request.method, request.path)
        if not request.user.is_authenticated:
            return Response({"message": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

        profile = request.user.profile
        if not profile.mfa_secret:
            secret = pyotp.random_base32()
            profile.mfa_secret = secret
            profile.save()

        otp_uri = pyotp.totp.TOTP(profile.mfa_secret).provisioning_uri(
            name=request.user.email,
            issuer_name="SecureApp"
        )
        qr = qrcode.make(otp_uri)
        buffer = io.BytesIO()
        qr.save(buffer, format="PNG")
        img_str = base64.b64encode(buffer.getvalue()).decode()
        return Response({"qr_code_base64": img_str}, status=status.HTTP_200_OK)

class MFAVerifyView(APIView):
    def post(self, request):
        print('Request arrived at MFAVerifyView:', request.method, request.path, request.data)
        serializer = MFAVerifySerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = request.user
            if not user.is_authenticated:
                return Response({"message": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
            profile = user.profile
            if not profile.mfa_secret:
                return Response({"message": "MFA not set up"}, status=status.HTTP_400_BAD_REQUEST)

            totp = pyotp.TOTP(profile.mfa_secret)
            if totp.verify(serializer.validated_data['code']):
                return Response({"success": True}, status=status.HTTP_200_OK)
            return Response({"message": "Invalid TOTP code"}, status=status.HTTP_401_UNAUTHORIZED)
        print('Serializer errors:', serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)