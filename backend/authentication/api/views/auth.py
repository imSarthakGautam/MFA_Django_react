# authentication/api/views/auth.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from ..serializers.auth import RegisterSerializer, LoginSerializer
from ...models import UserProfile
import pyotp
import qrcode
import io
import base64

class RegisterView(APIView):
    authentication_classes = []  # Bypass JWT authentication
    permission_classes = [AllowAny]  # Allow unauthenticated access

    def post(self, request):
        print('Request arrived at RegisterView:', request.method, request.path, request.data)
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            profile = user.profile
            # Generate MFA secret and QR code
            if not profile.mfa_secret:
                secret = pyotp.random_base32()
                profile.mfa_secret = secret
                profile.save()
                otp_uri = pyotp.totp.TOTP(secret).provisioning_uri(
                    name=user.email,
                    issuer_name="SecureApp"
                )
                qr = qrcode.make(otp_uri)
                buffer = io.BytesIO()
                qr.save(buffer, format="PNG")
                img_str = base64.b64encode(buffer.getvalue()).decode()
            else:
                img_str = None  # In case MFA is already set (unlikely)
            refresh = RefreshToken.for_user(user)
            return Response({
                "token": str(refresh.access_token),
                "user": {"email": user.email},
                "mfaRequired": True,
                "qr_code_base64": img_str
            }, status=status.HTTP_201_CREATED)
        print('Serializer errors:', serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    authentication_classes = []  # Bypass JWT authentication
    permission_classes = [AllowAny]  # Allow unauthenticated access

    def post(self, request):
        print('Request arrived at LoginView:', request.method, request.path, request.data)
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            profile = user.profile

            if not profile.mfa_secret:
                secret = pyotp.random_base32()
                profile.mfa_secret = secret
                profile.save()
                otp_uri = pyotp.totp.TOTP(secret).provisioning_uri(
                    name=user.email,
                    issuer_name="SecureApp"
                )
                qr = qrcode.make(otp_uri)
                buffer = io.BytesIO()
                qr.save(buffer, format="PNG")
                img_str = base64.b64encode(buffer.getvalue()).decode()
                refresh = RefreshToken.for_user(user)
                return Response({
                    "token": str(refresh.access_token),
                    "user": {"email": user.email},
                    "mfaRequired": True,
                    "qr_code_base64": img_str
                }, status=status.HTTP_200_OK)

            refresh = RefreshToken.for_user(user)
            return Response({
                "token": str(refresh.access_token),
                "user": {"email": user.email},
                "mfaRequired": True
            }, status=status.HTTP_200_OK)
        print('Serializer errors:', serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)