from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..serializers import RegisterSerializer, LoginSerializer
import pyotp
import qrcode
import io
import base64

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']

            # MFA secret check
            if not user.mfa_secret:
                # Generate new TOTP secret
                secret = pyotp.random_base32()
                user.mfa_secret = secret
                user.save()

                # Generate otpauth URL
                otp_uri = pyotp.totp.TOTP(secret).provisioning_uri(
                    name=user.email or user.username,
                    issuer_name="SecureApp"
                )

                # Generate QR Code image
                qr = qrcode.make(otp_uri)
                buffer = io.BytesIO()
                qr.save(buffer, format="PNG")
                img_str = base64.b64encode(buffer.getvalue()).decode()

                return Response({
                    "mfa_setup_required": True,
                    "qr_code_base64": img_str,
                    "message": "Scan this QR in Google Authenticator and enter the code via /api/mfa/verify"
                }, status=status.HTTP_200_OK)

            return Response({
                "mfa_required": True,
                "message": "Enter your 6-digit TOTP code via /api/mfa/verify"
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
