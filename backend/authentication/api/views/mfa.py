from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from ..serializers import MFAVerifySerializer
from authentication.models import CustomUser

class MFAVerifyView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def post(self, request):
        user = request.user

        # If not logged in via session, fallback to manual lookup
        if not user or user.is_anonymous:
            username = request.data.get("username")
            user_obj = CustomUser.objects.filter(username=username).first()
            if not user_obj:
                return Response({"detail": "Invalid user"}, status=status.HTTP_400_BAD_REQUEST)
            user = user_obj

        serializer = MFAVerifySerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            user.save()

            # Issue JWT
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "MFA verification successful",
                "access": str(refresh.access_token),
                "refresh": str(refresh)
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
